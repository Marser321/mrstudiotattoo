import { useState, useEffect } from 'react';
import { Loader2, Globe } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useTranslation } from 'react-i18next';

/* ──────────────────────────────────────────────────────────────────
   STEP 7 — Schedule (Date & Time Selection)
   Reuses existing Calendar component + GHL slot fetching
   Adds timezone auto-detection
   ────────────────────────────────────────────────────────────────── */

interface StepScheduleProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  artistId: string;       // for GHL calendar lookup
}

export function StepSchedule({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  artistId,
}: StepScheduleProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('es') ? 'es-ES' : 'en-US';

  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [slots, setSlots] = useState<{ raw: string; date: string; time: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [timezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    let cancelled = false;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSlotsError('');
      setSlots([]);

      try {
        const { ghlService } = await import('@/services/ghlService');
        const dateStr = selectedDate.toISOString().split('T')[0];

        // Try GHL integration first
        if (artistId) {
          // Map artist ID to calendar ID
          const calendarMap: Record<string, string> = {
            'ramses': 'CAL_RAMSES_ID',
            'misael': 'CAL_MISAEL_ID',
            'tony': 'CAL_TONY_ID',
            'khris': 'CAL_KHRIS_ID',
            'alejandro': 'CAL_ALEJANDRO_ID',
            'alinette': 'CAL_ALINETTE_ID',
          };
          const calendarId = calendarMap[artistId] || '';

          if (calendarId) {
            const result = await ghlService.getSlots(calendarId, dateStr, dateStr);
            if (!cancelled) setSlots(result);
            return;
          }
        }

        // Fallback: Generate mock slots when no artist or backend not configured
        const mockSlots = [];
        for (let h = 12; h <= 18; h++) {
          for (const m of ['00', '30']) {
            const time24 = `${h}:${m}`;
            const d = new Date(dateStr + 'T' + time24 + ':00');
            const timeStr = d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false });
            mockSlots.push({ raw: d.toISOString(), date: dateStr, time: timeStr });
          }
        }
        if (!cancelled) setSlots(mockSlots);
      } catch (err) {
        if (!cancelled) {
          // Fallback to mock slots when backend is not available
          const dateStr = selectedDate.toISOString().split('T')[0];
          const mockSlots = [];
          for (let h = 12; h <= 18; h++) {
            for (const m of ['00', '30']) {
              const time24 = `${h.toString().padStart(2, '0')}:${m}`;
              const d = new Date(dateStr + 'T' + time24 + ':00');
              const timeStr = d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false });
              mockSlots.push({ raw: d.toISOString(), date: dateStr, time: timeStr });
            }
          }
          setSlots(mockSlots);
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };

    fetchSlots();
    return () => { cancelled = true; };
  }, [selectedDate, artistId, lang, t]);

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        {t('bookingV2.step')} 7
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        {t('bookingV2.schedule.title')}{' '}
        <span className="italic font-light text-primary">{t('bookingV2.schedule.accent')}</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-4 max-w-md leading-relaxed">
        {t('bookingV2.schedule.desc')}
      </p>

      {/* Info note */}
      <div className="mb-8 p-4 border border-primary/20 bg-primary/[0.03] rounded-xl max-w-md">
        <p className="font-sans text-xs text-primary/80 italic leading-relaxed">
          {t('bookingV2.schedule.consultNote')}
        </p>
      </div>

      {/* Calendar */}
      <div className="flex justify-center">
        <div
          className="border border-border bg-card p-6 md:p-8 inline-block"
          style={{ borderRadius: '0.75rem' }}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={{ before: today }}
            className="
              [--cell-size:--spacing(10)]
              **:data-[selected-single=true]:bg-primary
              **:data-[selected-single=true]:text-primary-foreground
              **:data-today:bg-muted
              **:data-today:text-foreground
            "
            classNames={{
              month_caption: 'flex h-10 w-full items-center justify-center px-10 font-serif text-lg',
              weekday: 'flex-1 rounded text-[0.7rem] font-sans font-medium text-muted-foreground select-none tracking-wider uppercase',
            }}
          />
        </div>
      </div>

      {/* Selected date display */}
      {selectedDate && (
        <p className="text-center mt-6 font-sans text-sm text-muted-foreground animate-in fade-in duration-300">
          <span className="text-foreground font-medium">
            {selectedDate.toLocaleDateString(lang, {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </p>
      )}

      {/* Timezone indicator */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <Globe size={12} className="text-muted-foreground/40" />
        <span className="font-sans text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground/40">
          {timezone}
        </span>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-8 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground mb-4 text-center font-medium">
            {t('bookingV2.schedule.availableSlots')}
          </p>

          {loadingSlots && (
            <div className="flex items-center justify-center gap-3 py-10">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="font-sans text-sm text-muted-foreground">
                {t('bookingV2.schedule.loading')}
              </span>
            </div>
          )}

          {slotsError && (
            <p className="text-center font-sans text-sm text-primary/80 py-6">{slotsError}</p>
          )}

          {!loadingSlots && !slotsError && slots.length === 0 && (
            <p className="text-center font-sans text-sm text-muted-foreground py-6">
              {t('bookingV2.schedule.noSlots')}
            </p>
          )}

          {!loadingSlots && slots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {slots.map((slot) => {
                const active = selectedTime === slot.raw;
                return (
                  <button
                    key={slot.raw}
                    type="button"
                    onClick={() => onSelectTime(slot.raw)}
                    className={`py-3 px-2 font-sans text-xs tracking-wide border rounded-lg
                      transition-all duration-300 min-h-[44px] active:scale-[0.96]
                      ${active
                        ? 'bg-primary/15 border-primary/40 text-primary ring-1 ring-primary/20'
                        : 'bg-card border-border text-muted-foreground hover:border-foreground/15 hover:text-foreground/80'
                      }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
