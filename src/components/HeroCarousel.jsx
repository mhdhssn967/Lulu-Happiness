import React, { useState, useEffect } from 'react';

import ImageWithSkeleton from './ImageWithSkeleton';

const hero1 = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fhero.webp?alt=media';
const hero2 = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fhero1.webp?alt=media';
const hero3 = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fhero2.webp?alt=media';
const hero4 = 'https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fhero3.webp?alt=media';

const heroBanners = [hero1, hero2, hero3, hero4];

export default function HeroCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isDragging]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!touchStart || !touchEnd) {
      setTouchStart(0);
      setTouchEnd(0);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    } else if (isRightSwipe) {
      setCurrentBanner((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const dragOffset = isDragging && touchEnd ? touchEnd - touchStart : 0;

  return (
    <div className="px-4 pt-4 pb-2 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
      <div 
        className="relative w-full h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-[#0A294F] touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`flex w-full h-full ${!isDragging ? 'transition-transform duration-[600ms] ease-[cubic-bezier(0.34,1.2,0.64,1)]' : ''}`}
          style={{ transform: `translateX(calc(-${currentBanner * 100}% + ${dragOffset}px))` }}
        >
          {heroBanners.map((banner, index) => (
            <div key={index} className="w-full h-full shrink-0">
              <ImageWithSkeleton 
                src={banner} 
                alt={`Promo Banner ${index + 1}`} 
                className="w-full h-full pointer-events-none select-none"
                imageClassName="pointer-events-none select-none" 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {heroBanners.map((_, index) => (
          <div 
            key={index} 
            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentBanner ? 'w-5 bg-happiness-lime' : 'w-2 bg-white/30'}`} 
          />
        ))}
      </div>
    </div>
  );
}
