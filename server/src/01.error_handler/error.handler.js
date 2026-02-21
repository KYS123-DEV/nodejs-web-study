// 공통 에러 핸들러
module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  // 이미 응답이 시작됐으면 Express 기본 핸들러로 넘김
  if (res.headersSent) return next(err);

  const status = err.status || 500;

  res.status(status).json({
    ok: false,
    message: err.message || '서버 오류',
  });
};