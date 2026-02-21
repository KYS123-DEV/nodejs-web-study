const { getDbPool, sql } = require('../config/db');

/**********************************************************/
//DB 단 로그인 검증 함수 호출
exports.findUserByUserInfo = async (userId, password) => {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('userId', sql.NVarChar, userId)
    .input('password', sql.NVarChar, password)
    .query(`
      SELECT *
      FROM syusr01t
      WHERE userid = @userId
      AND password = @password
    `);

  return result.recordset[0] || null;
}
/**********************************************************/