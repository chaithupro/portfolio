import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

import CanvasLoader from "../Loader";

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

const Computers = ({ isMobile }) => {
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
    }
  }, [computer]);

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
          scale={isMobile ? 0.7 : 0.75}
          position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
          rotation={[-0.01, -0.2, -0.1]}
        />
      </mesh>
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 1.5]} // Reduced DPR for better performance
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ 
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
        antialias: false // Disable antialiasing for better performance
      }}
      performance={{ min: 0.5 }} // Allow throttling for better performance
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
