import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { ghlService } from '../../services/ghlService';
import { toast } from 'sonner';

// Standard Artist Configuration
const artists = [
  { 
    id: 'D7hC33lE3BixqYv5E', // Real GHL Calendar ID from test snippet
    name: 'Reinier Rielo', 
    specialty: 'Realismo', 
    img: '/assets/images/tattoo_artist_1776269987044.png' 
  },
  { 
    id: 'TONY_CALENDAR_ID', // Placeholder for Tony
    name: 'Tony', 
    specialty: 'Geométrico', 
    img: '/assets/images/tattoo_portfolio_3_1776269971624.png' 
  },
];

const sizes = [
  { id: 'small', label: 'Pequeño', duration: '1h', description: 'Minimalista / Fine line' },
  { id: 'medium', label: 'Mediano', duration: '2-3h', description: 'Piezas de medio antebrazo' },
  { id: 'large', label: 'Grande', duration: '4h+', description: 'Sesiones completas' },
];

export function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    artistId: artists[0].id, // Default to first artist
    sizeId: '',
    date: '',
    time: '',
  });

  const [contactId, setContactId] = useState<string | null>(null);
  const [isIdentityCaptured, setIsIdentityCaptured] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Record<string, string[]>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate contact info to "unlock" the capture button
  useEffect(() => {
    const isValid = formData.name.split(' ').length >= 2 && 
                    formData.email.includes('@') && 
                    formData.phone.length >= 8;
    setIsContactValid(isValid);
  }, [formData.name, formData.email, formData.phone]);

  // Lead Capture Function (Real Integration)
  const handleCaptureLead = useCallback(async () => {
    if (!isContactValid || isIdentityCaptured || isCapturing) return;

    setIsCapturing(true);
    try {
      const result = await ghlService.captureLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      if (result?.contactId) {
        setContactId(result.contactId);
        setIsIdentityCaptured(true);
        toast.success("Identidad verificada correctamente.");
      } else {
        throw new Error("No se recibió un Contact ID");
      }
    } catch (err) {
      console.error("Lead capture failed:", err);
      toast.error("Error al validar identidad. Por favor intenta de nuevo.");
    } finally {
      setIsCapturing(false);
    }
  }, [formData, isContactValid, isIdentityCaptured, isCapturing]);

  // Constants for design
  const inputClasses = "w-full bg-card border border-border rounded-sm p-4 text-sm font-sans text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/40";
  const labelClasses = "font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block";
  
  const handleDateChange = async (date: string) => {
    if (!formData.artistId) {
      toast.error("Selecciona un artista primero");
      return;
    }

    setLoadingSlots(true);
    setFormData(prev => ({ ...prev, date, time: '' }));
    
    try {
      // Calculate start and end date for the selected day
      const startDate = new Date(date).getTime().toString();
      const endDate = (new Date(date).getTime() + 86400000).toString();
      
      const slots = await ghlService.getSlots(formData.artistId, startDate, endDate);
      
      // Transform ISO slots to time strings for display
      const formattedSlots = slots.map((s: string) => {
        const d = new Date(s);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      });

      setAvailableSlots(prev => ({ ...prev, [date]: formattedSlots }));
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      toast.error("Error al obtener horarios disponibles.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId || !formData.date || !formData.time) return;

    setIsSubmitting(true);
    try {
      // Construct startTime in ISO format
      const [hour, minuteSegment] = formData.time.split(':');
      const [minute, ampm] = minuteSegment.split(' ');
      let h = parseInt(hour);
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      
      const sessionDate = new Date(formData.date);
      sessionDate.setHours(h, parseInt(minute), 0, 0);

      await ghlService.createAppointment({
        contactId,
        calendarId: formData.artistId,
        startTime: sessionDate.toISOString(),
      });

      setIsSuccess(true);
      toast.success("¡Cita confirmada!");
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Error al confirmar la cita. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20 mb-8">
          <CheckCircle2 className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="font-serif text-4xl mb-4 text-foreground uppercase tracking-tighter">Cita Reservada</h2>
        <p className="font-sans text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed uppercase tracking-widest text-[10px]">
          Tu sesión para {formData.date} a las {formData.time} ha sido procesada con éxito.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-foreground text-background font-sans text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all rounded-sm"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 p-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Left Column: Client Data & Details */}
      <div className="lg:col-span-7 space-y-12">
        <section className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/20 text-red-600 font-serif">1</div>
            <h2 className="font-serif text-3xl text-foreground">Identidad</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Nombre Completo</label>
              <input 
                required
                type="text" 
                placeholder="John Doe"
                className={inputClasses}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>Número de Teléfono</label>
              <input 
                required
                type="tel" 
                placeholder="+1 (555) 000-0000"
                className={inputClasses}
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-6">
            <label className={labelClasses}>Correo Electrónico</label>
            <input 
              required
              type="email" 
              placeholder="john@example.com"
              className={inputClasses}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {!isIdentityCaptured ? (
            <div className="mt-8 pt-4 border-t border-border">
              <button
                type="button"
                disabled={!isContactValid || isCapturing}
                onClick={handleCaptureLead}
                className="w-full py-4 bg-white text-black font-sans text-[10px] tracking-[0.3em] uppercase transition-all hover:bg-red-600 hover:text-white disabled:opacity-20 flex items-center justify-center gap-3 rounded-sm group overflow-hidden relative"
              >
                {isCapturing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Validar Identidad y Continuar</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="mt-4 font-sans text-[9px] text-muted-foreground/40 uppercase tracking-tighter text-center">Iniciaremos tu ficha de cliente para asegurar el seguimiento de tu sesión.</p>
            </div>
          ) : (
            <div className="mt-8 flex items-center gap-3 text-foreground bg-card p-4 rounded-sm border border-border animate-in fade-in slide-in-from-left-4 duration-700">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase">Identidad Verificada — Cliente: {contactId?.slice(-6).toUpperCase()}</p>
            </div>
          )}
        </section>

        {/* Sections 2 & 3: Reveal with smooth transition */}
        <div className={`space-y-16 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isIdentityCaptured ? 'opacity-100 translate-y-0 blur-0' : 'opacity-10 translate-y-8 blur-[2px] pointer-events-none grayscale'
        }`}>
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/20 text-red-600 font-serif translate-y-[-1px]">II</div>
              <h2 className="font-serif text-4xl text-foreground tracking-tight">Especificaciones</h2>
            </div>
            
            <label className={labelClasses}>Tamaño de la Obra</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {sizes.map(size => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setFormData({...formData, sizeId: size.id})}
                  className={`p-6 border rounded-sm text-left transition-all duration-500 group relative overflow-hidden ${
                    formData.sizeId === size.id 
                    ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary/20' 
                    : 'border-border bg-card hover:border-foreground/20 text-muted-foreground'
                  }`}
                >
                  <div className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted-foreground/50 mb-2">{size.duration}</div>
                  <div className="font-serif text-xl mb-3">{size.label}</div>
                  <div className="font-sans text-[9px] text-muted-foreground/30 leading-relaxed uppercase tracking-widest">{size.description}</div>
                  {formData.sizeId === size.id && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-red-600/10 flex items-center justify-center rounded-bl-lg">
                      <CheckCircle2 className="w-3 h-3 text-red-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <label className={labelClasses}>Preferencia de Artista</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artists.map(artist => (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => setFormData({...formData, artistId: artist.id})}
                  className={`relative flex items-center gap-5 p-5 border rounded-sm transition-all duration-700 group overflow-hidden ${
                    formData.artistId === artist.id 
                    ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary/20' 
                    : 'border-border bg-card hover:border-foreground/20 text-muted-foreground'
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border shrink-0">
                    <img 
                      src={artist.img} 
                      alt={artist.name} 
                      className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                        formData.artistId === artist.id ? 'grayscale-0 scale-110' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
                      }`} 
                    />
                    <div className={`absolute inset-0 bg-red-600/10 transition-opacity duration-700 ${formData.artistId === artist.id ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-serif text-xl mb-1">{artist.name}</div>
                    <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">{artist.specialty}</div>
                  </div>
                  {formData.artistId === artist.id && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-red-600/10 flex items-center justify-center rounded-bl-lg">
                      <CheckCircle2 className="w-3 h-3 text-red-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Right Column: Calendar & Summary */}
      <div className={`lg:col-span-5 space-y-8 transition-all duration-1000 delay-150 ease-out ${isIdentityCaptured ? 'opacity-100 translate-x-0' : 'opacity-10 translate-x-8 blur-[1px] pointer-events-none'}`}>
        <div className="luxury-glass p-8 md:p-10 sticky top-32 border border-border">
          <div className="flex items-center gap-4 mb-12">
            <Calendar className="w-5 h-5 text-red-600" />
            <h2 className="font-serif text-4xl text-foreground tracking-tight">Agenda</h2>
          </div>
          
          <div className="mb-10">
            <div className="grid grid-cols-7 gap-1 text-center mb-6">
              {['D','L','M','X','J','V','S'].map(d => (
                <div key={d} className="font-sans text-[10px] tracking-widest text-muted-foreground/40 uppercase font-bold">{d}</div>
              ))}
              {Array.from({length: 31}).map((_, i) => {
                const day = i + 1;
                const d = new Date();
                const month = (d.getMonth() + 1).toString().padStart(2, '0');
                const year = d.getFullYear();
                const dateKey = `${year}-${month}-${day.toString().padStart(2, '0')}`;
                const isSelected = formData.date === dateKey;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDateChange(dateKey)}
                    className={`aspect-square text-[11px] font-sans flex items-center justify-center rounded-sm transition-all duration-300 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 
                      'text-foreground/80 hover:bg-muted border border-border'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <label className={labelClasses}>Horarios Disponibles</label>
            {loadingSlots ? (
              <div className="h-28 flex items-center justify-center border border-border bg-card rounded-sm animate-pulse">
                <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted-foreground/40">Sincronizando...</span>
              </div>
            ) : formData.date ? (
              <div className="grid grid-cols-2 gap-3">
                {availableSlots[formData.date]?.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData({...formData, time})}
                    className={`p-4 border text-[10px] font-sans tracking-[0.2em] uppercase rounded-sm transition-all duration-500 ${
                      formData.time === time 
                      ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary/20' 
                      : 'border-border hover:border-foreground/20 text-muted-foreground'
                    }`}
                  >
                    {time}
                  </button>
                )) || <p className="text-muted-foreground/40 text-[10px] uppercase font-sans tracking-widest text-center py-4">No hay turnos para hoy</p>}
              </div>
            ) : (
              <p className="text-muted-foreground/20 text-[10px] uppercase font-sans tracking-[0.3em] text-center py-10 border border-border border-dashed rounded-sm">Selecciona una fecha</p>
            )}
          </div>

          <div className="mt-16 pt-10 border-t border-border space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <p className={`${labelClasses} mb-1`}>Costo de Sesión</p>
                <p className="font-serif text-4xl text-foreground tracking-tight">GRATIS</p>
              </div>
              <p className="font-sans text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em] text-right max-w-[140px] leading-relaxed">
                Asesoría visual inicial sin compromiso.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={!formData.date || !formData.time || !formData.sizeId || !isIdentityCaptured || isSubmitting}
              className="w-full py-5 bg-primary text-primary-foreground font-sans text-[10px] tracking-[0.4em] uppercase transition-all duration-500 hover:bg-primary/90 disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-4 rounded-sm group overflow-hidden relative"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Confirmar Cita Gratis</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-500" />
                </>
              )}
            </button>
            
            <div className="text-center pt-2">
              <a href="/consent" target="_blank" className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.1em] uppercase text-primary hover:text-primary/80 transition-colors">
                <span className="w-3 h-3">✍️</span>
                Rellenar Consentimiento Obligatorio
              </a>
            </div>

            <p className="font-sans text-[8px] text-center text-muted-foreground/20 uppercase tracking-[0.2em]">Al confirmar aceptas nuestras políticas de cancelación.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
