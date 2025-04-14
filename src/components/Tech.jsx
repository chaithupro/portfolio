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
              <div className="w-16 h-16 rounded-full bg-tertiary flex items-center justify-center p-2">
                <img 
                  src={technology.icon} 
                  alt={technology.name}
                  className="w-12 h-12 object-contain filter brightness-110 contrast-110"
                  style={{ 
                    filter: technology.name === "Next Js" || 
                            technology.name === "Postgres" || 
                            technology.name === "SQL" || 
                            technology.name === "git" ? 
                            "brightness(1.8) contrast(1.2) invert(0.2)" : 
                            "brightness(1.1) contrast(1.1)" 
                  }}
                />
              </div>
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
