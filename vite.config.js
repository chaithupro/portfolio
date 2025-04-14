import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Fix for BatchedMesh issue
    {
      name: 'batched-mesh-fix',
      transform(code, id) {
        if (id.includes('three-mesh-bvh') && id.includes('ExtensionUtilities.js')) {
          // Remove the BatchedMesh import that causes issues
          return code.replace(/import { BatchedMesh } from 'three';/, '// BatchedMesh import removed');
        }
      }
    }
  ],
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
      },
      // Exclude problematic modules from bundling
      external: ['three-mesh-bvh/src/utils/BatchedMesh.js']
    },
    // Ensure assets are properly copied
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['three'],
    // Exclude problematic dependencies
    exclude: ['three-mesh-bvh/src/utils/BatchedMesh.js']
  },
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.bin', '**/*.jpg', '**/*.png', '**/*.svg'],
  server: {
    open: true,
    host: true
  },
  // For Netlify
  base: './'
})
