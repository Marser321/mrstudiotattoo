import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const artists = [
  {
    name: 'Reinier Rielo',
    role: 'Fundador & Artista Principal',
    specialties: ['Realismo', 'Fine Line', 'Retratos'],
    experience: '10+ años',
    bio: 'Maestro del realismo con atención obsesiva al detalle. Cada línea es una declaración de precisión artística.',
    img: '/assets/images/tattoo_artist_1776269987044.png',
    instagram: '@reinierrielo',
  },
  {
    name: 'Tony',
    role: 'Artista Destacado',
    specialties: ['Geométrico', 'Custom', 'Mandalas'],
    experience: '7+ años',
    bio: 'Visión creativa sin límites. Transforma ideas abstractas en arte permanente con una precisión matemática única.',
    img: '/assets/images/tattoo_portfolio_3_1776269971624.png',
    instagram: '@tony.ink',
  },
];

export function Artists() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 80, rotateY: i === 0 ? -5 : 5 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1.2,
          delay: i * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-32 px-4 md:px-16 lg:px-32 overflow-hidden">
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[200px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-20">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-primary mb-4 border-b border-primary/20 pb-4 w-max">
          El Equipo
        </p>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-4">
          ARTIS<span className="italic font-light text-primary">TAS</span>
        </h2>
        <p className="font-sans text-muted-foreground max-w-lg text-sm md:text-base leading-relaxed">
          El equipo detrás de la magia. Artistas certificados que combinan técnica impecable con visión artística sin límites.
        </p>
      </div>

      {/* Artists Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {artists.map((artist, idx) => (
          <div
            key={artist.name}
            ref={el => { cardsRef.current[idx] = el }}
            className="group relative luxury-glass border border-border/30 overflow-hidden hover:border-primary/20 transition-all duration-700"
            style={{ perspective: '1000px' }}
          >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <img
                src={artist.img}
                alt={artist.name}
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              {/* Name overlay on image */}
              <div className="absolute bottom-0 left-0 w-full p-8">
                <h3 className="font-serif text-3xl md:text-4xl text-white mb-1">{artist.name}</h3>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-primary">{artist.role}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">{artist.bio}</p>
              
              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-6">
                {artist.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-primary/20 text-primary/70 rounded-sm bg-primary/5"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-border/20">
                <span className="font-sans text-xs text-muted-foreground">
                  <span className="text-primary font-medium">{artist.experience}</span> de experiencia
                </span>
                <a
                  href="#"
                  className="font-sans text-[10px] tracking-[0.3em] uppercase text-primary/60 hover:text-primary transition-colors duration-300 flex items-center gap-2"
                >
                  {artist.instagram}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                </a>
              </div>
            </div>

            {/* Hover accent line */}
            <div className="absolute top-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
