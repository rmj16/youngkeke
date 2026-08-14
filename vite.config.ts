import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(currentDirectory, 'src/assets', filename)
      }
    },
  }
}

const r = (p) => path.resolve(currentDirectory, p)

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    // 도메인별 alias. 더 구체적인 것을 먼저 두어 '@' 가 이들을 삼키지 않게 한다.
    alias: [
      { find: '@components', replacement: r('./src/components') },
      { find: '@features', replacement: r('./src/features') },
      { find: '@pages', replacement: r('./src/pages') },
      { find: '@styles', replacement: r('./src/styles') },
      { find: '@', replacement: r('./src') },
    ],
  },
})
