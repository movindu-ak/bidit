import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "react-i18next", "i18next"],
    alias: {
      '@shared': path.resolve(__dirname, '../../shared'),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-i18next": path.resolve(__dirname, "node_modules/react-i18next"),
      i18next: path.resolve(__dirname, "node_modules/i18next")
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-i18next", "i18next"]
  }
})
