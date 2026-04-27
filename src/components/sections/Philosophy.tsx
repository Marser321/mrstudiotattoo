import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current || !lineRef.current) return;

    // Smooth section entrance
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 95%',
          end: 'top 60%',
          scrub: 1,
        }
      }
    );

    // Line drawing animation
    gsap.fromTo(lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: true,
        }
      }
    );

    // Items stagger animation
    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      const isLeft = i % 2 === 0;
      
      gsap.fromTo(item,
        { 
          opacity: 0, 
          x: isLeft ? -60 : 60, 
          y: 30,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, { scope: containerRef });

  const timelineData = [
    {
      title: "Precisión Quirúrgica",
      desc: "Evitamos el temido 'blowout'. La línea fina real requiere un dominio maestro de la aguja y la anatomía humana.",
      img: "/assets/images/tattoo_philosophy_1_1776270063317.png",
      tag: "01 / DISEÑO"
    },
    {
      title: "Contraste Puro",
      desc: "Negros absolutos que se difuminan con maestría en los espacios negativos, creando dimensión nativa en la piel.",
      img: "/assets/images/tattoo_philosophy_2_1776270116935.png",
      tag: "02 / SOMBRAS"
    },
    {
      title: "Inmortalidad",
      desc: "Diseños escalados anatómicamente para curar perfectamente y envejecer con gracia junto a tu cuerpo.",
      img: "/assets/images/tattoo_philosophy_3_1776270132196.png",
      tag: "03 / CURACIÓN"
    }
  ];

  return (
    <section ref={containerRef} id="philosophy" className="relative w-full py-20 md:py-24 px-4 md:px-8 overflow-hidden z-20">
      
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-20">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-primary mb-4 border-b border-primary/20 pb-4 w-max">
          Nuestra Filosofía
        </p>
        <h2 className="font-serif text-5xl md:text-7xl leading-[0.85] uppercase drop-shadow-md">
          El Dolor es <br /> 
          <span className="italic font-light text-muted-foreground">Temporal.</span>
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* The Central Scrollytelling Line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-border/30 origin-top -translate-x-1/2">
          <div ref={lineRef} className="w-full h-full bg-primary origin-top shadow-[0_0_15px_var(--primary)]"></div>
        </div>

        {/* Timeline Items */}
        <div className="flex flex-col gap-24 md:gap-32 relative pt-10">
          {timelineData.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div 
                key={idx} 
                ref={el => { itemsRef.current[idx] = el }}
                className={`relative flex flex-col md:flex-row items-center justify-between w-full
                            ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} pl-16 md:pl-0`}
              >
                {/* Timeline node marker */}
                <div className="absolute left-[20px] md:left-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full z-10 -translate-x-1/2 shadow-[0_0_10px_var(--primary)] text-[10px] text-primary flex items-center justify-center font-bold"></div>

                {/* Content Block */}
                <div className={`w-full md:w-[45%] flex flex-col ${isLeft ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} luxury-glass p-8`}>
                  <span className="text-[10px] text-primary font-sans tracking-widest border border-primary/20 px-3 py-1 mb-4 rounded-sm bg-primary/5">{item.tag}</span>
                  <h3 className="font-serif text-3xl mb-4">{item.title}</h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Image Block */}
                <div className="w-full md:w-[45%] mt-8 md:mt-0 relative group">
                  <div className="aspect-[4/5] overflow-hidden border border-border/50">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale opacity-70 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" loading="lazy" />
                  </div>
                  {/* Decorative corner accents */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-primary"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-primary"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
