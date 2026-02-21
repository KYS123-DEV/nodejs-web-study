import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/': 'http://localhost:3000',
      // 필요하면 다른 API prefix도 추가
    },
  },
});