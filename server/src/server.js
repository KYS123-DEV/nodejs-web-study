/*  server.js */
/*  DB 연결   */
const express = require('express');
const path = require('path');
const { getDbPool } = require('../src/config/db');  //DB POOL 획득
const mainRouter = require('./00.auth/auth.routes');
const errorHandler = require('./01.error_handler/error.handler');
const cookieParser = require('cookie-parser');
//const testRouter = require('./TEST/api-test');  //테스트 용 

//프로그램 시작점
async function main() {
  try {
    await getDbPool();

    const app = express();
    const PORT = process.env.PORT || 3000;
    
    //Body Parsing 설정
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    //Cookie Parser 추가
    app.use(cookieParser());

    //정적 경로 설정 
    app.use(express.static(path.join(__dirname, '../../client/public')));

    //처리 경로 설정 (라우터 설정)
    app.use('/api', mainRouter);

    // 페이지 404 처리
    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, '../.././client/public/pages/404.html'));
    });

    // Global error handler
    app.use(errorHandler);

    //테스트용
    //app.use('/test', testRouter);

    //서버 실행 후, 접속 경로 설정
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

module.exports = { main };