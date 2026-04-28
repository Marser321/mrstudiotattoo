import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
 * PIERCING SERVICES DATA
 * DESIGN.md compliance:
 *   - Red (#DC2626) ONLY on CTA button (default variant)
 *   - Card hover: border transitions to --primary/30 (red outline)
 *   - Body text: --foreground-secondary (#A3A3A3)
 *   - Backgrounds: --surface-primary (#141414) / --card (#0A0A0A)
 * ────────────────────────────────────────────────────────────── */

interface PiercingService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  tag: string;
}

const piercingServices: PiercingService[] = [
  {
    id: 'ear-curation',
    title: 'Ear Curation',
    subtitle: 'Curated Constellation',
    description:
      'Diseño personalizado de múltiples perforaciones auriculares. Una composición de joyería fina que transforma la oreja en una galería de arte.',
    price: 'Desde $80',
    image: '/assets/images/piercing_ear.png',
    tag: 'Popular',
  },
  {
    id: 'septum',
    title: 'Septum',
    subtitle: 'Elegancia Central',
    description:
      'Perforación de septum con anillos artesanales de alta gama. Minimalismo que define carácter con una precisión quirúrgica.',
    price: 'Desde $60',
    image: '/assets/images/piercing_septum.png',
    tag: 'Clásico',
  },
  {
    id: 'nostril',
    title: 'Nostril',
    subtitle: 'Diamante Sutil',
    description:
      'Stud nasal con piedra preciosa o aro delicado. Un acento luminoso, casi imperceptible, que eleva cualquier perfil.',
    price: 'Desde $50',
    image: '/assets/images/piercing_nose.png',
    tag: 'Minimal',
  },
  {
    id: 'labret',
    title: 'Labret',
    subtitle: 'Precision Labial',
    description:
      'Perforación labial con stud de titanio grado implante. Técnica de mínima invasión para una curación óptima y un look impecable.',
    price: 'Desde $55',
    image: '/assets/images/piercing_lip.png',
    tag: 'Bold',
  },
  {
    id: 'eyebrow',
    title: 'Eyebrow',
    subtitle: 'Arco Definido',
    description:
      'Barbell curvado en ceja con acabados premium. Un statement sutil que enmarca la mirada con actitud y sofisticación.',
    price: 'Desde $55',
    image: '/assets/images/piercing_eyebrow.png',
    tag: 'Statement',
  },
  {
    id: 'navel',
    title: 'Navel',
    subtitle: 'Joya Corporal',
    description:
      'Piercing de ombligo con joyería colgante de diseño exclusivo. Piezas artesanales que combinan movimiento y elegancia.',
    price: 'Desde $65',
    image: '/assets/images/piercing_navel.png',
    tag: 'Signature',
  },
];

/* ─────────────────────────────────────────────────────────────────
 * PIERCINGS SECTION COMPONENT
 * ────────────────────────────────────────────────────────────── */

export function Piercings() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Heading entrance
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Staggered card reveal
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.96 },
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
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="piercings"
      className="relative w-full py-20 md:py-24 px-4 md:px-16 lg:px-32 overflow-hidden"
    >
      {/* Decorative accent orb — subtle, per DESIGN.md §5 */}
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[250px] pointer-events-none" />

      {/* ─── Section Header ─── */}
      <div
        ref={headingRef}
        className="flex flex-col items-center justify-center text-center mb-20"
      >
        <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-5 border-b border-primary/20 pb-4 w-max">
          {t('piercings.eyebrow')}
        </p>

        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-5">
          {t('piercings.title1')}<span className="italic font-light text-primary">{t('piercings.title2')}</span>
        </h2>

        <p className="font-sans text-muted-foreground max-w-xl text-sm md:text-base leading-relaxed">
          {t('piercings.desc')}
        </p>
      </div>

      {/* ─── Services Grid ─── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {piercingServices.map((service, idx) => (
          <div
            key={service.id}
            ref={(el) => {
              cardsRef.current[idx] = el;
            }}
            className="group relative flex flex-col bg-card border border-border/30 overflow-hidden
                       hover:border-primary/30 transition-all duration-500 cursor-default"
            style={{ borderRadius: '0.75rem' }}
          >
            {/* ── Image Container ── */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <img
                src={service.image}
                alt={`${service.title} piercing`}
                className="w-full h-full object-cover grayscale opacity-80
                           group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105
                           transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              />

              {/* Gradient vignette — dissolves into card bg per DESIGN.md §5 */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent pointer-events-none" />

              {/* Tag badge — uses muted surface, NOT red */}
              <span
                className="absolute top-4 right-4 font-sans text-[0.625rem] tracking-[0.15em] uppercase
                              px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white/70
                              border border-white/10"
                style={{ borderRadius: '0.375rem' }}
              >
                {t(`piercings.services.${service.id}.tag`, { defaultValue: service.tag })}
              </span>
            </div>

            {/* ── Card Body ── */}
            <div className="flex flex-col flex-1 p-8">
              {/* Service subtitle — overline style */}
              <span className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                {t(`piercings.services.${service.id}.subtitle`, { defaultValue: service.subtitle })}
              </span>

              {/* Service title — DM Serif Display per DESIGN.md heading.family */}
              <h3 className="font-serif text-2xl md:text-[1.75rem] mb-3 text-foreground group-hover:text-foreground transition-colors duration-300">
                {t(`piercings.services.${service.id}.title`, { defaultValue: service.title })}
              </h3>

              {/* Description — DM Sans body, muted */}
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                {t(`piercings.services.${service.id}.desc`, { defaultValue: service.description })}
              </p>

              {/* ── Footer: Price + CTA ── */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                {/* Price — mono font per DESIGN.md */}
                <span className="font-mono text-sm text-muted-foreground tracking-wide">
                  {t(`piercings.services.${service.id}.price`, { defaultValue: service.price })}
                </span>

                {/* CTA Button — Red accent ONLY here, per DESIGN.md §2 "The Red Rule" */}
                <button
                  onClick={() => navigate('/booking')}
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-sans text-[0.6875rem]
                             tracking-[0.1em] uppercase
                             hover:bg-primary/80 active:bg-primary/70
                             transition-all duration-300
                             focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
                  style={{ borderRadius: '0.375rem' }}
                >
                  {t('piercings.btnSmall')}
                </button>
              </div>
            </div>

            {/* ── Bottom accent line on hover — red, interaction feedback ── */}
            <div
              className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary
                         group-hover:w-full transition-all duration-700
                         ease-[cubic-bezier(0.23,1,0.32,1)]"
            />
          </div>
        ))}
      </div>

      {/* ─── Bottom CTA Block ─── */}
      <div className="max-w-3xl mx-auto mt-24 text-center">
        <p className="font-sans text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
          {t('piercings.bottom1')}
          <span className="text-foreground">{t('piercings.bottom2')}</span>{t('piercings.bottom3')}
        </p>
        <button
          onClick={() => navigate('/booking')}
          className="px-10 py-4 bg-primary text-primary-foreground font-sans text-xs
                     tracking-[0.2em] uppercase
                     hover:bg-primary/80 hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-300
                     shadow-lg shadow-primary/20
                     focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
          style={{ borderRadius: '9999px' }}
        >
          {t('piercings.btnBook')}
        </button>
      </div>
    </section>
  );
}
