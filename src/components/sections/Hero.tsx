import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function Hero() {
  const imageBlockRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!imageBlockRef.current) return;
    gsap.fromTo(imageBlockRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: "power3.out" }
    );
  });

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center px-4 md:px-16 lg:px-32 pt-32 pb-16">
      
      {/* Decorative Red Blur Orbs matching "Tattoo Anatomy" ref */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>
      
      <div className="w-full flex flex-col lg:flex-row items-center justify-between z-10 gap-16 relative">
        
        {/* Left Typography Block */}
        <div className="flex flex-col items-start max-w-2xl">
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[8rem] leading-[0.8] tracking-widest text-foreground uppercase drop-shadow-lg mb-4">
            MR STUDIO
            <br />
            <span className="text-primary italic font-light tracking-tighter">TATO</span>
          </h1>
          
          <p className="text-muted-foreground font-sans text-sm md:text-base mb-8 max-w-md leading-relaxed border-l-[3px] border-primary pl-6">
            Dominando la aguja y la piel. Cada línea es una obra maestra,
            diseñada meticulosamente para reflejar tu propia esencia y perdurar
            en la eternidad. Tu piel es nuestro lienzo.
          </p>

          <button className="group relative px-10 py-5 bg-primary text-primary-foreground font-sans text-xs tracking-widest uppercase overflow-hidden hover:scale-105 transition-transform duration-500 magnetic-element shadow-[0_0_40px_-10px_var(--primary)]">
            <span className="relative z-10">Agenda Gratis</span>
            <div className="absolute inset-0 h-full w-full bg-black/20 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 z-0"></div>
          </button>
        </div>

        {/* Right Image Block with bleeding crop */}
        <div ref={imageBlockRef} className="relative w-full lg:w-[45%] h-[600px] luxury-glass p-2 shrink-0" style={{ opacity: 0 }}>
          <div className="w-full h-full overflow-hidden">
            <img src="/assets/images/tattoo_portfolio_1_1776269943484.png" alt="Tattoo masterpiece" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          </div>
          
          {/* Subtle overlay accent */}
          <div className="absolute -bottom-6 -left-6 border border-primary/30 w-32 h-32 backdrop-blur-md flex items-center justify-center p-4">
            <p className="text-[10px] uppercase tracking-widest text-primary text-center">Arte y Sangre</p>
          </div>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <div className="w-[1px] h-24 bg-gradient-to-b from-primary to-transparent animate-pulse"></div>
      </div>
    </section>
  );
}
