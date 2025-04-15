/**
 * Utility functions for device detection and performance optimization
 */

/**
 * Checks if the current device is a mobile device
 * @returns {boolean} True if the device is a mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Checks if the device is an Android device
 * @returns {boolean} True if the device is an Android device
 */
export const isAndroidDevice = () => {
  return /Android/i.test(navigator.userAgent);
};

/**
 * Checks if the current device is a low-end device (mobile with limited resources)
 * @returns {boolean} True if the device is a low-end device
 */
export const isLowEndDevice = () => {
  const mobile = isMobileDevice();
  
  // Always return true for Android devices to prevent 3D model loading
  if (isAndroidDevice()) return true;
  
  // Only check hardware constraints for mobile devices
  if (!mobile) return false;
  
  // Check hardware concurrency (CPU cores)
  const cpuCores = navigator.hardwareConcurrency || 0;
  
  // Check device memory if available
  const deviceMemory = navigator.deviceMemory || 0;
  
  // Consider it a low-end device if it's mobile AND has either:
  // - Less than 4 CPU cores, OR
  // - Less than 4GB of RAM (if available)
  return mobile && (cpuCores < 4 || deviceMemory < 4);
};

/**
 * Gets device capability level (high, medium, low)
 * @returns {string} Device capability level
 */
export const getDeviceCapabilityLevel = () => {
  if (isLowEndDevice()) {
    return 'low';
  }
  
  if (isMobileDevice()) {
    return 'medium';
  }
  
  return 'high';
};

/**
 * Checks if the device supports WebGL
 * @returns {boolean} True if the device supports WebGL
 */
export const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

/**
 * Get appropriate rendering settings based on device capability
 * @returns {Object} Object with rendering settings
 */
export const getRenderingSettings = () => {
  const capabilityLevel = getDeviceCapabilityLevel();
  
  switch (capabilityLevel) {
    case 'low':
      return {
        dpr: [0.5, 1.0],
        powerPreference: 'low-power',
        antialias: false,
        alpha: false,
        stencil: false,
        precision: 'lowp',
        frameloop: 'demand',
      };
    case 'medium':
      return {
        dpr: [0.8, 1.5],
        powerPreference: 'default',
        antialias: false,
        alpha: false,
        stencil: false,
        precision: 'mediump',
        frameloop: 'demand',
      };
    case 'high':
    default:
      return {
        dpr: [1, 2],
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true,
        stencil: true,
        precision: 'highp',
        frameloop: 'always',
      };
  }
}; 