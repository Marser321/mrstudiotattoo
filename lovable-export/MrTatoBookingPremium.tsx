import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle2, ArrowRight, Loader2, User, Scissors, Ruler, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

/**
 * MR. TATO - PREMIUM BOOKING SYSTEM (ISOLATED COMPONENT)
 * -----------------------------------------------------
 * This component is designed for seamless integration into Lovable/React projects.
 * It is fully standalone and includes its own logic for Supabase/GHL integration.
 * 
 * SETUP REQUIREMENTS:
 * 1. Environment Variables:
 *    - VITE_SUPABASE_URL
 *    - VITE_SUPABASE_ANON_KEY
 * 2. Supabase Edge Functions:
 *    - capture-ghl-lead
 *    - get-ghl-slots
 *    - create-ghl-appointment
 */

// --- INTERNAL SERVICE CONFIGURATION ---
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

// --- COMPONENT DATA ---
const artists = [
  { 
    id: 'D7hC33lE3BixqYv5E', 
    name: 'Reinier Rielo', 
    specialty: 'Realismo / Black & Grey', 
    img: 'https://images.unsplash.com/photo-1590246815117-0b9323d068c4?w=800&q=80' 
  },
  { 
    id: 'TONY_CALENDAR_ID', 
    name: 'Tony', 
    specialty: 'Geométrico / Dotwork', 
    img: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=800&q=80' 
  },
];

const sizes = [
  { id: 'small', label: 'Micro', duration: '1-2h', description: 'Fine line / Minimalista' },
  { id: 'medium', label: 'Estudio', duration: '3-5h', description: 'Piezas medias / Antebrazo' },
  { id: 'large', label: 'Full Day', duration: '6h+', description: 'Sesiones de gran formato' },
];

export function MrTatoBookingPremium() {
  const [step, setStep] = useState(1);
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

  // Validation logic
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
        setStep(2); // Auto-advance to next step
      } else {
        throw new Error("No contact ID received");
      }
    } catch (err) {
      console.error(err);
      alert("Error al validar identidad. Por favor verifica tus datos.");
    } finally {
      setIsCapturing(false);
    }
  }, [formData, isContactValid, isIdentityCaptured, isCapturing]);

  const handleDateChange = async (date: string) => {
    setLoadingSlots(true);
    setFormData(prev => ({ ...prev, date, time: '' }));
    try {
      const start = new Date(date);
      start.setHours(0,0,0,0);
      const end = new Date(date);
      end.setHours(23,59,59,999);
      
      const slots = await ghlService.getSlots(formData.artistId, start.getTime().toString(), end.getTime().toString());
      const formattedSlots = slots.map((s: string) => {
        const d = new Date(s);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      });
      setAvailableSlots(prev => ({ ...prev, [date]: formattedSlots }));
    } catch (err) {
      console.error(err);
      alert("Error al cargar horarios. Intente otra fecha.");
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
      alert("Error al confirmar la reserva. Por favor contacta al estudio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Styles ---
  const inputClasses = "w-full bg-zinc-900/50 border border-white/10 rounded-none p-4 text-sm font-sans focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-white/20 text-white";
  const labelClasses = "font-sans text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3 block";
  const cardClasses = "p-6 border transition-all duration-500 text-left relative overflow-hidden group";

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 min-h-screen bg-black text-white animate-in fade-in duration-1000">
        <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20 mb-10">
          <CheckCircle2 className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-5xl md:text-7xl font-serif mb-6 uppercase tracking-tighter italic">Confirmado</h2>
        <p className="font-sans text-xs text-white/40 max-w-sm mb-12 leading-loose uppercase tracking-[0.3em]">
          Tu cita para el {formData.date} a las {formData.time} ha sido registrada. Recibirás un mensaje de seguimiento en breve.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-12 py-4 bg-white text-black font-sans text-[10px] tracking-[0.5em] uppercase hover:bg-red-600 hover:text-white transition-all"
        >
          Volver al Estudio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30 p-6 md:p-16 lg:p-24 selection:text-white">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto">
        {/* Header Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-32 border-b border-white/5 pb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-6">
              <span className="w-8 h-px bg-red-600" />
              <span className="text-[10px] tracking-[0.6em] uppercase font-bold">Noir Portfolio Experience</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-serif tracking-tighter mb-4 italic leading-none">RESERVA</h1>
            <p className="text-white/40 text-[11px] tracking-[0.2em] uppercase leading-relaxed max-w-md">
              Gestión de citas de alta fidelidad. Cada trazo es una declaración de identidad.
            </p>
          </div>
          <div className="flex items-center gap-12 border-l border-white/10 pl-12 h-fit hidden md:flex">
             <div>
                <p className="text-[9px] text-white/20 uppercase tracking-widest mb-2 font-bold">Studio</p>
                <p className="text-xs font-serif italic text-white/60">Mr. Tato Studio</p>
             </div>
             <div>
                <p className="text-[9px] text-white/20 uppercase tracking-widest mb-2 font-bold">Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-serif italic text-white/60">Online</span>
                </div>
             </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          {/* Main Wizard Flow */}
          <div className="lg:col-span-7 space-y-32">
            
            {/* Step 1: Identity */}
            <section className={`transition-all duration-700 ${step === 1 ? 'opacity-100' : 'opacity-20 hover:opacity-100'}`} onClick={() => setStep(1)}>
              <div className="flex items-center gap-6 mb-16">
                <span className="text-5xl font-serif text-red-600 opacity-40 italic underline decoration-1 underline-offset-[12px]">01</span>
                <h2 className="text-4xl font-serif uppercase tracking-tight flex items-center gap-4">
                   Identidad <User size={24} className="text-white/10" />
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className={labelClasses}>Nombre Completo</label>
                  <input required placeholder="Escribe tu nombre..." className={inputClasses} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={isIdentityCaptured} />
                </div>
                <div>
                  <label className={labelClasses}>Contacto Móvil</label>
                  <input required placeholder="+1 555..." className={inputClasses} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={isIdentityCaptured} />
                </div>
              </div>
              <div className="mt-10">
                <label className={labelClasses}>Dirección de Correo</label>
                <input required placeholder="tu@email.com" className={inputClasses} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={isIdentityCaptured} />
              </div>

              {!isIdentityCaptured ? (
                <button
                  type="button"
                  disabled={!isContactValid || isCapturing}
                  onClick={handleCaptureLead}
                  className="w-full mt-12 py-6 bg-white text-black font-sans text-[11px] tracking-[0.5em] uppercase hover:bg-red-600 hover:text-white disabled:opacity-10 transition-all group flex items-center justify-center gap-4"
                >
                  {isCapturing ? <Loader2 className="animate-spin" /> : <>Validar y Continuar <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform"/> </>}
                </button>
              ) : (
                <div className="mt-12 p-6 border border-white/10 bg-white/5 flex items-center justify-between group cursor-pointer" onClick={() => setIsIdentityCaptured(false)}>
                  <div className="flex items-center gap-6">
                    <CheckCircle2 className="text-red-600" size={20} />
                    <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Ficha de Cliente: {contactId?.slice(-6).toUpperCase()}</span>
                  </div>
                  <span className="text-[9px] text-red-600 border-b border-red-600/30 opacity-0 group-hover:opacity-100 transition-opacity">Editar</span>
                </div>
              )}
            </section>

            {/* Step 2: Spec (Unlocked by ID) */}
            <section className={`transition-all duration-1000 ${isIdentityCaptured ? 'opacity-100 translate-y-0' : 'opacity-10 translate-y-10 pointer-events-none'}`}>
              <div className="flex items-center gap-6 mb-16">
                <span className="text-5xl font-serif text-red-600 opacity-40 italic underline decoration-1 underline-offset-[12px]">02</span>
                <h2 className="text-4xl font-serif uppercase tracking-tight flex items-center gap-4">
                   La Obra <Scissors size={24} className="text-white/10" />
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sizes.map(size => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setFormData({...formData, sizeId: size.id})}
                    className={`${cardClasses} ${formData.sizeId === size.id ? 'border-red-600 bg-red-600/5 ring-1 ring-red-600/20' : 'border-white/5 hover:border-white/20 bg-zinc-950/20'}`}
                  >
                     <div className="flex justify-between items-start mb-6">
                        <Ruler size={16} className={formData.sizeId === size.id ? 'text-red-600' : 'text-white/20'} />
                        <span className="text-[9px] text-white/20 tracking-tighter">{size.duration}</span>
                     </div>
                     <h3 className="text-2xl font-serif mb-2 italic">{size.label}</h3>
                     <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] leading-relaxed">{size.description}</p>
                     {formData.sizeId === size.id && <div className="absolute top-0 right-0 w-8 h-8 bg-red-600/10 flex items-center justify-center rounded-bl-xl"><CheckCircle2 size={12} className="text-red-600" /></div>}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Artist */}
            <section className={`transition-all duration-1000 ${formData.sizeId ? 'opacity-100 translate-y-0' : 'opacity-10 translate-y-10 pointer-events-none'}`}>
              <div className="flex items-center gap-6 mb-16">
                <span className="text-5xl font-serif text-red-600 opacity-40 italic underline decoration-1 underline-offset-[12px]">03</span>
                <h2 className="text-4xl font-serif uppercase tracking-tight flex items-center gap-4">
                   El Autor <User size={24} className="text-white/10" />
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {artists.map(artist => (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => setFormData({...formData, artistId: artist.id})}
                    className={`${cardClasses} flex items-center gap-8 ${formData.artistId === artist.id ? 'border-red-600 bg-red-600/5 ring-1 ring-red-600/20' : 'border-white/5 hover:border-white/20 bg-zinc-950/20'}`}
                  >
                     <div className="relative w-24 h-24 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 aspect-square">
                        <img src={artist.img} className={`w-full h-full object-cover transition-transform duration-1000 ${formData.artistId === artist.id ? 'scale-110' : 'group-hover:scale-110'}`} alt={artist.name} />
                        <div className={`absolute inset-0 bg-red-600/10 transition-opacity ${formData.artistId === artist.id ? 'opacity-100' : 'opacity-0'}`} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-serif mb-2">{artist.name}</h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{artist.specialty}</p>
                     </div>
                     {formData.artistId === artist.id && <div className="absolute top-0 right-0 w-8 h-8 bg-red-600/10 flex items-center justify-center rounded-bl-xl"><CheckCircle2 size={12} className="text-red-600" /></div>}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Calendar & Confirmation */}
          <aside className={`lg:col-span-5 transition-all duration-1000 delay-300 ${isIdentityCaptured ? 'opacity-100 translate-x-0' : 'opacity-5 translate-x-12 pointer-events-none'}`}>
            <div className="sticky top-12 p-12 border border-white/10 bg-zinc-950/40 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-6 mb-12">
                <Calendar className="text-red-600" size={24} />
                <h2 className="text-4xl font-serif uppercase tracking-tight italic">Disponibilidad</h2>
              </div>

              {/* Minimalist Grid Calendar */}
              <div className="grid grid-cols-7 gap-1 mb-12 text-center">
                {['D','L','M','X','J','V','S'].map(d => <div key={d} className="text-[10px] text-white/20 font-bold mb-4 tracking-widest">{d}</div>)}
                {Array.from({length: 31}).map((_, i) => {
                  const day = i + 1;
                  const d = new Date();
                  const dateKey = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
                  const isSelected = formData.date === dateKey;
                  return (
                    <button 
                      key={i} 
                      type="button" 
                      onClick={() => handleDateChange(dateKey)} 
                      className={`aspect-square text-[11px] flex items-center justify-center transition-all border ${isSelected ? 'bg-red-600 border-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] scale-110' : 'border-white/5 hover:border-white/20 text-white/60'}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Slots Reveal */}
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                   <p className={labelClasses}>Horarios</p>
                   {formData.date && <span className="text-[10px] text-white/20 font-sans italic">{formData.date}</span>}
                </div>
                
                {loadingSlots ? (
                  <div className="h-32 flex flex-col items-center justify-center border border-dashed border-white/10 text-[10px] uppercase tracking-[0.5em] text-white/10 italic">
                      <Loader2 className="animate-spin mb-4" size={16} />
                      Sincronizando...
                  </div>
                ) : formData.date && availableSlots[formData.date] ? (
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots[formData.date].map(t => (
                      <button 
                        key={t} 
                        type="button" 
                        onClick={() => setFormData({...formData, time: t})} 
                        className={`py-4 border text-[10px] uppercase tracking-widest transition-all ${formData.time === t ? 'border-red-600 bg-red-600/10 text-white' : 'border-white/5 text-white/40 hover:border-white/20'}`}
                      >
                         {t}
                      </button>
                    ))}
                    {availableSlots[formData.date].length === 0 && <p className="col-span-2 text-center text-[10px] text-white/20 uppercase py-8">Agenda Completa</p>}
                  </div>
                ) : (
                  <div className="py-12 border border-dashed border-white/5 text-center">
                     <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] italic flex items-center justify-center gap-3">
                        <Clock size={12} /> Selecciona Fecha
                     </p>
                  </div>
                )}
              </div>

              {/* Subtotal & Action */}
              <div className="mt-16 pt-12 border-t border-white/10 space-y-10">
                <div className="flex items-end justify-between">
                   <div>
                      <p className={labelClasses}>Reserva Inicial</p>
                      <p className="text-5xl font-serif italic tracking-tighter decoration-red-600/30 underline decoration-2">Gratis</p>
                   </div>
                   <p className="text-[9px] text-white/20 uppercase tracking-widest text-right leading-loose max-w-[120px]">
                      Asesoría visual sin costo incluido.
                   </p>
                </div>

                <button 
                  type="submit" 
                  disabled={!formData.time || isSubmitting}
                  className="w-full py-6 bg-red-600 text-white text-[11px] tracking-[0.6em] uppercase hover:bg-white hover:text-black transition-all duration-700 flex items-center justify-center gap-4 group"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <>Finalizar Reserva <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform"/></>}
                </button>
                <p className="text-[8px] text-white/10 text-center uppercase tracking-widest">Al reservar aceptas nuestras políticas de privacidad y términos.</p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
