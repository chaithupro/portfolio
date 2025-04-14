import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['react', 'react-dom', 'framer-motion'],
        }
      }
    },
    // Ensure assets are properly copied
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['three']
  },
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.bin', '**/*.jpg', '**/*.png', '**/*.svg'],
  server: {
    open: true,
    host: true
  },
  // For Netlify
  base: './'
})
