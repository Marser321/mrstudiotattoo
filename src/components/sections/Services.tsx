import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: '✦',
    title: 'Fine Line',
    desc: 'Diseños delicados con líneas precisas. Cada trazo es calculado, cada detalle es intencional. Perfecto para minimalistas.',
    price: 'Desde $100',
  },
  {
    icon: '◎',
    title: 'Realismo',
    desc: 'Retratos hiper-realistas en blanco y negro que capturan la esencia de tus momentos y personas más queridas.',
    price: 'Desde $300',
  },
  {
    icon: '⬡',
    title: 'Geométrico',
    desc: 'Patrones geométricos y mandalas de precisión matemática. Líneas perfectas que crean armonía visual.',
    price: 'Desde $150',
  },
  {
    icon: '◈',
    title: 'Custom Artwork',
    desc: 'Diseños personalizados únicos creados en colaboración directa contigo. Tu visión, nuestra maestría.',
    price: 'Consultar',
  },
  {
    icon: '⟐',
    title: 'Cover-Ups',
    desc: 'Transformamos tatuajes existentes en obras maestras nuevas. Maestría en rediseño y cobertura.',
    price: 'Consultar',
  },
  {
    icon: '⊕',
    title: 'Consultas',
    desc: 'Sesión de diseño y planificación sin compromiso. Discutimos ideas, referencias y presupuesto juntos.',
    price: 'Gratis',
  },
];

const stats = [
  { value: '19K+', label: 'Seguidores' },
  { value: '430+', label: 'Trabajos' },
  { value: '5.0', label: 'Rating' },
  { value: '10+', label: 'Años' },
];

export function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Staggered card entrance
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Stats counter animation
    if (statsRef.current) {
      gsap.fromTo(statsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="services" className="relative w-full py-32 px-4 md:px-16 lg:px-32 overflow-hidden">
      
      {/* Decorative accent orb */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[200px] pointer-events-none"></div>

      {/* Stats Bar */}
      <div ref={statsRef} className="max-w-6xl mx-auto mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 luxury-glass p-8 md:p-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span className="font-serif text-4xl md:text-5xl text-primary font-bold tracking-tight">{stat.value}</span>
              <span className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground mt-2">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-primary mb-4 border-b border-primary/20 pb-4 w-max">
          Nuestros Servicios
        </p>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-4">
          SERVI<span className="italic font-light text-primary">CIOS</span>
        </h2>
        <p className="font-sans text-muted-foreground max-w-lg text-sm md:text-base leading-relaxed">
          Servicios diseñados para ti. Desde líneas finas hasta realismo hiper-detallado, cada servicio es una promesa de excelencia.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <div
            key={service.title}
            ref={el => { cardsRef.current[idx] = el }}
            className="group relative luxury-glass p-8 border border-border/30 hover:border-primary/30 transition-all duration-500 cursor-default overflow-hidden"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Icon */}
            <div className="text-primary text-3xl mb-6 group-hover:scale-110 transition-transform duration-500">{service.icon}</div>
            
            {/* Content */}
            <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">{service.desc}</p>
            
            {/* Price tag */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs tracking-widest uppercase text-primary/70">{service.price}</span>
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                Más Info →
              </span>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
