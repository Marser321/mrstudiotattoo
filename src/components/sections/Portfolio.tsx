import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function Portfolio() {
  const containerRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const artworks = [
    { id: 1, img: '/assets/images/tattoo_portfolio_1_1776269943484.png', span: 'col-span-1 row-span-1' },
    { id: 2, img: '/assets/images/tattoo_portfolio_3_1776269971624.png', span: 'col-span-2 row-span-2' },
    { id: 3, img: '/assets/images/tattoo_portfolio_2_1776269957765.png', span: 'col-span-1 row-span-1' },
    { id: 4, img: '/assets/images/tattoo_portfolio_4_1776270028982.png', span: 'col-span-1 row-span-1' },
    { id: 5, img: '/assets/images/tattoo_portfolio_5_1776270044512.png', span: 'col-span-1 row-span-1' },
  ];

  useGSAP(() => {
    if (!containerRef.current) return;

    itemsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-32 px-4 md:px-16 lg:px-32 bg-transparent overflow-hidden" id="portfolio">
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-4">
          PORT<span className="italic font-light text-primary">FOLIO</span>
        </h2>
        <p className="font-sans text-muted-foreground max-w-lg text-sm md:text-base leading-relaxed">
          Nuestras piezas son narrativas visuales grabadas en la piel. Explora nuestro archivo de trabajos maestras.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 auto-rows-[200px] md:auto-rows-[300px]">
        {artworks.map((art, idx) => (
          <div 
            key={art.id} 
            ref={el => { itemsRef.current[idx] = el }}
            className={`relative group rounded-3xl overflow-hidden luxury-glass border border-border/50 ${art.span}`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ backgroundImage: `url(${art.img})` }}
            ></div>
            <div className="absolute inset-x-0 bottom-0 p-4 pb-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col justify-end">
               <span className="text-white font-sans text-xs uppercase tracking-widest">+ Ver Detalle</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* "Needle Magic" section from T-art reference */}
      <div className="max-w-6xl mx-auto mt-32 flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <h2 className="font-serif text-5xl md:text-6xl mb-6">Needle <span className="text-primary italic">Magic</span></h2>
          <p className="text-muted-foreground font-sans text-sm mb-8 leading-relaxed">
            Dedicamos años a perfeccionar cada pulso. Nuestro equipamiento de vanguardia asegura que cada trazo cure con una consistencia inquebrantable, superando los estándares clínicos.
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground font-sans text-xs tracking-widest uppercase rounded-full hover:scale-105 transition-transform magnetic-element shadow-lg shadow-primary/20">
            Leer Más
          </button>
        </div>
        <div className="w-full md:w-1/2">
          <div className="rounded-3xl overflow-hidden luxury-glass shadow-2xl relative aspect-[4/3] group">
            <img src="/assets/images/tattoo_artist_1776269987044.png" alt="Tattoo artist working" className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
