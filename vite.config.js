// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Billion/', // 一定要是你的仓库名，区分大小写
  plugins: [react()],
})
