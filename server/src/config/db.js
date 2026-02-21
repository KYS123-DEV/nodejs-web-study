/*  db.js */
/*  접속 정보 획득   */

const sql = require('mssql');

let pool;

function makeDbConfig() {
  return {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    options: { encrypt: false, trustServerCertificate: true },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
  };
}

async function getDbPool() {
  if (pool) return pool;

  pool = await new sql.ConnectionPool(makeDbConfig()).connect();
  return pool;
}

module.exports = { getDbPool, sql };