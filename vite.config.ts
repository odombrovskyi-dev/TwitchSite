import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Inlines the built CSS directly into index.html instead of a separate
// <link rel="stylesheet">, removing it as a render-blocking network
// request from the critical path. Worth it specifically for this site:
// the whole stylesheet is a single small (~5.5 KB gzipped) bundle, it's a
// single-page app with no other pages to share a cached CSS file with,
// and GitHub Pages already caps all caching at 10 minutes regardless -
// so there's no meaningful separate-caching benefit being given up.
function inlineCss(): Plugin {
  let cssContent = ''
  return {
    name: 'inline-css',
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName]
        if (fileName.endsWith('.css') && chunk.type === 'asset') {
          cssContent += chunk.source
          delete bundle[fileName]
        }
      }
    },
    transformIndexHtml(html) {
      return html
        .replace(/<link[^>]*rel="stylesheet"[^>]*>\n?/, '')
        .replace('</head>', `    <style>${cssContent}</style>\n  </head>`)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), inlineCss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
