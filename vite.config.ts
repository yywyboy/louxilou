import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const markdownPlugin = () => {
  return {
    name: 'markdown-plugin',
    resolveId(id) {
      if (id.endsWith('.md')) {
        return id
      }
      return null
    },
    async load(id) {
      if (id.endsWith('.md')) {
        const content = readFileSync(id, 'utf-8')
        return `export default ${JSON.stringify(content)}`
      }
      return null
    }
  }
}

export default defineConfig({
  plugins: [markdownPlugin(), vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})