import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const ceo = {
  name: 'Reinier Rielo',
  role: 'Fundador & Master Artist',
  specialties: ['Realismo', 'Fine Line', 'Retratos'],
  experience: '10+ años',
  bio: 'Maestro del realismo con atención obsesiva al detalle. Fundador de Mr Studio Tattoo, lidera el estudio con una visión inquebrantable de perfección y exclusividad.',
  img: '/assets/images/tattoo_artist_1776269987044.png',
  instagram: '@reinierrielo',
};

const teamArtists = [
  {
    name: "Ramsés 'El Faraón'",
    role: 'Artista Residente',
    specialties: ['Realismo', 'Black & Grey'],
    experience: '8+ años',
    bio: 'Especialista en realismo y sombras. Transforma fotografías y conceptos complejos en obras de arte inmortales sobre la piel.',
    img: '/assets/artists/ramses.jpeg',
    instagram: '@ramses',
  },
  {
    name: 'Misael Inc',
    role: 'Artista Residente',
    specialties: ['Neo-Tradicional', 'Color'],
    experience: '6+ años',
    bio: 'Maestro del color y las líneas sólidas. Su estilo neo-tradicional destaca por su vibrante paleta y composición impecable.',
    img: '/assets/artists/misael.jpeg',
    instagram: '@misael.inc',
  },
  {
    name: "Tony 'El Verdugo'",
    role: 'Artista Destacado',
    specialties: ['Geométrico', 'Custom', 'Mandalas'],
    experience: '7+ años',
    bio: 'Visión creativa sin límites. Transforma ideas abstractas en arte permanente con precisión matemática.',
    img: '/assets/artists/tony.jpeg',
    instagram: '@tony.ink',
  },
  {
    name: 'Khris',
    role: 'Artista Residente',
    specialties: ['Fine Line', 'Minimalista'],
    experience: '5+ años',
    bio: 'Delicadeza y precisión milimétrica. Especialista en trazos ultra finos y diseños minimalistas que curan a la perfección.',
    img: '/assets/artists/khris.jpeg',
    instagram: '@khris',
  },
  {
    name: 'Alejandro',
    role: 'Artista Residente',
    specialties: ['Blackwork', 'Ornamental'],
    experience: '6+ años',
    bio: 'Creador de piezas ornamentales y blackwork con un alto contraste y patrones únicos que se adaptan a la anatomía.',
    img: '/assets/artists/alejandro.jpeg',
    instagram: '@alejandro',
  },
  {
    name: 'Alinette',
    role: 'Artista Residente',
    specialties: ['Acuarela', 'Floral'],
    experience: '4+ años',
    bio: 'Especialista en tatuajes florales y técnicas de acuarela. Sus diseños destacan por su fluidez y tonos etéreos.',
    img: '/assets/artists/alinette.jpeg',
    instagram: '@alinette',
  },
];

export function Artists() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Smooth section entrance
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
        }
      }
    );

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 40, rotateY: i === 0 ? -2 : 2 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1.2,
          delay: i * 0.1,
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
    <section ref={containerRef} className="relative w-full py-20 md:py-24 px-4 md:px-16 lg:px-32 overflow-hidden">
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[200px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-24">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-primary mb-4 border-b border-primary/20 pb-4 w-max">
          {t('artists.eyebrow')}
        </p>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-4">
          {t('artists.title1')}<span className="italic font-light text-primary">{t('artists.title2')}</span>
        </h2>
        <p className="font-sans text-muted-foreground max-w-lg text-sm md:text-base leading-relaxed">
          {t('artists.desc')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* CEO Featured Card (Temporarily Hidden) */}
        <div
          ref={el => { cardsRef.current[0] = el }}
          className="hidden group relative luxury-glass border border-border/30 overflow-hidden hover:border-primary/20 transition-all duration-700 flex flex-col lg:flex-row"
          style={{ perspective: '1000px' }}
        >
          {/* Image */}
          <div className="relative w-full lg:w-1/2 aspect-square lg:aspect-auto lg:min-h-[500px] overflow-hidden">
            {ceo.img ? (
              <img
                src={ceo.img}
                alt={ceo.name}
                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900/50 flex items-center justify-center">
                <span className="text-muted-foreground text-xs uppercase tracking-widest">{t('artists.pending')}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black/90"></div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-black/40">
            <h3 className="font-serif text-4xl lg:text-5xl text-white mb-2">{ceo.name}</h3>
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-primary mb-8">{t('artists.ceo.role', { defaultValue: ceo.role })}</p>
            
            <p className="font-sans text-base text-muted-foreground leading-relaxed mb-8">{t('artists.ceo.bio', { defaultValue: ceo.bio })}</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {ceo.specialties.map((spec) => (
                <span
                  key={spec}
                  className="font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-primary/20 text-primary/70 rounded-sm bg-primary/5"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border/20 mt-auto">
              <span className="font-sans text-sm text-muted-foreground">
                <span className="text-primary font-medium">{ceo.experience}</span> {t('artists.exp')}
              </span>
              <a
                href="#"
                className="font-sans text-xs tracking-[0.3em] uppercase text-primary/60 hover:text-primary transition-colors duration-300 flex items-center gap-2"
              >
                {ceo.instagram}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
              </a>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"></div>
        </div>

        {/* 6 Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamArtists.map((artist, idx) => (
            <div
              key={artist.name}
              ref={el => { cardsRef.current[idx + 1] = el }}
              className="group relative luxury-glass border border-border/30 overflow-hidden hover:border-primary/20 transition-all duration-700 flex flex-col"
              style={{ perspective: '1000px' }}
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                {artist.img ? (
                  <img
                    src={artist.img}
                    alt={artist.name}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900/40 flex items-center justify-center">
                    <span className="text-muted-foreground text-[10px] uppercase tracking-widest">{t('artists.pending')}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-1">{artist.name}</h3>
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-primary">
                    {t(`artists.team.${artist.name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '')}.role`, { defaultValue: artist.role })}
                  </p>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-6 flex-grow">
                  {t(`artists.team.${artist.name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '')}.bio`, { defaultValue: artist.bio })}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {artist.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="font-sans text-[9px] tracking-[0.2em] uppercase px-2 py-1 border border-primary/20 text-primary/70 rounded-sm bg-primary/5"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                  <span className="font-sans text-[10px] text-muted-foreground">
                    <span className="text-primary font-medium">{artist.experience}</span>
                  </span>
                  <a
                    href="#"
                    className="font-sans text-[9px] tracking-[0.3em] uppercase text-primary/60 hover:text-primary transition-colors duration-300 flex items-center gap-1.5"
                  >
                    {artist.instagram}
                  </a>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
