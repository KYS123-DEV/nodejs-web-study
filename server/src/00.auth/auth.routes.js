const path = require('path');
const router = require('express').Router();
const userController = require('../10.user/user.controller');
const authController = require('../00.auth/auth.controller');
const admin = require('../config/firebaseAdmin');

/**********************************************************/
// Request  : '/', '/pages
// 설명     : 로그인 화면으로 이동
router.get(['/','/signin'], async (req, res) => {
  try
  {
    const sessionCookie = req.cookies?.session;

    if (!sessionCookie) return res.sendFile(path.join(__dirname, '../../../client/index.html'));

    // 쿠키 있으면 유효한지 검증
    await admin.auth().verifySessionCookie(sessionCookie, true);

    // 유효하면 곧바로 메인으로
    return res.redirect('/mainboard');
  }
  catch(err)
  {
    // 쿠키가 있어도 만료/위조면 로그인 화면으로
    return res.sendFile(path.join(__dirname, '../../../client/index.html'));
  }
});
/**********************************************************/

/**********************************************************/
// Request  : '/auth/login'
// 설명     : 로그인 검증
router.post('/login', userController.login);
/**********************************************************/

/**********************************************************/
// Request  : '/auth/sessionLogin'
// 설명     : 구글 로그인 사용자 검증 (토큰)
router.post('/sessionLogin', authController.sessionLogin);
/**********************************************************/

/**********************************************************/
// Request  : '/mainboard'
// 설명     : 로그인 성공 후, 메인 페이지 이동 (토큰 있는지 검증)
router.get('/mainboard', authController.requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/public/pages/mainboard.html'));
});
/**********************************************************/

module.exports = router;