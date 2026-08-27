'use client';

import React from 'react';

/**
 * Majblomman Animation - Premium Swedish Design
 * Flowers float from bottom to top across the entire page
 */
const MajblommanAnimation = () => {
  
  // Premium Majblomman with realistic details
  const Majblomma = ({ petalColor = '#FFFFFF', centerColor = '#FFD700', size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: 'block' }}>
      <defs>
        {/* Gradient for center depth */}
        <radialGradient id={`center-grad-${petalColor.replace('#', '')}`}>
          <stop offset="0%" stopColor={centerColor} stopOpacity="1" />
          <stop offset="70%" stopColor={centerColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#DAA520" stopOpacity="0.7" />
        </radialGradient>
        
        {/* Subtle petal gradient */}
        <radialGradient id={`petal-grad-${petalColor.replace('#', '')}`}>
          <stop offset="0%" stopColor={petalColor} stopOpacity="1" />
          <stop offset="100%" stopColor={petalColor} stopOpacity="0.85" />
        </radialGradient>
      </defs>
      
      {/* Outer petals - 8 petals in classic daisy arrangement */}
      <g>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={i}
            cx="60"
            cy="25"
            rx="10"
            ry="20"
            fill={`url(#petal-grad-${petalColor.replace('#', '')})`}
            stroke="#f0f0f0"
            strokeWidth="1"
            transform={`rotate(${angle} 60 60)`}
            opacity="0.95"
          />
        ))}
      </g>
      
      {/* Yellow center with gradient */}
      <circle 
        cx="60" 
        cy="60" 
        r="15" 
        fill={`url(#center-grad-${petalColor.replace('#', '')})`}
        stroke="#E6BE8A"
        strokeWidth="0.5"
      />
      
      {/* Texture dots in center (pollen effect) */}
      <g opacity="0.4">
        <circle cx="57" cy="57" r="1.5" fill="#8B7355" />
        <circle cx="63" cy="57" r="1.5" fill="#8B7355" />
        <circle cx="60" cy="63" r="1.5" fill="#8B7355" />
        <circle cx="57" cy="63" r="1.5" fill="#8B7355" />
        <circle cx="63" cy="63" r="1.5" fill="#8B7355" />
        <circle cx="60" cy="60" r="1.5" fill="#8B7355" />
        <circle cx="54" cy="60" r="1" fill="#8B7355" />
        <circle cx="66" cy="60" r="1" fill="#8B7355" />
      </g>
    </svg>
  );

  // Curated Swedish-inspired color palette
  const swedishColors = [
    // Traditional Majblomman
    { petal: '#FFFFFF', center: '#FFD700', name: 'Klassisk Vit' },
    
    // Swedish flag colors
    { petal: '#FFE135', center: '#006AA7', name: 'Svenska Flaggan' },
    
    // Midsummer pastels
    { petal: '#83e08b', center: '#FFEB3B', name: 'Midsommar Grön' },
    { petal: '#dbba15', center: '#FFA726', name: 'Midsommar Gul' },
    { petal: '#E1BEE7', center: '#AB47BC', name: 'Lila Sommar' },
    
    // Nature-inspired (Swedish landscapes)
    { petal: '#B3E5FC', center: '#0277BD', name: 'Skärgård Blå' },
    { petal: '#C8E6C9', center: '#43A047', name: 'Skog Grön' },
    { petal: '#f44a4a', center: '#FF5722', name: 'Solnedgång' },
    
    // Your Ahlgrens brand colors
    { petal: '#36d2dd', center: '#A8B5A0', name: 'Ahlgrens Cream' },
    { petal: '#86b767', center: '#fa00a7', name: 'Ahlgrens Sage' },
    { petal: '#D4A5A5', center: '#8B7E74', name: 'Ahlgrens Rose' },
    
    // Elegant pastels
    { petal: '#e9749b', center: '#F48FB1', name: 'Rosa Dröm' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Mayflower Floating Animation Container */
        .mayflower-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0; /* Low z-index so it sits behind text but visible */
          overflow: hidden;
        }

        .mayflower {
          position: absolute;
          pointer-events: none;
          will-change: transform, opacity;
          /* CRITICAL FIX: Hide them by default so they don't sit on screen while waiting for delay */
          opacity: 0; 
          top: 100%; /* Force them to start below the screen */
        }

        /* Float from BOTTOM to TOP with rotation */
        @keyframes float-up-rotate {
          0% {
            /* Start well below screen */
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            /* Fade in quickly */
            opacity: 0.8; 
          }
          80% {
            /* Start fading out as they hit the top header area */
            opacity: 0.8;
          }
          100% {
            /* End well ABOVE the screen (-20vh ensures they clear the header completely) */
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Individual flower positions and timings */
        .mayflower-1 { left: 5%; animation: float-up-rotate 28s linear infinite; animation-delay: 0s; }
        .mayflower-2 { left: 15%; animation: float-up-rotate 32s linear infinite; animation-delay: 4s; }
        .mayflower-3 { left: 25%; animation: float-up-rotate 30s linear infinite; animation-delay: 8s; }
        .mayflower-4 { left: 35%; animation: float-up-rotate 27s linear infinite; animation-delay: 12s; }
        .mayflower-5 { left: 45%; animation: float-up-rotate 33s linear infinite; animation-delay: 16s; }
        .mayflower-6 { left: 55%; animation: float-up-rotate 29s linear infinite; animation-delay: 6s; }
        .mayflower-7 { left: 65%; animation: float-up-rotate 31s linear infinite; animation-delay: 10s; }
        .mayflower-8 { left: 75%; animation: float-up-rotate 26s linear infinite; animation-delay: 14s; }
        .mayflower-9 { left: 85%; animation: float-up-rotate 34s linear infinite; animation-delay: 18s; }
        .mayflower-10 { left: 10%; animation: float-up-rotate 30s linear infinite; animation-delay: 2s; }
        .mayflower-11 { left: 50%; animation: float-up-rotate 28s linear infinite; animation-delay: 20s; }
        .mayflower-12 { left: 90%; animation: float-up-rotate 32s linear infinite; animation-delay: 22s; }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .mayflower svg { width: 30px !important; height: 30px !important; }
          .mayflower-9, .mayflower-10, .mayflower-11, .mayflower-12 { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mayflower { display: none; }
        }
      `}} />

      <div className="mayflower-container">
        {[...Array(12)].map((_, index) => {
          const color = swedishColors[index % swedishColors.length];
          
          return (
            <div 
              key={index} 
              className={`mayflower mayflower-${index + 1}`}
              title={color.name}
            >
              <Majblomma 
                petalColor={color.petal}
                centerColor={color.center}
                size={45}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MajblommanAnimation;