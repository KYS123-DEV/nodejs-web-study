const admin = require('../config/firebaseAdmin');

/**********************************************************/
// 설명     : Firebase 인증 처리
exports.sessionLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body ?? {};
    if (!idToken) {
      return res.status(400).json({ ok: false, message: "idToken이 필요합니다." });
    }

    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7일
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    res.cookie("session", sessionCookie, {
      httpOnly: true,
      secure: false, /*process.env.NODE_ENV === "production",*/
      sameSite: "lax",
      maxAge: expiresIn,
    });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
/**********************************************************/

/**********************************************************/
// Request  : '/mainboard'
// 설명     : 로그인 성공 후, 메인 화면으로 이동
exports.requireAuth = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies?.session;
    if (!sessionCookie) return res.redirect("/signin");

    await admin.auth().verifySessionCookie(sessionCookie, true);
    
    return next();
  } catch (e) {
    //return res.redirect("/signin");
    return res.status(401).json({ ok: false });
  }
};
/**********************************************************/