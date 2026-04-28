import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const sizes = [
  { id: 'small', duration: '1H' },
  { id: 'medium', duration: '2-3H' },
  { id: 'large', duration: '4H+' },
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  sizeId: string;
};

/* ──────────────────────────────────────────────────────────────────────
   INTAKE FORM — Theme-aware "Parchment & Blackwork" variant
   All colors use CSS token variables so the form adapts to both
   dark (void + white ink) and light (parchment + carbon ink) modes.
   No hardcoded bg-black, text-white, or border-white.
   ────────────────────────────────────────────────────────────────────── */

export function IntakeForm() {
  const { t, i18n } = useTranslation();

  const formSchema = useMemo(() => z.object({
    name: z.string().min(3, t('booking.errors.name')),
    email: z.string().email(t('booking.errors.email')),
    phone: z.string().min(8, t('booking.errors.phone')),
    sizeId: z.string().min(1, t('booking.errors.size')),
  }), [t]);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const {
    register,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      sizeId: ''
    }
  });

  const watchSizeId = watch('sizeId');

  // Fetch slots when entering step 2 or changing date
  useEffect(() => {
    if (step === 2 && selectedDate) {
      fetchSlots();
    }
  }, [step, selectedDate]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mocked = ['10:00 AM', '11:00 AM', '02:00 PM', '04:30 PM'];
      setSlots(mocked);
    } catch (err) {
      toast.error(t('booking.errors.fetchSlots'));
    } finally {
      setLoadingSlots(false);
    }
  };

  const onNextStep = () => {
    if (isValid) {
      setStep(2);
      if (!selectedDate) {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
      }
    }
  };

  const onSubmit = async () => {
    if (!selectedSlot || !selectedDate) {
      toast.error(t('booking.errors.selectSlot'));
      return;
    }

    setIsSubmitting(true);
    const data = getValues();
    
    try {
      console.log('Final Booking Data:', { ...data, date: selectedDate, time: selectedSlot });
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(t('booking.success.title'), {
        description: t('booking.success.desc', { date: selectedDate, time: selectedSlot }),
      });
    } catch (error) {
       toast.error(t('booking.errors.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Token-based style classes ── */
  const inputClasses = "w-full bg-card border border-border rounded-[2px] p-4 text-sm font-sans text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50";
  const labelClasses = "font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 block font-bold";
  const errorClasses = "text-red-500 text-[9px] uppercase tracking-widest mt-1 font-bold";

  return (
    <div className="w-full max-w-xl mx-auto p-8 bg-card border border-border rounded-[4px] relative overflow-hidden min-h-[500px]">
      
      {/* Header with Step Indicator */}
      <div className="flex justify-between items-center mb-10">
        <h3 className="font-serif text-3xl tracking-tighter text-foreground uppercase">
          {step === 1 ? t('booking.ui.step1Title') : t('booking.ui.step2Title')}
        </h3>
        <div className="flex gap-2">
          <div className={`w-8 h-1 transition-all duration-500 ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
          <div className={`w-8 h-1 transition-all duration-500 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
        </div>
      </div>

      {/* STEP 1: CONTACT INFO & SIZE */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className={labelClasses}>{t('booking.ui.fullName')}</label>
              <input 
                {...register('name')}
                placeholder="JOHN DOE"
                className={inputClasses}
              />
              {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelClasses}>{t('booking.ui.email')}</label>
              <input 
                {...register('email')}
                type="email"
                placeholder="HELLO@STUDIO.COM"
                className={inputClasses}
              />
              {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>{t('booking.ui.phone')}</label>
              <input 
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 000-0000"
                className={inputClasses}
              />
              {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClasses}>{t('booking.ui.tattooSize')}</label>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setValue('sizeId', size.id, { shouldValidate: true })}
                  className={`p-4 border rounded-[2px] transition-all text-left group overflow-hidden relative ${
                    watchSizeId === size.id 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                    : 'border-border bg-card hover:border-foreground/20'
                  }`}
                >
                  <div className={`text-[8px] tracking-widest uppercase mb-1 ${watchSizeId === size.id ? 'text-primary' : 'text-muted-foreground/50'}`}>{size.duration}</div>
                  <div className="font-serif text-lg leading-none mb-1 text-foreground">{t(`booking.sizes.${size.id}`)}</div>
                  <div className="text-[7px] tracking-[0.2em] uppercase text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors whitespace-nowrap">{t(`booking.sizes.desc${size.id.charAt(0).toUpperCase() + size.id.slice(1)}`)}</div>
                </button>
              ))}
            </div>
            {errors.sizeId && <p className={errorClasses}>{errors.sizeId.message}</p>}
          </div>

          <button
            type="button"
            disabled={!isValid}
            onClick={onNextStep}
            className="w-full py-5 bg-primary text-primary-foreground font-sans text-[11px] tracking-[0.5em] uppercase transition-all hover:bg-primary/90 disabled:opacity-20 flex items-center justify-center gap-4 rounded-[2px] group"
          >
            {t('booking.ui.nextBtn')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* STEP 2: SLOT SELECTION */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <button 
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={14} /> {t('booking.ui.backBtn')}
          </button>

          <div className="space-y-4">
             <label className={labelClasses}>{t('booking.ui.selectDate')}</label>
             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {Array.from({length: 14}).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const dateStr = d.toISOString().split('T')[0];
                  const isSelected = selectedDate === dateStr;
                  const dayName = d.toLocaleDateString(i18n.language.startsWith('es') ? 'es-ES' : 'en-US', { weekday: 'short' }).toUpperCase();
                  const dayNum = d.getDate();

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex-shrink-0 w-14 h-16 border rounded-[2px] flex flex-col items-center justify-center transition-all ${
                        isSelected ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-muted-foreground hover:border-foreground/20'
                      }`}
                    >
                      <span className="text-[8px] tracking-widest mb-1">{dayName}</span>
                      <span className="text-lg font-serif">{dayNum}</span>
                    </button>
                  )
                })}
             </div>
          </div>

          <div className="space-y-4">
             <label className={labelClasses}>{t('booking.ui.availableSlots')}</label>
             {loadingSlots ? (
               <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => <div key={i} className="h-14 bg-muted animate-pulse rounded-[2px]" />)}
               </div>
             ) : (
               <div className="grid grid-cols-2 gap-4">
                 {slots.map(slot => (
                   <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 text-xs font-sans tracking-widest border rounded-[2px] transition-all ${
                      selectedSlot === slot ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-foreground/20 text-muted-foreground'
                    }`}
                   >
                     {slot}
                   </button>
                 ))}
               </div>
             )}
          </div>

          <button
            onClick={onSubmit}
            disabled={isSubmitting || !selectedSlot}
            className="w-full py-5 bg-foreground text-background font-sans text-[11px] tracking-[0.5em] uppercase transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-20 flex items-center justify-center gap-4 rounded-[2px] group overflow-hidden relative"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span>{t('booking.ui.confirmBtn')}</span>
                <CheckCircle2 size={16} />
              </>
            )}
          </button>
          
          <div className="text-center pt-4">
            <a href="/consent" target="_blank" className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.1em] uppercase text-primary hover:text-primary/80 transition-colors">
              <span className="w-3 h-3">✍️</span>
              {t('booking.ui.consentText')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckCircle2({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
