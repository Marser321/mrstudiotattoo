import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Mr. Tato Standalone Video Sequence Engine
 * 
 * INSTRUCTIONS:
 * 1. Place your 600 frames in: /public/assets/hero-sequence-v4/
 *    Format: frame_000.webp to frame_599.webp
 * 2. Ensure GSAP is installed: npm install gsap
 */

interface MrTatoVideoSequenceProps {
  frameCount?: number;
  imagePattern?: (index: number) => string;
  pinDistanceVh?: number; // Distance of the scroll effect
}

export function MrTatoVideoSequence({ 
  frameCount = 600, 
  imagePattern = (i) => `/assets/hero-sequence-v4/frame_${i.toString().padStart(3, '0')}.webp`,
  pinDistanceVh = 520
}: MrTatoVideoSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // 1. Preloader Logic
  useEffect(() => {
    let mounted = true;
    const loadedFrames: HTMLImageElement[] = [];
    let count = 0;

    const loadFrame = (index: number) => {
      const img = new Image();
      img.src = imagePattern(index);
      img.onload = () => {
        if (!mounted) return;
        count++;
        setLoadedCount(count);
        if (count === frameCount) {
          setIsReady(true);
        }
      };
      loadedFrames[index] = img;
    };

    for (let i = 0; i < frameCount; i++) {
      loadFrame(i);
    }
    framesRef.current = loadedFrames;

    return () => { mounted = false; };
  }, [frameCount, imagePattern]);

  // 2. Animation Sync Logic
  useEffect(() => {
    if (!isReady || !canvasRef.current || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set internal resolution
    canvas.width = 1920;
    canvas.height = 1080;

    const renderFrame = (index: number) => {
      const img = framesRef.current[index];
      if (!img) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Aspect ratio management (Object-fit: cover equivalent)
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > canvasRatio) {
        drawW = img.width * (canvas.height / img.height);
        drawH = canvas.height;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = canvas.width;
        drawH = img.height * (canvas.width / img.width);
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      }

      context.drawImage(img, drawX, drawY, drawW, drawH);
    };

    // Initial frame
    renderFrame(0);

    const sequenceProxy = { frame: 0 };

    // Scroll-linked animation
    const tl = gsap.to(sequenceProxy, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: `${pinDistanceVh}vh`,
        scrub: 0.1, // Smooth scrub for better feel
        onUpdate: () => renderFrame(sequenceProxy.frame)
      }
    });

    return () => {
       tl.kill();
       ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isReady, frameCount, pinDistanceVh]);

  return (
    <div ref={containerRef} className="mr-tato-sequence-container">
      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${(loadedCount / frameCount) * 100}%` }}
            />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
            Sincronizando Secuencia... {Math.round((loadedCount / frameCount) * 100)}%
          </p>
        </div>
      )}

      {/* Canvas Renderer */}
      <canvas 
        ref={canvasRef} 
        className={`w-full h-full absolute inset-0 object-cover transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      />

      <style>{`
        .mr-tato-sequence-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: #000;
          overflow: hidden;
          z-index: -1;
        }
      `}</style>
    </div>
  );
}
