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
    }
  },
  optimizeDeps: {
    include: ['three']
  },
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.bin'],
  server: {
    open: true,
    host: true
  }
})
