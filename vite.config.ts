import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      ecma: 5,
      compress: {
        drop_console: true
      },
      format: {
        ascii_only: true,
        comments: false,
      }
    }
  }
})
