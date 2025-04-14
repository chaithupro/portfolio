import { motion } from "framer-motion";
import { useState, Suspense, useEffect } from "react";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import ErrorBoundary from "./ErrorBoundary";
import { isMobileDevice, isLowEndDevice, supportsWebGL } from "../utils/device";

// Import one of the existing images to use as a fallback
import computerImage from "../assets/web.png";

const Hero = () => {
  const [canvasError, setCanvasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldRender3D, setShouldRender3D] = useState(true);

  // Check device capabilities
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      const mobile = isMobileDevice();
      const lowEnd = isLowEndDevice();
      const webGLSupport = supportsWebGL();
      
      setIsMobile(mobile);
      // Only render 3D if not a low-end device and WebGL is supported
      setShouldRender3D(!lowEnd && webGLSupport);
    };
    
    checkDeviceCapabilities();
    window.addEventListener('resize', checkDeviceCapabilities);
    
    return () => {
      window.removeEventListener('resize', checkDeviceCapabilities);
    };
  }, []);

  const handleCanvasError = () => {
    console.error("3D canvas failed to load");
    setCanvasError(true);
    setIsLoading(false);
    setShouldRender3D(false);
  };

  // Set loading to false after a timeout to prevent indefinite loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect to homepage if canvas error persists for too long
  useEffect(() => {
    let redirectTimer;
    if (canvasError) {
      // If canvas error occurs, set a timer to redirect to homepage
      redirectTimer = setTimeout(() => {
        console.log("Redirecting to homepage due to persistent canvas error");
        window.location.href = '/';
      }, 5000); // 5 seconds before redirect
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [canvasError]);

  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <style>
        {`
          @media (max-width: 640px) {
            .scroll-button {
              bottom: 40px !important;
            }
          }
          @media (min-width: 641px) {
            .scroll-button {
              bottom: -20px !important;
            }
          }
        `}
      </style>

      <div
        className={`absolute inset-0 top-[80px] max-w-6xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div className="z-10 max-w-3xl">
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className='text-[#915EFF]'>Amogh</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            Software Developer Creating Seamless Interfaces <br className='sm:block hidden' />
            Where Code Meets Creativity and <br className='lg:block hidden' />
            Brings Ideas to Reality
          </p>
        </div>
      </div>

      <ErrorBoundary redirectToHome={true}>
        {!shouldRender3D ? (
          // Simple mobile-friendly static content instead of 3D model
          <div className="w-full h-[60vh] flex items-center justify-center">
            <div className="text-center p-5">
              <div className="relative mx-auto max-w-full max-h-[300px]">
                <img 
                  src={computerImage} 
                  alt="Computer Workstation" 
                  className="mx-auto max-w-full h-auto max-h-[300px] object-contain"
                  style={{ 
                    opacity: 0.5, 
                    filter: "brightness(0.7) contrast(0.9) saturate(0.8)"
                  }}
                />
              </div>
              <p className="text-secondary mt-4 text-lg">
                Full Stack Developer
              </p>
            </div>
          </div>
        ) : (
          // Full 3D experience for desktop
          <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center">
              <p className="text-white">Loading 3D Model...</p>
            </div>
          }>
            {isLoading && (
              <div className="w-full h-screen flex items-center justify-center">
                <p className="text-white">Loading 3D Model...</p>
              </div>
            )}
            {!canvasError ? (
              <ComputersCanvas onError={handleCanvasError} />
            ) : (
              <div className="w-full h-[60vh] flex items-center justify-center">
                <div className="bg-tertiary p-8 rounded-xl text-center max-w-md">
                  <h3 className="text-white text-xl mb-2">3D Model Failed to Load</h3>
                  <p className="text-secondary">Redirecting to homepage...</p>
                </div>
              </div>
            )}
          </Suspense>
        )}
      </ErrorBoundary>

      <div className="scroll-button" style={{ position: 'absolute', bottom: '0px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 20 }}>
        <a href='#about' className="block p-4">
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
