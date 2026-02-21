const userRepo = require('../10.user/user.repository');

/**********************************************************/
//로그인 검증을 위한 작업 후 DB 단 로그인 검증 함수 호출
exports.login = async (userId, password) => {
  const user = await userRepo.findUserByUserInfo(userId, password);
  if (!user) return null;
  return user;
}
/**********************************************************/