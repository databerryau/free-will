import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base + hash routing: the build works at any path, including
// https://databerryau.github.io/free-will/
export default defineConfig({
  base: './',
  plugins: [react()],
})
