import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import { shouldUseSimplifiedUI, isMobileDevice } from "../../utils/deviceDetection";

// Static Earth image component for mobile devices
const StaticEarthImage = () => {
  return (
    <div className="w-full h-80 flex items-center justify-center">
      <div className="relative w-full max-w-xs mx-auto">
        <div className="absolute -z-10 inset-0 rounded-full bg-gradient-to-br from-blue-500 via-blue-700 to-indigo-900 blur-lg opacity-50"></div>
        <img 
          src="https://cdn.pixabay.com/photo/2021/01/17/14/18/earth-5925051_1280.jpg" 
          alt="Earth Globe" 
          className="w-full h-auto rounded-full shadow-lg shadow-purple-900/30 border-2 border-indigo-800/30"
          style={{ 
            objectFit: 'cover',
            aspectRatio: '1/1'
          }}
        />
      </div>
    </div>
  );
};

// Simple 2D Earth component for low-end desktop devices
const SimplifiedEarth = () => {
  return (
    <div className="w-full h-80 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-700 to-indigo-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://cdn.pixabay.com/photo/2013/07/12/19/16/globe-154805_1280.png')] bg-contain bg-no-repeat bg-center opacity-70 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-primary opacity-40"></div>
    </div>
  );
};

const Earth = ({ isMobile }) => {
  const earth = useGLTF("./planet/scene.gltf");

  return (
    <primitive 
      object={earth.scene} 
      scale={isMobile ? 2 : 2.5} 
      position-y={0} 
      rotation-y={0} 
    />
  );
};

const EarthCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [useSimpleUI, setUseSimpleUI] = useState(false);
  const [isMobileDevice_, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Check if this is a mobile device
    const mobileDev = isMobileDevice();
    setIsMobileDevice(mobileDev);
    
    // Check if this is a low-end device
    setUseSimpleUI(shouldUseSimplifiedUI());
    
    // Check if device is mobile based on screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // For mobile devices, render a static image
  if (isMobileDevice_) {
    return <StaticEarthImage />;
  }
  
  // For low-end desktop devices, render a simplified version
  if (useSimpleUI) {
    return <SimplifiedEarth />;
  }

  return (
    <Canvas
      shadows
      frameloop='demand'
      dpr={isMobile ? [0.8, 1.5] : [1, 2]} // Lower resolution on mobile
      gl={{ 
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
        antialias: !isMobile // Disable antialiasing on mobile
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          autoRotateSpeed={isMobile ? 0.5 : 1} // Slower rotation on mobile
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth isMobile={isMobile} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
