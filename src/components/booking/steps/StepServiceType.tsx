import { CheckCircle2, Wand2, CircleDot, RefreshCw, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ──────────────────────────────────────────────────────────────────
   STEP 2 — Service Type Selection
   Options: New Tattoo, Piercing, Touch-Up, Cover-Up
   (NO laser removal — not offered by Mr. Tato)
   ────────────────────────────────────────────────────────────────── */

const serviceTypes = [
  { id: 'new-tattoo', icon: Wand2, key: 'newTattoo' },
  { id: 'piercing', icon: CircleDot, key: 'piercing' },
  { id: 'touch-up', icon: RefreshCw, key: 'touchUp' },
  { id: 'cover-up', icon: Layers, key: 'coverUp' },
];

interface StepServiceTypeProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function StepServiceType({ selected, onSelect }: StepServiceTypeProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        {t('bookingV2.step')} 2
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        {t('bookingV2.serviceType.title')}{' '}
        <span className="italic font-light text-primary">{t('bookingV2.serviceType.accent')}</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        {t('bookingV2.serviceType.desc')}
      </p>

      <div className="flex flex-col gap-3 max-w-lg">
        {serviceTypes.map((s) => {
          const active = selected === s.id;
          const Icon = s.icon;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`group relative flex items-center justify-between p-6 border transition-all duration-500 overflow-hidden rounded-xl text-left
                ${active
                  ? 'border-primary/40 bg-primary/[0.04] ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-foreground/15'
                }`}
            >
              <div className="flex items-center gap-5">
                <div className={`transition-colors duration-300 ${
                  active ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-primary/60'
                }`}>
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className={`font-serif text-xl transition-colors duration-300 ${
                    active ? 'text-foreground' : 'text-foreground/70'
                  }`}>
                    {t(`bookingV2.serviceType.${s.key}`)}
                  </h3>
                  <p className="font-sans text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground mt-0.5">
                    {t(`bookingV2.serviceType.${s.key}Desc`)}
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

              {/* Bottom accent line */}
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
