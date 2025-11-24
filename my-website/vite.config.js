import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Don't inline assets - just copy them as-is
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  logLevel: 'info',
})
