import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface CanvasScrubberProps {
  frameCount: number;
  framePathFallback: string; // e.g., "/assets/hero/frame_{index}.jpg"
  heightFactor?: string; // e.g., "300vh" determines how much scrolling space is used
  children?: React.ReactNode; // Content to overlay on the canvas
}

export function CanvasScrubber({ frameCount, framePathFallback, heightFactor = '300vh', children }: CanvasScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playhead = useRef({ frame: 0 });
  
  // Storage for loaded Image objects
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));
  
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Pad numbers, e.g., 1 -> "0001" if your path uses that.
  // For simplicity, we just assume 1 -> "1" using the {index} token.
  const getFramePath = (index: number) => {
    // 1-indexed to match typical render outputs
    const paddedIndex = (index + 1).toString().padStart(4, '0');
    // Si la ruta utiliza {index}, la reemplazamos. Si no, lo pegamos asumiendo que el desarrollador provee la estructura exacta
    return framePathFallback.replace('{index}', paddedIndex);
  };

  const renderFrame = useCallback((index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    
    // Draw only within requestAnimationFrame to batch paints gracefully
    requestAnimationFrame(() => {
      // Scale to cover
      const hRatio = canvas.width / img!.width;
      const vRatio = canvas.height / img!.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img!.width * ratio) / 2;
      const centerShift_y = (canvas.height - img!.height * ratio) / 2;  
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img!, 0, 0, img!.width, img!.height,
                        centerShift_x, centerShift_y, img!.width * ratio, img!.height * ratio);
    });
  }, []);

  // Intersection Observer to trigger loading ONLY when the section is near viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasStartedLoading) {
        setHasStartedLoading(true);
      }
    }, { rootMargin: '200px' });
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [hasStartedLoading]);

  // Image load orchestrator
  useEffect(() => {
    if (!hasStartedLoading) return;

    let loaded = 0;
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        // Preload but don't force a render of all, just keep them in memory
        img.onload = () => {
            imagesRef.current[i] = img;
            loaded++;
            setLoadedCount(loaded);
            
            // Render the first frame explicitly once it is loaded
            if (i === 0 && playhead.current.frame === 0) {
               renderFrame(0);
            }
        };
    }
  }, [hasStartedLoading, frameCount, framePathFallback, renderFrame]);

  // Manage responsive Canvas sizing
  useEffect(() => {
    const handleResize = () => {
       if(canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
          // rerender the current active frame to avoid blank spaces on resize
          renderFrame(playhead.current.frame);
       }
    };
    
    handleResize(); // Init size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrame]);

  // The math and GSAP bindings
  useGSAP(() => {
    // Tie the numeric frame object directly to the ScrollTrigger progress
    gsap.to(playhead.current, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${heightFactor}`, 
        scrub: 1,  // The smooth interpolation for backwards/forwards
        pin: true, // Anchor it to the screen while scrubbing
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
         // Because snap:"frame" ensures it rounds to closest int, we can safely index
         renderFrame(playhead.current.frame);
      }
    });
  }, { scope: containerRef, dependencies: [frameCount] });

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: heightFactor }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-background">
         {/* Lienzo al que delegamos la carga en el motor de bajo nivel del navegador */}
         <canvas 
           ref={canvasRef} 
           className="absolute inset-0 w-full h-full object-cover z-0" 
         />
         
         {/* Overlay content over the canvas */}
         <div className="relative z-10 w-full h-full pointer-events-none">
           <div className="pointer-events-auto h-full">
             {children}
           </div>
         </div>

         {/* Simple loading bar strictly for developmental auditing */}
         {loadedCount < frameCount && loadedCount > 0 && (
           <div className="absolute top-0 left-0 h-1 bg-primary/50 z-50 transition-all duration-300" style={{ width: `${(loadedCount / frameCount) * 100}%` }}></div>
         )}
      </div>
    </div>
  );
}
