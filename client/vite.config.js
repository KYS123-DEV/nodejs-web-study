import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },

  plugins: [
    {
      name: 'force-404-on-signin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith('/api')) return next();  // API는 그대로 통과
          if (req.url.includes('.')) return next();       // 정적 파일(.js .css .png 등)은 통과 (Vite가 제공해야 함)

          // 여기서 /signin 은 404로 강제
          if (req.url === '/signin' || req.url.startsWith('/signin/')) {
            const filePath = path.join(__dirname, './public/pages/404.html'); // 프로젝트 루트에 404.html
            const html = fs.readFileSync(filePath, 'utf-8');

            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.end(html);
          }

          // 그 외 라우팅은 기존대로
          next();
        });
      },
    },
  ],
});