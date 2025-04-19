import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

import CanvasLoader from "../Loader";
import { isMobileDevice, isLowEndDevice, isAndroidDevice, getRenderingSettings } from "../../utils/device";

// Configure draco loader to improve performance
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

// Configure GLTF loader with Draco support
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Preload the model to avoid loading delays on component mount
useGLTF.preload("./desktop_pc/scene.gltf", true, (loader) => {
  loader.setDRACOLoader(dracoLoader);
});

const Computers = ({ isMobile, onLoaded }) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const groupRef = useRef();
  
  // Use draco compressed model if available or handle the regular model
  const computer = useGLTF("./desktop_pc/scene.gltf", true, (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });

  // Mark model as loaded
  useEffect(() => {
    if (computer && computer.scene) {
      setModelLoaded(true);
      // Call the onLoaded callback if provided
      if (onLoaded && typeof onLoaded === 'function') {
        onLoaded();
      }
      
      // Optimize geometry for mobile devices
      if (isMobile && computer.scene) {
        computer.scene.traverse((child) => {
          if (child.isMesh) {
            // Reduce polygon count for mobile devices
            if (child.geometry) {
              const simplifiedGeometry = child.geometry.clone();
              // Disable frustum culling optimization
              child.frustumCulled = false;
              
              // Reduce material complexity
              if (child.material) {
                // Simplify materials by disabling expensive features
                child.material.precision = 'lowp'; // Use low precision
                child.material.fog = false; // Disable fog
                child.material.flatShading = true; // Use flat shading
                
                // Disable reflections and expensive effects
                if (child.material.envMap) child.material.envMap = null;
                child.material.needsUpdate = true;
              }
            }
          }
        });
      }
    }
  }, [computer, isMobile, onLoaded]);

  // Apply progressive appearance
  useFrame(() => {
    if (groupRef.current && !modelLoaded) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <hemisphereLight intensity={0.15} groundColor='black' />
        <spotLight
          position={[-20, 50, 10]}
          angle={0.12}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight intensity={1} />
        
        {/* Show a placeholder while loading */}
        {!modelLoaded && (
          <mesh position={[0, -3, -1.5]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#555555" wireframe />
          </mesh>
        )}
        
        {/* Actual model */}
        <primitive
          object={computer.scene}
          scale={isMobile ? 0.6 : 0.75} // Smaller scale for mobile
          position={isMobile ? [0, -2.25, -2.2] : [0, -2.5, -1.5]} // Adjusted position to middle ground
          rotation={[-0.01, -0.2, -0.1]}
        />
      </mesh>
    </group>
  );
};

const ComputersCanvas = ({ onError, onLoaded }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [renderSettings, setRenderSettings] = useState({});

  useEffect(() => {
    try {
      // Check device capabilities
      const checkDeviceCapabilities = () => {
        const mobile = isMobileDevice();
        const lowEnd = isLowEndDevice();
        const android = isAndroidDevice();
        setIsMobile(mobile);
        setIsLowEnd(lowEnd);
        setIsAndroid(android);
        setRenderSettings(getRenderingSettings());
      };
      
      checkDeviceCapabilities();
      
      // Add a listener for changes to the screen size
      const mediaQuery = window.matchMedia("(max-width: 500px)");

      // Define a callback function to handle changes to the media query
      const handleMediaQueryChange = (event) => {
        setIsMobile(event.matches || isMobileDevice());
        checkDeviceCapabilities();
      };

      // Add the callback function as a listener for changes to the media query
      mediaQuery.addEventListener("change", handleMediaQueryChange);

      // Remove the listener when the component is unmounted
      return () => {
        mediaQuery.removeEventListener("change", handleMediaQueryChange);
      };
    } catch (error) {
      console.error("Error in ComputersCanvas:", error);
      if (onError) onError();
    }
  }, [onError]);

  // If it's a low-end device or Android device, don't render the 3D canvas at all
  if (isLowEnd || isAndroid) {
    // Tell parent component that model is "loaded" (actually skipped)
    useEffect(() => {
      if (onLoaded && typeof onLoaded === 'function') {
        onLoaded();
      }
    }, [onLoaded]);

    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="text-center p-5">
          <img 
            src="/desktop_pc/computer_static.png" 
            alt="Computer Workstation" 
            className="mx-auto max-w-full h-auto max-h-[300px] object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/hero-fallback.jpg"; // Fallback image if main one fails
            }}
          />
          <p className="text-secondary mt-4 text-lg">
            Developer
          </p>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      frameloop={renderSettings.frameloop || 'always'}
      shadows
      dpr={renderSettings.dpr || [1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ 
        preserveDrawingBuffer: true,
        powerPreference: renderSettings.powerPreference || 'default',
        antialias: renderSettings.antialias !== undefined ? renderSettings.antialias : true,
        alpha: renderSettings.alpha !== undefined ? renderSettings.alpha : true,
        stencil: renderSettings.stencil !== undefined ? renderSettings.stencil : true,
        depth: true
      }}
      performance={{ min: isMobile ? 0.3 : 0.5 }} // Lower minimum performance on mobile
      onError={onError}
      className="!absolute !top-[50px] !left-0 !z-0"
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          // Reduce sensitivity on mobile
          rotateSpeed={isMobile ? 0.5 : 1}
          enableDamping={!isMobile} // Disable damping on mobile
          enablePan={false}
        />
        <Computers isMobile={isMobile} onLoaded={onLoaded} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
