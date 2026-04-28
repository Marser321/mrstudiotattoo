import { useTranslation } from 'react-i18next';

/* ──────────────────────────────────────────────────────────────────
   STEP 1 — Contact Information
   Captures: name, email, phone, SMS opt-in
   ────────────────────────────────────────────────────────────────── */

interface StepContactProps {
  data: {
    name: string;
    email: string;
    phone: string;
    smsOptIn: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
}

export function StepContact({ data, onChange }: StepContactProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        {t('bookingV2.step')} 1
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        {t('bookingV2.contact.title')}{' '}
        <span className="italic font-light text-primary">{t('bookingV2.contact.accent')}</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        {t('bookingV2.contact.desc')}
      </p>

      <div className="space-y-6 max-w-lg">
        {/* Name */}
        <div className="animate-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
          <label className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2 font-medium">
            {t('bookingV2.contact.name')}
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder={t('bookingV2.contact.namePlaceholder', { defaultValue: 'JOHN DOE' })}
            className="w-full bg-card border border-border rounded-lg p-4 text-sm font-sans text-foreground
                       focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                       transition-all duration-300 placeholder:text-muted-foreground/30 hover:border-primary/30"
          />
        </div>

        {/* Email + Phone grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          <div>
            <label className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2 font-medium">
              {t('bookingV2.contact.email')}
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="hello@studio.com"
              className="w-full bg-card border border-border rounded-lg p-4 text-sm font-sans text-foreground
                         focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                         transition-all duration-300 placeholder:text-muted-foreground/30 hover:border-primary/30"
            />
          </div>
          <div>
            <label className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2 font-medium">
              {t('bookingV2.contact.phone')}
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-card border border-border rounded-lg p-4 text-sm font-sans text-foreground
                         focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                         transition-all duration-300 placeholder:text-muted-foreground/30 hover:border-primary/30"
            />
          </div>
        </div>

        {/* SMS Opt-in */}
        <button
          type="button"
          onClick={() => onChange('smsOptIn', !data.smsOptIn)}
          className={`w-full flex items-center gap-4 p-4 border rounded-lg transition-all duration-500 text-left animate-in slide-in-from-bottom-4 delay-500 fill-mode-both hover:shadow-md ${
            data.smsOptIn
              ? 'border-primary/40 bg-primary/[0.04]'
              : 'border-border bg-card hover:border-primary/30'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
              data.smsOptIn
                ? 'border-primary bg-primary/20 scale-105'
                : 'border-border'
            }`}
          >
            {data.smsOptIn && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-in zoom-in duration-300">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="font-sans text-xs text-muted-foreground leading-relaxed">
            {t('bookingV2.contact.smsOptIn')}
          </span>
        </button>
      </div>
    </div>
  );
}
