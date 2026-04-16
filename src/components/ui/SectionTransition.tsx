import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  /** Visual variant of the transition */
  variant?: 'fade' | 'line' | 'gradient';
  /** Height in viewport units */
  height?: string;
  /** Whether to show a decorative accent line */
  accent?: boolean;
}

export function SectionTransition({ 
  variant = 'fade', 
  height = '20vh',
  accent = false 
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    // Fade in the transition element itself
    gsap.fromTo(ref.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          end: 'bottom 60%',
          scrub: true,
        }
      }
    );

    // Animate the accent line if present
    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
            end: 'bottom 50%',
            scrub: true,
          }
        }
      );
    }
  }, { scope: ref });

  if (variant === 'line') {
    return (
      <div 
        ref={ref}
        className="relative w-full flex items-center justify-center"
        style={{ height }}
        aria-hidden="true"
      >
        <div className="w-full max-w-6xl mx-auto px-8">
          <div 
            ref={lineRef}
            className="w-full h-[1px] origin-left"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
              opacity: 0.3,
            }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div 
        ref={ref}
        className="relative w-full pointer-events-none"
        style={{ height }}
        aria-hidden="true"
      >
        {/* Top fade from section above */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          }}
        />
        {accent && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-8">
            <div 
              ref={lineRef}
              className="w-full h-[1px] origin-center"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                opacity: 0.2,
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Default: 'fade' variant
  return (
    <div 
      ref={ref}
      className="relative w-full pointer-events-none"
      style={{ height }}
      aria-hidden="true"
    >
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(var(--primary-rgb, 220,38,38), 0.03) 0%, transparent 70%)',
        }}
      />
      {accent && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-primary/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
          <div className="w-[1px] h-8 bg-gradient-to-t from-transparent to-primary/20" />
        </div>
      )}
    </div>
  );
}
