// This file contains patches to fix compatibility issues between Three.js versions

/**
 * Apply patches for Three.js compatibility
 * This should fix issues with BatchedMesh not being exported
 */
export function applyThreePatches() {
  try {
    // Only apply in browser environment
    if (typeof window === 'undefined') return;
    
    const THREE = window.THREE;
    if (!THREE) return;
    
    // Add BatchedMesh if it doesn't exist
    if (!THREE.BatchedMesh) {
      console.log('Patching THREE.BatchedMesh');
      THREE.BatchedMesh = class BatchedMesh {
        constructor() {
          console.warn('BatchedMesh is not available in this Three.js version');
        }
      };
    }
    
    console.log('Three.js patches applied successfully');
  } catch (error) {
    console.error('Error applying Three.js patches:', error);
  }
} 