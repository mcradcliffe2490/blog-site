import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // The deploy sets this while the site lives at <user>.github.io/blog-site/.
  base: process.env.BASE_PATH || '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@content': fileURLToPath(new URL('../content', import.meta.url))
    },
  },
  server: {
    fs: {
      // Posts live in ../content, outside the Vite root.
      allow: ['..']
    }
  }
})
