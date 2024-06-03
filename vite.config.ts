import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'inline',
        workbox: {
          globPatterns: ['**/*.{js,css,svg,webp}'],
          cleanupOutdatedCaches: true
        },
        manifest: {
          "name": "Telegram View",
          "short_name": "Telegram View",
          "description": "Telegram View - browse Telegram channels quickly and conveniently",
          "start_url": "./",
          "icons": [
            {
              "src": "/icons/android-chrome-192x192.png?v=1",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "/icons/android-chrome-512x512.png?v=1",
              "sizes": "512x512",
              "type": "image/png"
            }
          ],
          // "screenshots": [{
          //   "src": "/meta/screenshots/screen1.jpg",
          //   "sizes": "1280x1966",
          //   "type": "image/jpeg"
          // },
          //   {
          //     "src": "/meta/screenshots/screen2.jpg",
          //     "sizes": "1280x1966",
          //     "type": "image/jpeg"
          //   },
          //   {
          //     "src": "/meta/screenshots/screen3.jpg",
          //     "sizes": "1280x1966",
          //     "type": "image/jpeg"
          //   }
          // ],
          "theme_color": "#000000",
          "background_color": "#000000",
          "display": "standalone"
        }
      })
  ],
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
