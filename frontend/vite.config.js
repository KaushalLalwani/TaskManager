import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const frontendDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      axios: path.resolve(frontendDir, 'src/lib/axios.js'),
      'react-router-dom': path.resolve(frontendDir, 'src/lib/react-router-dom.jsx'),
    },
  },
})
