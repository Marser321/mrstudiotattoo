import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

/**
 * MR. TATO STANDALONE PREMIUM BOOKING PAGE
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install dependencies: 
 *    npm install @supabase/supabase-js lucide-react sonner
 * 
 * 2. Set Environment Variables in your Lovable project:
 *    - VITE_SUPABASE_URL
 *    - VITE_SUPABASE_ANON_KEY
 * 
 * 3. Copy this entire file into your project.
 */

// Initialize Supabase (Standalone helper)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ghlService = {
  async captureLead(data: { name: string; email: string; phone: string }) {
    const [firstName, ...rest] = data.name.split(' ');
    const lastName = rest.join(' ');
    const { data: result, error } = await supabase.functions.invoke('capture-ghl-lead', {
      body: { firstName, lastName, email: data.email, phone: data.phone }
    });
    if (error) throw error;
    return result;
  },

  async getSlots(calendarId: string, startDate: string, endDate: string) {
    const { data: result, error } = await supabase.functions.invoke('get-ghl-slots', {
      body: { calendarId, startDate, endDate }
    });
    if (error) throw error;
    return result.slots || [];
  },

  async createAppointment(appointment: { contactId: string; calendarId: string; startTime: string }) {
    const { data: result, error } = await supabase.functions.invoke('create-ghl-appointment', {
      body: appointment
    });
    if (error) throw error;
    return result;
  }
};

// Artists Configuration
const artists = [
  { 
    id: 'D7hC33lE3BixqYv5E', 
    name: 'Reinier Rielo', 
    specialty: 'Realismo', 
    img: 'https://images.unsplash.com/photo-1590246815117-0b9323d068c4?w=600&q=80' 
  },
  { 
    id: 'TONY_CALENDAR_ID', 
    name: 'Tony', 
    specialty: 'Geométrico', 
    img: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600&q=80' 
  },
];

const sizes = [
  { id: 'small', label: 'Pequeño', duration: '1h', description: 'Minimalista / Fine line' },
  { id: 'medium', label: 'Mediano', duration: '2-3h', description: 'Piezas de medio antebrazo' },
  { id: 'large', label: 'Grande', duration: '4h+', description: 'Sesiones completas' },
];

export function MrTatoBookingPremium() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    artistId: artists[0].id,
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

  // Simple toast substitute if not using sonner
  const notify = (msg: string) => alert(msg);

  useEffect(() => {
    const isValid = formData.name.split(' ').length >= 2 && 
                    formData.email.includes('@') && 
                    formData.phone.length >= 8;
    setIsContactValid(isValid);
  }, [formData.name, formData.email, formData.phone]);

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
      } else {
        throw new Error("No contact ID received");
      }
    } catch (err) {
      console.error(err);
      notify("Error al validar identidad. Verifica tu conexión.");
    } finally {
      setIsCapturing(false);
    }
  }, [formData, isContactValid, isIdentityCaptured, isCapturing]);

  const handleDateChange = async (date: string) => {
    setLoadingSlots(true);
    setFormData(prev => ({ ...prev, date, time: '' }));
    try {
      const startDate = new Date(date).getTime().toString();
      const endDate = (new Date(date).getTime() + 86400000).toString();
      const slots = await ghlService.getSlots(formData.artistId, startDate, endDate);
      const formattedSlots = slots.map((s: string) => {
        const d = new Date(s);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      });
      setAvailableSlots(prev => ({ ...prev, [date]: formattedSlots }));
    } catch (err) {
      console.error(err);
      notify("Error al cargar horarios.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId || !formData.date || !formData.time) return;
    setIsSubmitting(true);
    try {
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
    } catch (err) {
      console.error(err);
      notify("Fallo en la reserva.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-black/40 border border-white/10 rounded-sm p-4 text-sm font-sans focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-white/20 text-white";
  const labelClasses = "font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 block";

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 min-h-screen bg-black text-white">
        <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20 mb-8">
          <CheckCircle2 className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="font-serif text-4xl mb-4 uppercase tracking-tighter">Cita Reservada</h2>
        <p className="font-sans text-sm text-white/60 max-w-sm mb-8 leading-relaxed uppercase tracking-widest text-[10px]">
          Tu sesión para {formData.date} a las {formData.time} ha sido procesada con éxito.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-white text-black font-sans text-xs tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all rounded-sm"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30 overflow-x-hidden p-6 md:p-12">
      <div className="max-w-7xl mx-auto py-20">
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <p className="text-red-600 text-[10px] tracking-[0.5em] uppercase mb-4">The Studio Experience</p>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-8 italic">AGENDA</h1>
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase leading-loose">Gestión directa de citas con integración de CRM de alta precisión.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-20">
            <section>
              <div className="flex items-center gap-6 mb-12">
                <span className="text-4xl font-serif text-red-600 opacity-50 underline decoration-1 underline-offset-8">01</span>
                <h2 className="text-3xl font-serif uppercase tracking-tight">Identidad</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClasses}>Nombre Completo</label>
                  <input required placeholder="John Doe" className={inputClasses} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className={labelClasses}>Teléfono</label>
                  <input required placeholder="+1 555..." className={inputClasses} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="mt-8">
                <label className={labelClasses}>Email</label>
                <input required placeholder="email@example.com" className={inputClasses} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              {!isIdentityCaptured ? (
                <button
                  type="button"
                  disabled={!isContactValid || isCapturing}
                  onClick={handleCaptureLead}
                  className="w-full mt-10 py-5 bg-white text-black text-[10px] tracking-[0.4em] uppercase hover:bg-red-600 hover:text-white disabled:opacity-20 transition-all rounded-sm flex items-center justify-center gap-4"
                >
                  {isCapturing ? <Loader2 className="animate-spin" /> : <>Validar y Continuar <ArrowRight size={14}/></>}
                </button>
              ) : (
                <div className="mt-10 p-5 border border-white/10 bg-white/5 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                  <CheckCircle2 className="text-red-600" size={16} />
                  <span className="text-[10px] tracking-widest uppercase text-white/60">Cliente Identificado: {contactId?.slice(-6).toUpperCase()}</span>
                </div>
              )}
            </section>

            <div className={`space-y-20 transition-all duration-1000 ${isIdentityCaptured ? 'opacity-100 blur-0' : 'opacity-10 blur-md pointer-events-none'}`}>
              <section>
                <div className="flex items-center gap-6 mb-12">
                  <span className="text-4xl font-serif text-red-600 opacity-50 underline decoration-1 underline-offset-8">02</span>
                  <h2 className="text-3xl font-serif uppercase tracking-tight">Propuesta</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {sizes.map(size => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setFormData({...formData, sizeId: size.id})}
                      className={`p-6 border text-left transition-all ${formData.sizeId === size.id ? 'border-red-600 bg-red-600/5' : 'border-white/5 hover:border-white/20'}`}
                    >
                      <p className="text-[9px] text-white/20 uppercase mb-3">{size.duration}</p>
                      <h3 className="text-xl font-serif mb-2">{size.label}</h3>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest">{size.description}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-6 mb-12">
                  <span className="text-4xl font-serif text-red-600 opacity-50 underline decoration-1 underline-offset-8">03</span>
                  <h2 className="text-3xl font-serif uppercase tracking-tight">Personal</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {artists.map(artist => (
                    <button
                      key={artist.id}
                      type="button"
                      onClick={() => setFormData({...formData, artistId: artist.id})}
                      className={`flex items-center gap-6 p-6 border transition-all ${formData.artistId === artist.id ? 'border-red-600 bg-red-600/5' : 'border-white/5 hover:border-white/20'}`}
                    >
                      <img src={artist.img} className="w-16 h-16 rounded-full object-cover grayscale" alt={artist.name} />
                      <div className="text-left">
                        <h3 className="text-lg font-serif">{artist.name}</h3>
                        <p className="text-[9px] text-white/30 uppercase tracking-widest">{artist.specialty}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className={`lg:col-span-5 transition-all duration-1000 ${isIdentityCaptured ? 'opacity-100' : 'opacity-10 pointer-events-none'}`}>
            <div className="sticky top-12 p-10 border border-white/10 bg-zinc-950/50 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-10">
                <Calendar className="text-red-600" size={18} />
                <h2 className="text-3xl font-serif uppercase tracking-tight">Disponibilidad</h2>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-10">
                {['D','L','M','X','J','V','S'].map(d => <div key={d} className="text-[9px] text-white/20 font-bold text-center mb-4">{d}</div>)}
                {Array.from({length: 31}).map((_, i) => {
                  const day = i + 1;
                  const d = new Date();
                  const dateKey = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
                  const isSelected = formData.date === dateKey;
                  return (
                    <button key={i} type="button" onClick={() => handleDateChange(dateKey)} className={`aspect-square text-[10px] flex items-center justify-center rounded-sm border transition-all ${isSelected ? 'bg-red-600 border-red-600' : 'border-white/5 hover:border-white/20'}`}>
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-8">
                <p className={labelClasses}>Sesiones Disponibles</p>
                {loadingSlots ? (
                  <div className="h-20 flex items-center justify-center animate-pulse border border-dashed border-white/10 text-[10px] uppercase tracking-widest text-white/20">Sincronizando...</div>
                ) : formData.date && availableSlots[formData.date] ? (
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots[formData.date].map(t => (
                      <button key={t} type="button" onClick={() => setFormData({...formData, time: t})} className={`p-4 border text-[9px] uppercase tracking-widest transition-all ${formData.time === t ? 'border-red-600 bg-red-600/10' : 'border-white/5'}`}>{t}</button>
                    ))}
                  </div>
                ) : <p className="text-[9px] text-white/10 text-center uppercase tracking-widest italic py-8 border border-dashed border-white/5">Selecciona una fecha</p>}
              </div>

              <div className="mt-16 pt-10 border-t border-white/10">
                <button type="submit" disabled={!formData.time || isSubmitting} className="w-full py-5 bg-red-600 text-[10px] tracking-[0.5em] uppercase hover:bg-white hover:text-black transition-all rounded-sm flex items-center justify-center gap-4">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <>Finalizar Reserva <ArrowRight size={14}/></>}
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
