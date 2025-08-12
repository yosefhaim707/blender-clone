import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use relative base so assets load correctly on GitHub Pages and any subpath
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
