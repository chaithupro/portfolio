// Device detection utility

// Check if the device is a mobile device (Android, iOS, etc.)
export const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for Android
  const isAndroid = /Android/i.test(userAgent);
  
  // Check for iOS
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  
  // Check for Windows Phone
  const isWindowsPhone = /Windows Phone/i.test(userAgent);
  
  // Check for small screen size (typically mobile devices)
  const isSmallScreen = window.innerWidth <= 768;
  
  return isAndroid || isIOS || isWindowsPhone || isSmallScreen;
};

// Check if the device is a low-end device
export const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for memory - if available (some browsers support this)
  if (navigator.deviceMemory) {
    return navigator.deviceMemory <= 4; // 4GB or less RAM
  }
  
  // Check for hardware concurrency (CPU cores)
  if (navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency <= 4; // 4 cores or less
  }
  
  // Fallback - assume mobile devices are lower end
  return isMobileDevice();
};

// Combined check for both mobile and low-end
export const shouldUseSimplifiedUI = () => {
  return isMobileDevice() || isLowEndDevice();
}; 