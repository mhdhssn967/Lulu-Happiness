import React, { useState, useEffect } from 'react';
import logo from '../assets/happinesslogo.webp';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    // Simulate loading progress over 2 seconds
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Pause briefly at 100%, then slide up
        setTimeout(() => {
          setIsSliding(true);
          // Wait for transition to finish before unmounting
          setTimeout(() => {
            onComplete();
          }, 700); 
        }, 400); 
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F3F73] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isSliding ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="flex flex-col items-center w-full max-w-[200px]">
        <img 
          src={logo} 
          alt="LuLu Happiness Logo" 
          className="w-3/4 mb-10 object-contain" 
        />
        
        {/* Progress Bar Container */}
        <div className="w-1/2 h-1 bg-white/20 rounded-full overflow-hidden">
          {/* Progress Bar Fill */}
          <div 
            className="h-full bg-[#9CCA3B] transition-all duration-75 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
