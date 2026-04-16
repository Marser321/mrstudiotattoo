import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function InkBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    // Select all paths that should act as "tattoo ink"
    const paths = containerRef.current.querySelectorAll("path.ink-trace")
    
    paths.forEach((path: any) => {
      // Calculate length for the drawing effect
      const length = path.getTotalLength()
      
      // Setup initial state: dasharray and dashoffset
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      })
      
      // Animate the strokeDashoffset on scroll
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5, // Smooth scrubbing
        }
      })
    })

    // Floating tattoos animation
    const tattoos = containerRef.current.querySelectorAll(".floating-tattoo");
    tattoos.forEach((tattoo: any, index) => {
      // Parallax effect on scroll
      gsap.to(tattoo, {
        y: () => -1 * (150 + index * 100), // Different speeds
        rotation: () => index % 2 === 0 ? 15 : -15,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[-1] pointer-events-none transition-opacity duration-1000 overflow-hidden"
    >
      {/* SVG Container wrapping abstract tattoo-like illustrations */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="absolute inset-0 w-full h-full stroke-black dark:stroke-white fill-none opacity-[0.15] dark:opacity-[0.25]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1000 3000"
      >
        <g className="opacity-60">
           <path className="ink-trace" strokeWidth="2" d="M 100 100 C 200 150, 150 300, 300 400 S 500 200, 600 500 C 700 800, 200 900, 400 1200 S 800 1300, 500 1700 C 200 2100, 900 2200, 700 2600 S 200 2800, 500 3000" />
           <path className="ink-trace" strokeWidth="1" d="M 150 120 L 220 200 L 180 320" />
           
           <circle className="ink-trace" cx="600" cy="500" r="150" strokeWidth="1" />
           <polygon className="ink-trace" points="400,1200 500,1050 600,1200" strokeWidth="1.5" />
           <circle className="ink-trace" cx="500" cy="1700" r="200" strokeWidth="0.5" />
           <circle className="ink-trace" cx="500" cy="1700" r="220" strokeWidth="0.5" />
           
           <path className="ink-trace" strokeWidth="2" d="M 700 2600 Q 800 2500 900 2600 T 700 2800" />
           <path className="ink-trace" strokeWidth="1" d="M 50 1500 C 100 1400, 200 1450, 250 1550" />
           <path className="ink-trace" strokeWidth="1" d="M 800 400 C 900 300, 950 400, 850 500S 750 600, 800 400" />
           
           <path className="ink-trace" strokeWidth="3" d="M 300 400 L 320 450 L 310 470" />
           <path className="ink-trace" strokeWidth="3" d="M 700 800 L 750 750 L 780 770" />
        </g>
      </svg>

      {/* Floating background tattoos */}
      <div className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.08]">
        <img 
          src="/assets/images/tattoo_portfolio_1_1776269943484.png" 
          className="floating-tattoo absolute top-[10%] left-[5%] w-[400px] h-[400px] object-cover rounded-full mix-blend-difference blur-[2px] grayscale" 
          alt="" 
        />
        <img 
          src="/assets/images/tattoo_portfolio_2_1776269957765.png" 
          className="floating-tattoo absolute top-[30%] right-[10%] w-[350px] h-[350px] object-cover rounded-full mix-blend-difference blur-[1px] grayscale" 
          alt="" 
        />
        <img 
          src="/assets/images/tattoo_portfolio_5_1776270044512.png" 
          className="floating-tattoo absolute top-[60%] left-[15%] w-[500px] h-[500px] object-cover rounded-[30%] mix-blend-difference blur-[3px] grayscale" 
          alt="" 
        />
        <img 
          src="/assets/images/tattoo_portfolio_4_1776270028982.png" 
          className="floating-tattoo absolute top-[85%] right-[5%] w-[450px] h-[450px] object-cover rounded-[30%] mix-blend-difference blur-[2px] grayscale" 
          alt="" 
        />
      </div>

      {/* Grain overlay for luxury feel */}
      <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none noise-bg"></div>
    </div>
  )
}
