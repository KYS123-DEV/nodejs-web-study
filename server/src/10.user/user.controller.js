const authService = require('./user.service');

/**********************************************************/
// POST /auth/login → DB로 사용자 검증 후 JSON 응답
// 추가 주석 : 인자가 4개면 -> 에러 핸들러, 인자가 3개면 -> 일반 미들웨어
// next는 Express의 “흐름 제어 엔진”이고 res.headersSent는 “이중 응답 방지 안전장치".
exports.login = async (req, res, next) => {
  try {
    //throw Object.assign(new Error('test error'), { status: 500 });
    const { userId, password } = req.body ?? {};

    if (!userId || !password) {
      return res.status(400).json({
        ok: false,
        message: 'userId와 password는 필수입니다.',
      });
    }

    const user = await authService.login(userId, password);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    // 반환 user는 최소 정보만
    const safeUser = {
      id: user.id,
      userId: user.userId,
      name: user.name,
    };

    return res.status(200).json({
      ok: true,
      data: { user: safeUser },
    });
  } catch (err) {
    next(err); // 에러 핸들러로 보내기
  }
};
/**********************************************************/