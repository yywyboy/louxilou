import { createServer } from 'file:///C:/Users/30956/AppData/Roaming/npm/node_modules/vite/dist/node/index.js'
import vue from 'file:///C:/Users/30956/AppData/Roaming/npm/node_modules/@vitejs/plugin-vue/dist/index.mjs'
import { resolve } from 'path'

const projectRoot = 'L:/'

const server = await createServer({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
      'vue': 'file:///C:/Users/30956/AppData/Roaming/npm/node_modules/vue/dist/vue.esm-bundler.js',
      'vue-router': 'file:///C:/Users/30956/AppData/Roaming/npm/node_modules/vue-router/dist/vue-router.esm-bundler.js'
    }
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/$RECYCLE.BIN/**', '**/.git/**', '**/node_modules/**']
    }
  },
  root: projectRoot,
  configFile: false,
  optimizeDeps: {
    entries: [resolve(projectRoot, 'index.html')],
    exclude: ['$RECYCLE.BIN']
  }
})

await server.listen()
server.printUrls()
