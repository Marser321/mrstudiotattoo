import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import './FloatingBookingButton.css';

export function FloatingBookingButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    // Scroll listener for Home page lateral scroll section
    const handleScroll = () => {
      if (!isHome) {
        setIsCollapsed(true); // Default to bubble on other pages
        return;
      }
      
      const threshold = window.innerHeight * 5.1; // Slightly before the 520vh mark for better feel
      if (window.scrollY > threshold) {
        if (!isCollapsed) setIsCollapsed(true);
      } else {
        if (isCollapsed) setIsCollapsed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome, isCollapsed]);

  useEffect(() => {
    if (!containerRef.current || !buttonRef.current || !textRef.current || !iconRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Only perform entrance animation on initial mount
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
        paddingTop: isCollapsed ? '0' : '0.75rem',
        paddingBottom: isCollapsed ? '0' : '0.75rem',
        paddingLeft: isCollapsed ? '0' : '1.5rem',
        paddingRight: isCollapsed ? '0' : '1.5rem',
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
  }, []); // Run only once

  // Enhanced Magnetic Effect for Bubble
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
    <div ref={containerRef} className="booking-fab-container">
      <Link 
        ref={buttonRef}
        to="/booking" 
        className={cn(
          "booking-fab",
          isCollapsed && "is-collapsed",
          !isCollapsed && "magnetic-element"
        )}
      >
        <div className="pulse-ring"></div>
        <div ref={iconRef} className="booking-fab-icon">
          <Calendar size={isCollapsed ? 28 : 16} strokeWidth={isCollapsed ? 1.5 : 2} />
        </div>
        <span ref={textRef}>Book your session</span>
      </Link>

    </div>
  );
}

