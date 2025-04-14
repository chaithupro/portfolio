import React, { useState, useEffect } from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { isMobileDevice, isLowEndDevice } from "../utils/device";

const Tech = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);

  // Check device capabilities
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      setIsMobile(isMobileDevice());
      setIsLowEnd(isLowEndDevice());
    };
    
    checkDeviceCapabilities();
    window.addEventListener('resize', checkDeviceCapabilities);
    
    return () => {
      window.removeEventListener('resize', checkDeviceCapabilities);
    };
  }, []);
  
  return (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {technologies.map((technology) => (
        <div className='w-28 h-28' key={technology.name}>
          {isMobile || isLowEnd ? (
            // Static image for mobile or low-end devices
            <div className="flex flex-col items-center justify-center h-full">
              <img 
                src={technology.icon} 
                alt={technology.name}
                className="w-16 h-16 object-contain"
              />
              <p className="text-center text-secondary mt-2 text-sm">{technology.name}</p>
            </div>
          ) : (
            // 3D icons for desktop
            <BallCanvas icon={technology.icon} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
