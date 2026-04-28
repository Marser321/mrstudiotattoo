import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ──────────────────────────────────────────────────────────────────
   STEP 3 — Tattoo Style Selection
   Visual gallery grid with real portfolio images
   Multi-select: a tattoo can combine styles
   Hidden when serviceType is 'piercing'
   ────────────────────────────────────────────────────────────────── */

const styles = [
  { id: 'realism', key: 'realism', img: '/images/styles/realism.png' },
  { id: 'black-grey', key: 'blackGrey', img: '/images/styles/black-grey.png' },
  { id: 'color', key: 'color', img: '/images/styles/color.png' },
  { id: 'minimalist', key: 'minimalist', img: '/images/styles/minimalist.png' },
  { id: 'fine-line', key: 'fineLine', img: '/images/styles/fine-line.png' },
  { id: 'blackwork', key: 'blackwork', img: '/images/styles/blackwork.png' },
  { id: 'neo-traditional', key: 'neoTrad', img: '/images/styles/neo-traditional.png' },
  { id: 'geometric', key: 'geometric', img: '/images/styles/geometric.png' },
  { id: 'watercolor', key: 'watercolor', img: '/images/styles/watercolor.png' },
  { id: 'lettering', key: 'lettering', img: '/images/styles/lettering.png' },
];

interface StepStyleProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function StepStyle({ selected, onToggle }: StepStyleProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        {t('bookingV2.step')} 3
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        {t('bookingV2.style.title')}{' '}
        <span className="italic font-light text-primary">{t('bookingV2.style.accent')}</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        {t('bookingV2.style.desc')}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {styles.map((style) => {
          const active = selected.includes(style.id);

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onToggle(style.id)}
              className={`group relative aspect-[3/4] overflow-hidden rounded-xl border transition-all duration-500 ${
                active
                  ? 'border-primary/50 ring-2 ring-primary/30 scale-[0.97]'
                  : 'border-border hover:border-foreground/20 hover:scale-[0.98]'
              }`}
            >
              {/* Portfolio image */}
              <img
                src={style.img}
                alt={t(`bookingV2.style.${style.key}`)}
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  active
                    ? 'scale-110 brightness-75'
                    : 'scale-100 brightness-[0.55] group-hover:brightness-75 group-hover:scale-105'
                }`}
              />

              {/* Dark gradient overlay for text readability */}
              <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                active
                  ? 'from-primary/40 via-black/30 to-black/10'
                  : 'from-black/70 via-black/20 to-transparent'
              }`} />

              {/* Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                <span className={`font-serif text-sm sm:text-base text-center leading-tight drop-shadow-lg transition-all duration-300 ${
                  active ? 'text-primary-foreground translate-y-0' : 'text-white/90 group-hover:text-white translate-y-1 group-hover:translate-y-0'
                }`}>
                  {t(`bookingV2.style.${style.key}`)}
                </span>
              </div>

              {/* Check badge */}
              {active && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-200 shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              {/* Top accent glow for selected */}
              {active && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-in fade-in duration-300" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected count */}
      {selected.length > 0 && (
        <p className="mt-6 font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground animate-in fade-in duration-300">
          {selected.length} {t('bookingV2.style.selected')}
        </p>
      )}
    </div>
  );
}
