import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { isMobileDevice, isLowEndDevice, getRenderingSettings } from "../../utils/device";

const Stars = (props) => {
  const ref = useRef();
  // Reduce number of particles for mobile devices
  const [sphere] = useState(() => {
    const isMobile = isMobileDevice();
    const particleCount = isMobile ? 2000 : 5000;
    return random.inSphere(new Float32Array(particleCount), { radius: 1.2 });
  });

  useFrame((state, delta) => {
    // Slow down rotation on mobile devices to improve performance
    const rotationSpeed = isMobileDevice() ? 0.5 : 1.0;
    ref.current.rotation.x -= delta / 10 * rotationSpeed;
    ref.current.rotation.y -= delta / 15 * rotationSpeed;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [renderSettings, setRenderSettings] = useState({});

  // Check device capabilities
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      const mobile = isMobileDevice();
      const lowEnd = isLowEndDevice();
      setIsMobile(mobile);
      setIsLowEnd(lowEnd);
      setRenderSettings(getRenderingSettings());
    };
    
    checkDeviceCapabilities();
    window.addEventListener('resize', checkDeviceCapabilities);
    
    return () => {
      window.removeEventListener('resize', checkDeviceCapabilities);
    };
  }, []);

  if (isLowEnd) {
    // For low-end devices, return a simple gradient background instead of 3D stars
    return (
      <div className='w-full h-auto absolute inset-0 z-[-1] bg-gradient-to-b from-primary to-black-100' />
    );
  }

  return (
    <div className='w-full h-auto absolute inset-0 z-[-1]'>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={renderSettings.dpr || [1, 2]}
        frameloop={renderSettings.frameloop || 'always'}
        gl={{
          powerPreference: renderSettings.powerPreference || 'default',
          antialias: renderSettings.antialias !== undefined ? renderSettings.antialias : true,
        }}
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
