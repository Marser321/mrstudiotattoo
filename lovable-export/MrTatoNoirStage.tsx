import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Mr. Tato Modular Noir Background
 * 
 * INSTRUCTIONS:
 * 1. Place this component INSIDE the container you want to have the Noir background.
 * 2. The parent container must have 'position: relative' and 'overflow: hidden'.
 * 3. This component will fill the entire space of its parent.
 */

interface MrTatoNoirBackgroundProps {
  className?: string;
  intensity?: number; // 0 to 1
}

export function MrTatoNoirBackground({ className = '', intensity = 1 }: MrTatoNoirBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;
    
    const paths = containerRef.current.querySelectorAll('path.ink-trace');
    
    const ctx = gsap.context(() => {
      paths.forEach((path: any) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0.1 * intensity
        });
        
        gsap.to(path, {
          strokeDashoffset: 0,
          opacity: 0.35 * intensity,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current, // Triggered by the background container itself
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [intensity]);

  return (
    <div ref={containerRef} className={`mr-tato-noir-bg ${className}`}>
      {/* Dynamic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/60 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0505] via-transparent to-black/40 z-0" />
      
      {/* SVG Ink Traces */}
      <svg 
        className="absolute inset-0 w-full h-full stroke-white fill-none pointer-events-none z-0 opacity-40"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1000 1500"
      >
        <g>
          <path className="ink-trace" strokeWidth="2" d="M 100 100 C 200 150, 150 300, 300 400 S 500 200, 600 500 C 700 800, 200 900, 400 1200" />
          <circle className="ink-trace" cx="600" cy="500" r="100" strokeWidth="1" />
          <path className="ink-trace" strokeWidth="1.5" d="M 400 1200 Q 500 1100 600 1200" />
        </g>
      </svg>

      {/* Grains & Noise */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10 mr-tato-grain" />

      <style>{`
        .mr-tato-noir-bg {
          position: absolute;
          inset: 0;
          background-color: #000;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }

        .mr-tato-grain {
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
}
