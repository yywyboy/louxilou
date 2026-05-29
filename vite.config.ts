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
      ignored: ['**/vue-framework/**', '**/node_modules/**', '**/.git/**', '**/node-v24*/**']
    },
    fs: {
      allow: [__dirname, resolve(__dirname, 'public')],
      deny: ['$RECYCLE.BIN', 'System Volume Information', 'node-v24.15.0-win-x64']
    }
  }
})