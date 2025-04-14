import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { shouldUseSimplifiedUI } from "../../utils/deviceDetection";

const Stars = (props) => {
  const ref = useRef();
  // Reduce the number of points for mobile devices
  const [sphere] = useState(() => 
    random.inSphere(
      new Float32Array(props.isMobile ? 1500 : 5000), 
      { radius: 1.2 }
    )
  );

  useFrame((state, delta) => {
    // Slower rotation on mobile devices to improve performance
    const rotationSpeed = props.isMobile ? 0.5 : 1;
    ref.current.rotation.x -= delta / (10 / rotationSpeed);
    ref.current.rotation.y -= delta / (15 / rotationSpeed);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={props.isMobile ? 0.003 : 0.002} // Slightly larger points on mobile for better visibility
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const [useSimpleUI, setUseSimpleUI] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if this is a low-end or mobile device
    setUseSimpleUI(shouldUseSimplifiedUI());
    
    // Check screen size for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // For very low-end devices, don't render stars at all
  if (useSimpleUI) {
    return (
      <div className='w-full h-auto absolute inset-0 z-[-1] bg-primary'>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30'></div>
      </div>
    );
  }

  return (
    <div className='w-full h-auto absolute inset-0 z-[-1]'>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={isMobile ? [0.7, 1.5] : [1, 2]} // Lower resolution on mobile
        performance={{ min: isMobile ? 0.2 : 0.5 }} // Allow more aggressive throttling on mobile
        gl={{
          powerPreference: 'high-performance',
          antialias: !isMobile // Disable antialiasing on mobile
        }}
      >
        <Suspense fallback={null}>
          <Stars isMobile={isMobile} />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
