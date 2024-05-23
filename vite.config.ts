import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      ecma: 5,
      compress: {
        unsafe: false,
        drop_console: true,
        booleans_as_integers: true
      },
      format: {
        ascii_only: true
      }
    }
  }
})
