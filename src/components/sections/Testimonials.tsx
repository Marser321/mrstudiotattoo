import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'Reinier es un artista increíble. Mi tatuaje superó todas mis expectativas. Precisión, limpieza, profesionalismo absoluto.',
    author: 'Raidel B.',
    rating: 5,
    service: 'Realismo',
  },
  {
    quote: 'Amé este lugar. El equipo es muy atento y el resultado es hermoso. Recomendación total para cualquiera que busque calidad.',
    author: 'Stephanie M.',
    rating: 5,
    service: 'Fine Line',
  },
  {
    quote: 'El mejor estudio en Miami. Artistas de nivel mundial con precios justos. Ya tengo programada mi siguiente sesión.',
    author: 'Carlos R.',
    rating: 5,
    service: 'Custom Artwork',
  },
  {
    quote: 'Viajé desde Nueva York específicamente para tatuar aquí. La atención al detalle es incomparable. Cada línea es perfecta.',
    author: 'Andrea L.',
    rating: 5,
    service: 'Geométrico',
  },
  {
    quote: 'Transformaron un viejo tatuaje que odiaba en una obra de arte. El cover-up quedó increíble, ni se nota que había algo antes.',
    author: 'Miguel F.',
    rating: 5,
    service: 'Cover-Up',
  },
];

export function Testimonials() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonialsList = [
    {
      quote: t('testimonials.items.0.quote', { defaultValue: testimonials[0].quote }),
      author: t('testimonials.items.0.author', { defaultValue: testimonials[0].author }),
      rating: 5,
      service: t('testimonials.items.0.service', { defaultValue: testimonials[0].service }),
    },
    {
      quote: t('testimonials.items.1.quote', { defaultValue: testimonials[1].quote }),
      author: t('testimonials.items.1.author', { defaultValue: testimonials[1].author }),
      rating: 5,
      service: t('testimonials.items.1.service', { defaultValue: testimonials[1].service }),
    },
    {
      quote: t('testimonials.items.2.quote', { defaultValue: testimonials[2].quote }),
      author: t('testimonials.items.2.author', { defaultValue: testimonials[2].author }),
      rating: 5,
      service: t('testimonials.items.2.service', { defaultValue: testimonials[2].service }),
    },
    {
      quote: t('testimonials.items.3.quote', { defaultValue: testimonials[3].quote }),
      author: t('testimonials.items.3.author', { defaultValue: testimonials[3].author }),
      rating: 5,
      service: t('testimonials.items.3.service', { defaultValue: testimonials[3].service }),
    },
    {
      quote: t('testimonials.items.4.quote', { defaultValue: testimonials[4].quote }),
      author: t('testimonials.items.4.author', { defaultValue: testimonials[4].author }),
      rating: 5,
      service: t('testimonials.items.4.service', { defaultValue: testimonials[4].service }),
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 95%',
          end: 'top 65%',
          scrub: 1,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-20 md:py-24 px-4 md:px-16 lg:px-32 overflow-hidden">
      
      {/* Decorative accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[250px] pointer-events-none"></div>

      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-20">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-primary mb-4 border-b border-primary/20 pb-4 w-max">
          {t('testimonials.eyebrow')}
        </p>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-4">
          {t('testimonials.title1')}<span className="italic font-light text-primary">{t('testimonials.title2')}</span>
        </h2>
        <p className="font-sans text-muted-foreground max-w-lg text-sm md:text-base leading-relaxed">
          {t('testimonials.desc')}
        </p>
      </div>

      {/* Fade-based Carousel */}
      <div className="max-w-3xl mx-auto relative">
        <div className="relative min-h-[320px] md:min-h-[280px]">
          {testimonialsList.map((t, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                idx === activeIndex
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <div className="luxury-glass p-10 md:p-16 border border-border/30 w-full">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-8">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-primary text-lg">★</span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8 italic">
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex flex-col items-center gap-2">
                  <span className="font-sans text-sm font-medium tracking-wide">— {t.author}</span>
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-primary/60">{t.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonialsList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === activeIndex
                  ? 'bg-primary w-8'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev/Next Arrows */}
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-10 h-10 md:w-12 md:h-12 rounded-full border border-border/30 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300 text-muted-foreground backdrop-blur-sm"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => setActiveIndex((prev) => (prev + 1) % testimonialsList.length)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-10 h-10 md:w-12 md:h-12 rounded-full border border-border/30 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300 text-muted-foreground backdrop-blur-sm"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
