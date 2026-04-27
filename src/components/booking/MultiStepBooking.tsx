import { useState, useCallback, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Shield, Loader2, Wand2, Zap, CircleDot } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

/* ─────────────────────────────────────────────────────────────────
 * DATA — Services, Artists
 * ────────────────────────────────────────────────────────────── */

const services = [
  {
    id: 'custom-tattoo',
    title: 'Tatuaje a Medida',
    subtitle: 'Custom Artwork',
    desc: 'Diseño personalizado creado en colaboración directa. Tu visión, nuestra maestría técnica.',
    icon: <Wand2 size={24} strokeWidth={1.5} />,
    duration: '2–6h',
  },
  {
    id: 'flash',
    title: 'Flash',
    subtitle: 'Ready-to-Ink',
    desc: 'Diseños pre-diseñados del catálogo del artista. Ejecución inmediata, precio fijo.',
    icon: <Zap size={24} strokeWidth={1.5} />,
    duration: '1–2h',
  },
  {
    id: 'piercing',
    title: 'Piercing',
    subtitle: 'Body Jewelry',
    desc: 'Perforación profesional con joyería de titanio grado implante. Precisión clínica.',
    icon: <CircleDot size={24} strokeWidth={1.5} />,
    duration: '30min',
  },
];

const artists = [
  {
    id: 'ramses',
    calendarId: 'CAL_RAMSES_ID',
    name: "Ramsés 'El Faraón'",
    role: 'Realismo · Black & Grey',
    initials: 'RF',
  },
  {
    id: 'misael',
    calendarId: 'CAL_MISAEL_ID',
    name: 'Misael Inc',
    role: 'Neo-Tradicional · Color',
    initials: 'MI',
  },
  {
    id: 'tony',
    calendarId: 'CAL_TONY_ID',
    name: "Tony 'El Verdugo'",
    role: 'Geométrico · Custom',
    initials: 'TV',
  },
  {
    id: 'khris',
    calendarId: 'CAL_KHRIS_ID',
    name: 'Khris',
    role: 'Fine Line · Minimalista',
    initials: 'KH',
  },
  {
    id: 'alejandro',
    calendarId: 'CAL_ALEJANDRO_ID',
    name: 'Alejandro',
    role: 'Blackwork · Ornamental',
    initials: 'AL',
  },
  {
    id: 'alinette',
    calendarId: 'CAL_ALINETTE_ID',
    name: 'Alinette',
    role: 'Acuarela · Floral',
    initials: 'AN',
  },
];

const GHL_PAYMENT_URL = 'https://checkout.gohighlevel.com/mr-tato-deposit';

/* ─────────────────────────────────────────────────────────────────
 * STEP INDICATOR
 * ────────────────────────────────────────────────────────────── */

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-12">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm
                transition-all duration-500 border
                ${isDone
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : isActive
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-transparent border-border text-muted-foreground/40'
                }
              `}
            >
              {isDone ? <CheckCircle2 className="w-4 h-4" /> : step}
            </div>
            {i < total - 1 && (
              <div className={`w-8 md:w-16 h-px transition-colors duration-500 ${
                isDone ? 'bg-primary/40' : 'bg-border'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * STEP 1 — Service Selection
 * ────────────────────────────────────────────────────────────── */

function StepService({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        Paso 1
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        Elige tu <span className="italic font-light text-primary">Servicio</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        Selecciona el tipo de servicio que deseas agendar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {services.map((s) => {
          const active = selected === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`group relative text-left p-8 border transition-all duration-500 overflow-hidden
                ${active
                  ? 'border-primary/40 bg-primary/[0.04] ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-foreground/15'
                }`}
              style={{ borderRadius: '0.75rem' }}
            >
              {/* Icon */}
              <div className={`mb-5 transition-colors duration-300 ${
                active ? 'text-primary' : 'text-muted-foreground/50 group-hover:text-primary/70'
              }`}>{s.icon}</div>

              {/* Overline */}
              <span className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground block mb-1">
                {s.subtitle} · {s.duration}
              </span>

              {/* Title */}
              <h3 className={`font-serif text-xl mb-3 transition-colors duration-300 ${
                active ? 'text-foreground' : 'text-foreground/70'
              }`}>{s.title}</h3>

              {/* Description */}
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">{s.desc}</p>

              {/* Check badge */}
              {active && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                </div>
              )}

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

/* ─────────────────────────────────────────────────────────────────
 * STEP 2 — Artist Selection
 * ────────────────────────────────────────────────────────────── */

function StepArtist({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        Paso 2
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        Elige tu <span className="italic font-light text-primary">Artista</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        Nuestro equipo de artistas certificados.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {artists.map((a) => {
          const active = selected === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a.id)}
              className={`group relative flex flex-col items-center text-center p-6 sm:p-8 border transition-all duration-500 overflow-hidden rounded-xl
                ${active
                  ? 'border-primary/40 bg-primary/[0.04] ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-foreground/15'
                }`}
            >
              {/* Initials Avatar */}
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 mb-4 sm:mb-5 transition-all duration-500 ${
                active
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-border bg-card group-hover:border-foreground/20'
              }`}>
                <span className={`font-serif text-lg sm:text-xl tracking-tight transition-colors duration-300 ${
                  active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground/60'
                }`}>{a.initials}</span>
              </div>

              <h3 className={`font-serif text-base sm:text-lg mb-1 transition-colors duration-300 leading-tight ${
                active ? 'text-foreground' : 'text-foreground/70'
              }`}>{a.name}</h3>
              <span className="font-sans text-[0.55rem] sm:text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground leading-snug">
                {a.role}
              </span>

              {active && (
                <div className="absolute top-3 right-3 w-5 h-5 sm:w-6 sm:h-6 bg-primary/10 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                </div>
              )}

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

/* ─────────────────────────────────────────────────────────────────
 * STEP 3 — Calendar Date Selection
 * ────────────────────────────────────────────────────────────── */

function StepCalendar({
  selected,
  artistId,
  onSelect,
  selectedTime,
  onSelectTime,
}: {
  selected: Date | undefined;
  artistId: string;
  onSelect: (date: Date | undefined) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
}) {
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [slots, setSlots] = useState<{ raw: string; date: string; time: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  const artist = artists.find((a) => a.id === artistId);
  const calendarId = artist?.calendarId || '';

  // Fetch slots when date changes
  useEffect(() => {
    if (!selected || !calendarId) {
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
        const dateStr = selected.toISOString().split('T')[0];
        const result = await ghlService.getSlots(calendarId, dateStr, dateStr);
        if (!cancelled) setSlots(result);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Error desconocido';
          setSlotsError(msg.includes('Supabase') ? 'Backend no configurado aún.' : 'No se pudieron cargar los horarios.');
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };

    fetchSlots();
    return () => { cancelled = true; };
  }, [selected, calendarId]);

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        Paso 3
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        Elige <span className="italic font-light text-primary">Fecha y Hora</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        Selecciona un día y te mostraremos la disponibilidad real de{' '}
        <span className="text-foreground font-medium">{artist?.name || 'tu artista'}</span>.
      </p>

      <div className="flex justify-center">
        <div
          className="border border-border bg-card p-6 md:p-8 inline-block"
          style={{ borderRadius: '0.75rem' }}
        >
          <Calendar
            mode="single"
            selected={selected}
            onSelect={onSelect}
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

      {selected && (
        <p className="text-center mt-6 font-sans text-sm text-muted-foreground animate-in fade-in duration-300">
          Fecha seleccionada:{' '}
          <span className="text-foreground font-medium">
            {selected.toLocaleDateString('es-ES', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </p>
      )}

      {/* Time Slots Grid */}
      {selected && (
        <div className="mt-8 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground mb-4 text-center">
            Horarios Disponibles
          </p>

          {loadingSlots && (
            <div className="flex items-center justify-center gap-3 py-10">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="font-sans text-sm text-muted-foreground">Consultando disponibilidad...</span>
            </div>
          )}

          {slotsError && (
            <p className="text-center font-sans text-sm text-primary/80 py-6">{slotsError}</p>
          )}

          {!loadingSlots && !slotsError && slots.length === 0 && selected && (
            <p className="text-center font-sans text-sm text-muted-foreground py-6">
              No hay horarios disponibles para este día.
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

/* ─────────────────────────────────────────────────────────────────
 * STEP 4 — Deposit & Confirmation
 * ────────────────────────────────────────────────────────────── */

function StepConfirm({
  serviceId,
  artistId,
  date,
  selectedTime,
}: {
  serviceId: string;
  artistId: string;
  date: Date | undefined;
  selectedTime: string;
}) {
  const service = services.find((s) => s.id === serviceId);
  const artist = artists.find((a) => a.id === artistId);

  const formattedTime = selectedTime
    ? new Date(selectedTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '';

  const handlePayment = useCallback(() => {
    const params = new URLSearchParams({
      service: serviceId,
      artist: artistId,
      date: date?.toISOString() || '',
      time: selectedTime,
    });
    window.location.href = `${GHL_PAYMENT_URL}?${params.toString()}`;
  }, [serviceId, artistId, date, selectedTime]);

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        Paso 4
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        Confirma tu <span className="italic font-light text-primary">Reserva</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        Revisa los detalles y confirma con el depósito de garantía.
      </p>

      {/* Summary Card */}
      <div
        className="border border-border bg-card p-8 md:p-10 mb-8 max-w-lg"
        style={{ borderRadius: '0.75rem' }}
      >
        <h3 className="font-serif text-xl mb-6 text-foreground">Resumen de Reserva</h3>

        <div className="space-y-5">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="font-sans text-xs tracking-[0.1em] uppercase text-muted-foreground">Servicio</span>
            <span className="font-sans text-sm text-foreground">{service?.title}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="font-sans text-xs tracking-[0.1em] uppercase text-muted-foreground">Artista</span>
            <span className="font-sans text-sm text-foreground">{artist?.name}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="font-sans text-xs tracking-[0.1em] uppercase text-muted-foreground">Fecha</span>
            <span className="font-sans text-sm text-foreground">
              {date?.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="font-sans text-xs tracking-[0.1em] uppercase text-muted-foreground">Hora</span>
            <span className="font-sans text-sm text-primary font-medium">{formattedTime}</span>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="font-sans text-xs tracking-[0.1em] uppercase text-muted-foreground">Depósito Requerido</span>
            <span className="font-mono text-2xl text-foreground font-bold">$50 <span className="text-xs font-normal text-muted-foreground">USD</span></span>
          </div>
        </div>
      </div>

      {/* Deposit Notice */}
      <div
        className="flex items-start gap-4 border border-primary/20 bg-primary/[0.03] p-5 mb-10 max-w-lg"
        style={{ borderRadius: '0.75rem' }}
      >
        <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-sans text-sm text-foreground/80 leading-relaxed">
            Se requiere un depósito de <strong className="text-foreground">$50 USD</strong> para garantizar tu asistencia.
            Este monto se descuenta del costo total del servicio.
          </p>
          <p className="font-sans text-xs text-muted-foreground mt-2">
            Política de cancelación: reembolso completo hasta 48h antes.
          </p>
        </div>
      </div>

      {/* CTA — Red button per DESIGN.md §2 */}
      <button
        type="button"
        onClick={handlePayment}
        className="w-full max-w-lg py-5 bg-primary text-primary-foreground font-sans text-[0.6875rem]
                   tracking-[0.2em] uppercase flex items-center justify-center gap-3
                   hover:bg-primary/80 active:scale-[0.98]
                   transition-all duration-300
                   
                   focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none
                   group overflow-hidden relative"
        style={{ borderRadius: '0.5rem' }}
      >
        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        <span className="relative z-10">Pagar Depósito y Confirmar</span>
        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="font-sans text-[0.5625rem] text-muted-foreground uppercase tracking-[0.15em] mt-4 max-w-lg text-center">
        Serás redirigido a nuestra pasarela de pago segura.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * MAIN MULTI-STEP COMPONENT
 * ────────────────────────────────────────────────────────────── */

export function MultiStepBooking() {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState('');
  const [artistId, setArtistId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');

  const totalSteps = 4;

  const canNext =
    (step === 1 && serviceId !== '') ||
    (step === 2 && artistId !== '') ||
    (step === 3 && selectedDate !== undefined && selectedTime !== '') ||
    step === 4;

  const next = () => { if (canNext && step < totalSteps) setStep(step + 1); };
  const prev = () => { if (step > 1) setStep(step - 1); };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
      <StepIndicator current={step} total={totalSteps} />

      {/* Step Content */}
      <div className="min-h-[420px]">
        {step === 1 && (
          <StepService selected={serviceId} onSelect={(id) => { setServiceId(id); }} />
        )}
        {step === 2 && (
          <StepArtist selected={artistId} onSelect={(id) => { setArtistId(id); }} />
        )}
        {step === 3 && (
          <StepCalendar
            selected={selectedDate}
            artistId={artistId}
            onSelect={setSelectedDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
        )}
        {step === 4 && (
          <StepConfirm serviceId={serviceId} artistId={artistId} date={selectedDate} selectedTime={selectedTime} />
        )}
      </div>

      {/* Navigation */}
      {step < totalSteps && (
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase
                       text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Anterior
          </button>

          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-sans text-xs
                       tracking-[0.15em] uppercase
                       hover:bg-primary/80 transition-all duration-300
                       disabled:opacity-20 disabled:pointer-events-none
                       focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
            style={{ borderRadius: '0.375rem' }}
          >
            Siguiente
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Back button on step 4 */}
      {step === totalSteps && (
        <div className="mt-10">
          <button
            type="button"
            onClick={prev}
            className="flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase
                       text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Modificar selección
          </button>
        </div>
      )}
    </div>
  );
}
