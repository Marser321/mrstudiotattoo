import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ──────────────────────────────────────────────────────────────────
   STEP 6 — Dimensions / Size Selection
   Full-width radio cards with real measurements
   ────────────────────────────────────────────────────────────────── */

const dimensions = [
  { id: 'small', key: 'small', measure: '2"–4" / 5–10 cm', circle: 24 },
  { id: 'medium', key: 'medium', measure: '4"–8" / 10–20 cm', circle: 40 },
  { id: 'large', key: 'large', measure: '8"–16" / 20–40 cm', circle: 60 },
];

interface StepDimensionsProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function StepDimensions({ selected, onSelect }: StepDimensionsProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        {t('bookingV2.step')} 6
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        {t('bookingV2.dimensions.title')}{' '}
        <span className="italic font-light text-primary">{t('bookingV2.dimensions.accent')}</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        {t('bookingV2.dimensions.desc')}
      </p>

      <div className="flex flex-col gap-3 max-w-lg">
        {dimensions.map((dim) => {
          const active = selected === dim.id;

          return (
            <button
              key={dim.id}
              type="button"
              onClick={() => onSelect(dim.id)}
              className={`group relative flex items-center justify-between p-6 border transition-all duration-500 overflow-hidden rounded-xl text-left
                ${active
                  ? 'border-primary/40 bg-primary/[0.04] ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-foreground/15'
                }`}
            >
              <div className="flex items-center gap-5">
                {/* Scale indicator circle */}
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                  <div
                    className={`rounded-full border transition-all duration-500 ${
                      active
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-border bg-muted/30'
                    }`}
                    style={{ width: dim.circle, height: dim.circle }}
                  />
                </div>
                <div>
                  <h3 className={`font-serif text-xl transition-colors duration-300 ${
                    active ? 'text-foreground' : 'text-foreground/70'
                  }`}>
                    {t(`bookingV2.dimensions.${dim.key}`)}
                  </h3>
                  <p className="font-sans text-[0.6rem] tracking-[0.08em] text-muted-foreground mt-0.5">
                    {dim.measure}
                  </p>
                  <p className="font-sans text-[0.55rem] tracking-[0.1em] uppercase text-muted-foreground/50 mt-1">
                    {t(`bookingV2.dimensions.${dim.key}Desc`)}
                  </p>
                </div>
              </div>

              {/* Radio indicator */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                active ? 'border-primary bg-primary/10' : 'border-border'
              }`}>
                {active && (
                  <CheckCircle2 className="w-4 h-4 text-primary animate-in zoom-in duration-200" />
                )}
              </div>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                active ? 'w-full' : 'w-0'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
