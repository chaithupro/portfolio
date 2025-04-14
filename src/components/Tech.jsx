import React, { useState, useEffect } from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { shouldUseSimplifiedUI } from "../utils/deviceDetection";

// Simple 2D version of the tech icon for mobile/low-end devices
const TechIcon = ({ icon, name }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-tertiary shadow-card transition-all duration-300 hover:shadow-lg">
        <img src={icon} alt={name} className="w-16 h-16 object-contain" />
      </div>
      <p className="text-white text-[14px] mt-2">{name}</p>
    </div>
  );
};

const Tech = () => {
  const [useSimpleUI, setUseSimpleUI] = useState(false);
  
  useEffect(() => {
    // Check device capability on mount and window resize
    const checkDevice = () => {
      setUseSimpleUI(shouldUseSimplifiedUI());
    };
    
    checkDevice();
    
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {technologies.map((technology) => (
        <div key={technology.name} className='w-28 h-28'>
          {useSimpleUI ? (
            <TechIcon icon={technology.icon} name={technology.name} />
          ) : (
            <BallCanvas icon={technology.icon} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
