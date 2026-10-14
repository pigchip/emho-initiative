import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/emho-initiative/',
  define: { 'import.meta.env.VITE_BUILD_YEAR': JSON.stringify(String(new Date().getFullYear())) },
  plugins: [react(), tailwindcss()],
})
