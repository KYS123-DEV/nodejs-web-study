import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

/*===============*/
// 기본적으로 로그인이 되어 있다면, 곧바로 mainBoard로 이동
/*===============*/

/*===============*/
/* Firebase 설정 */
/*===============*/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//const googleProvider = new GoogleAuthProvider();
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});


/*===============*/
/*메시지 alert    */
/*===============*/
function setMessage(text, type = 'info') {
  //msgEl.dataset.type = type; // CSS로 [data-type="error"] 이런 식으로 스타일 가능
  alert(text);
}

const googleBtn = document.querySelector("#googleLoginBtn");
/*===============*/
/* 1) Firebase 구글 로그인 버튼 이벤트 */
/*===============*/
googleBtn?.addEventListener("click", async () => {
  try {
    // 2) 팝업으로 Google 로그인
    const result = await signInWithPopup(auth, googleProvider);

    // 3) Firebase ID Token(JWT) 받기
    const idToken = await result.user.getIdToken();

    // 4) 서버에 보내서 "세션 쿠키"로 교환
    const res = await fetch("/auth/sessionLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "서버 인증 실패");

    // 5) 이제 쿠키가 저장됨 → 메인으로 이동
    window.location.href = "/mainboard";
  } catch (err) {
    console.error(err);
    alert(err.message || "Google 로그인 실패");
  }
});

/*===============*/
/*로그인 요청    */
/*===============*/
const form = document.querySelector('#loginForm');
const btn = form.querySelector('button[type="submit"]');

if (location.pathname === '/') {
  window.location.replace('/signin');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.querySelector('#loginId')?.value?.trim();
  const password = document.querySelector('#password')?.value ?? '';

  if (!userId || !password) {
    setMessage('아이디와 비밀번호를 입력하세요.', 'error');
    return;
  }

  btn.disabled = true;

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 쿠키 기반(Session/JWT HttpOnly) 쓰면 필수
      body: JSON.stringify({ userId, password }),
    });

    // 응답이 JSON이 아닐 수도 있으니 안전하게
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = data?.message || '로그인에 실패했습니다.';
      setMessage(message, 'error');
      return;
    }

    setMessage('로그인 성공!', 'success');

    window.location.href = '/auth/mainboard';
  } catch (err) {
    console.error(err);
    setMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도하세요.', 'error');
  } finally {
    btn.disabled = false;
  }
});

