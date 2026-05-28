import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitHub Pages: https://edgareum.github.io/Minnie/
  base: '/Minnie/',
  // Disable Vite's publicDir hoisting so images stay at public/N.jpg
  // This matches GitHub Pages where files are served at /Minnie/public/N.jpg
  publicDir: false,
})
