import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 개발 서버(5173)로 들어온 /api/* 요청을 Spring Boot(8080)로 전달
      // 브라우저 입장에서는 같은 출처(5173)로 요청하므로 CORS가 발생하지 않음
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
