import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';
import gsap from 'gsap';

/**
 * Mr. Tato Standalone Booking Button
 * 
 * INSTRUCTIONS:
 * 1. Install dependencies: npm install gsap lucide-react
 * 2. Ensure Tailwind CSS is configured.
 * 3. Copy this file into your project.
 */

export function MrTatoBookingButton({ initialCollapsed = false }: { initialCollapsed?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  useEffect(() => {
    // Only perform entrance animation on initial mount
    if (!buttonRef.current || !textRef.current || !iconRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      gsap.set(buttonRef.current, { 
        width: 0, 
        height: '2px', 
        paddingLeft: 0, 
        paddingRight: 0,
        opacity: 0,
        backgroundColor: '#dc2626'
      });
      gsap.set([textRef.current, iconRef.current], { opacity: 0, x: -10 });

      tl.to(buttonRef.current, {
        opacity: 1,
        duration: 0.2
      })
      .to(buttonRef.current, {
        width: 'auto',
        minWidth: isCollapsed ? '64px' : '200px',
        duration: 0.8,
        ease: 'expo.inOut'
      })
      .to(buttonRef.current, {
        height: isCollapsed ? '64px' : 'auto',
        borderRadius: isCollapsed ? '50%' : '2px',
        padding: isCollapsed ? '0' : '0.75rem 1.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        duration: 0.6,
        ease: 'expo.out',
        onComplete: () => {
          // Clear inline styles to let CSS classes take control
          gsap.set(buttonRef.current, { clearProps: "width,minWidth,height,borderRadius,padding,backgroundColor" });
        }
      })
      .to([iconRef.current, textRef.current], {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 0.5
      }, '-=0.3');
    });

    return () => ctx.revert();
  }, []);

  // Magnetic Effect
  useEffect(() => {
    if (!buttonRef.current || !isCollapsed) return;

    const btn = buttonRef.current;
    
    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    btn.addEventListener('mousemove', onMouseMove);
    btn.addEventListener('mouseleave', onMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', onMouseMove);
      btn.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isCollapsed]);

  return (
    <>
      <div ref={containerRef} className="mr-tato-fab-container">
        <a 
          ref={buttonRef}
          href="/booking" 
          className={`mr-tato-fab ${isCollapsed ? 'is-collapsed' : 'magnetic-element'}`}
        >
          <div className="pulse-ring"></div>
          <div ref={iconRef} className="fab-icon">
            <Calendar size={isCollapsed ? 28 : 16} strokeWidth={isCollapsed ? 1.5 : 2} />
          </div>
          <span ref={textRef}>Book your session</span>
        </a>
      </div>

      <style>{`
        .mr-tato-fab-container {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          z-index: 9999;
          pointer-events: auto;
        }

        .mr-tato-fab {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(220, 38, 38, 0.4);
          color: #ffffff;
          text-decoration: none;
          font-family: sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          transition: background 0.5s ease, border-radius 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.6s cubic-bezier(0.16, 1, 0.3, 1), height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          width: auto;
          min-width: 200px;
        }

        .mr-tato-fab.is-collapsed {
          width: 64px !important;
          min-width: 64px !important;
          height: 64px !important;
          border-radius: 50% !important;
          padding: 0 !important;
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(24px) saturate(220%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), 0 0 20px rgba(220, 38, 38, 0.15), inset 0 0 12px rgba(255, 255, 255, 0.05);
          overflow: visible;
        }

        .mr-tato-fab.is-collapsed::after {
          content: '';
          position: absolute;
          top: 15%;
          left: 20%;
          width: 25%;
          height: 15%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), transparent);
          border-radius: 50%;
          filter: blur(3px);
          pointer-events: none;
        }

        .mr-tato-fab.is-collapsed span {
          display: none;
        }

        .mr-tato-fab.is-collapsed .fab-icon {
          color: #dc2626;
          filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.5));
          width: 100%;
          height: 100%;
        }

        .fab-icon {
          width: 18px;
          height: 18px;
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border: 1px solid rgba(220, 38, 38, 0.5);
          border-radius: inherit;
          pointer-events: none;
          animation: mr-tato-pulse 2.2s infinite;
          z-index: -1;
        }

        @keyframes mr-tato-pulse {
          0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.9; }
          70% { opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }

        .magnetic-element:hover {
          transform: translateY(-4px);
          background: rgba(0, 0, 0, 0.95);
          border-color: #dc2626;
        }
      `}</style>
    </>
  );
}
