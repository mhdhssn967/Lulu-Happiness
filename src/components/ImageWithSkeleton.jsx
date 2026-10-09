import React, { useState } from 'react';

export default function ImageWithSkeleton({ src, alt, className, imageClassName }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Skeleton Background */}
      <div 
        className={`absolute inset-0 bg-[#1A1F2E] transition-opacity duration-500 rounded-inherit ${isLoaded ? 'opacity-0 pointer-events-none' : 'animate-pulse opacity-100'}`} 
      />
      
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${imageClassName || ''} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
