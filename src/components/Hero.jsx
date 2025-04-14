import { motion } from "framer-motion";
import { useState, Suspense, useEffect } from "react";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import ErrorBoundary from "./ErrorBoundary";
import { shouldUseSimplifiedUI } from "../utils/deviceDetection";
// Direct import of images we can use if laptop_placeholder.png is not available
import webImage from "../assets/web.png";
import mobileImage from "../assets/mobile.png";

// Simple placeholder component for mobile/low-end devices
const SimpleLaptopView = () => {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="relative">
          <img 
            src={webImage} // Use imported image directly
            alt="Developer Workspace" 
            className="w-full max-w-md mx-auto object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center p-4 bg-black bg-opacity-50 rounded-lg">
              <h2 className="text-xl font-bold">Full Stack Developer</h2>
              <p>Crafting digital experiences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [canvasError, setCanvasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useSimpleUI, setUseSimpleUI] = useState(false);

  useEffect(() => {
    // Check device capability on mount
    setUseSimpleUI(shouldUseSimplifiedUI());
    
    // Set loading to false after a timeout to prevent indefinite loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timer);
  }, []);

  const handleCanvasError = () => {
    console.error("3D canvas failed to load");
    setCanvasError(true);
    setIsLoading(false);
  };

  // Redirect to homepage if canvas error persists for too long
  useEffect(() => {
    let redirectTimer;
    if (canvasError && !useSimpleUI) {
      // If canvas error occurs, set a timer to redirect to homepage
      redirectTimer = setTimeout(() => {
        console.log("Redirecting to homepage due to persistent canvas error");
        window.location.href = '/';
      }, 5000); // 5 seconds before redirect
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [canvasError, useSimpleUI]);

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
          
          .animate-blob {
            animation: blob-bounce 7s infinite;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          @keyframes blob-bounce {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(20px, 20px) scale(1.1);
            }
            50% {
              transform: translate(0, 20px) scale(1);
            }
            75% {
              transform: translate(-20px, 0) scale(0.9);
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

      <ErrorBoundary redirectToHome={false}>
        {useSimpleUI ? (
          <SimpleLaptopView />
        ) : (
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
              <SimpleLaptopView />
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
