import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  root: __dirname,
  build: {
    outDir: 'dist'
  },
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/node-v24*/**', '**/.env', '**/vite.config.ts']
    },
    fs: {
      allow: [__dirname, resolve(__dirname, 'public')]
    }
  }
})