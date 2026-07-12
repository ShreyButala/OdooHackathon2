import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // SPA fallback — serve index.html for all 404s so client-side routing works
  // on direct navigation to /dashboard, /login, etc.
  preview: {
    port: 4173,
  },
})

