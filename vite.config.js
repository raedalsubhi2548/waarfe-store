import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed on Vercel at the domain root; deep links are rewritten to index.html (vercel.json)
export default defineConfig({
  plugins: [react()],
  base: '/',
})
