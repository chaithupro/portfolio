import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={props.isMobile ? 0.5 : 1} floatIntensity={props.isMobile ? 1 : 2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={props.isMobile ? 2.25 : 2.75}>
        <icosahedronGeometry args={[1, props.isMobile ? 0 : 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
  // Check if we're on mobile based on screen width
  const isMobile = window.innerWidth <= 768;

  return (
    <Canvas
      frameloop='demand'
      dpr={isMobile ? [0.8, 1.5] : [1, 2]} // Lower resolution on mobile
      gl={{ 
        preserveDrawingBuffer: true,
        antialias: !isMobile // Disable antialiasing on mobile
      }}
      // Only update on user interaction for mobile devices to save power
      style={{
        touchAction: 'none',
        cursor: 'pointer'
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={isMobile ? 0.5 : 1} // Slower rotation on mobile
          autoRotate={!isMobile} // Disable auto rotation on mobile
          autoRotateSpeed={1}
        />
        <Ball imgUrl={icon} isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
