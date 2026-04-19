import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

// Mock Data
const artists = [
  { id: 'usr_rielo_123', name: 'Reinier Rielo', specialty: 'Realismo', img: '/assets/images/tattoo_artist_1776269987044.png' },
  { id: 'usr_tony_456', name: 'Tony', specialty: 'Geométrico', img: '/assets/images/tattoo_portfolio_3_1776269971624.png' },
];

const sizes = [
  { id: 'small', label: 'Pequeño', duration: '1h', description: 'Minimalista / Fine line' },
  { id: 'medium', label: 'Mediano', duration: '2-3h', description: 'Piezas de medio antebrazo' },
  { id: 'large', label: 'Grande', duration: '4h+', description: 'Sesiones completas' },
];

const mockSlots: Record<string, string[]> = {
  '2026-05-15': ['10:00 AM', '02:30 PM'],
  '2026-05-16': ['11:00 AM'],
  '2026-05-18': ['10:00 AM', '12:00 PM', '04:00 PM'],
};

export function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    artistId: '',
    sizeId: '',
    date: '',
    time: '',
  });

  const [contactId, setContactId] = useState<string | null>(null);
  const [isIdentityCaptured, setIsIdentityCaptured] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate contact info to "unlock" the capture button
  useEffect(() => {
    const isValid = formData.name.split(' ').length >= 2 && 
                    formData.email.includes('@') && 
                    formData.phone.length >= 8;
    setIsContactValid(isValid);
  }, [formData.name, formData.email, formData.phone]);

  // Lead Capture Function (Simulated if Config is missing)
  const handleCaptureLead = useCallback(async () => {
    if (!isContactValid || isIdentityCaptured || isCapturing) return;

    setIsCapturing(true);
    console.log("Capturing Lead in GHL Proxy...", formData);

    try {
      // Note: This matches the 'capture-ghl-lead' Supabase Edge Function logic
      // In production, you would use: supabase.functions.invoke('capture-ghl-lead', { ... })
      setTimeout(() => {
        setContactId('ghl_contact_' + Math.random().toString(36).substr(2, 9));
        setIsIdentityCaptured(true);
        setIsCapturing(false);
      }, 1500);
    } catch (err) {
      console.error("Lead capture failed:", err);
      setIsCapturing(false);
    }
  }, [formData, isContactValid, isIdentityCaptured, isCapturing]);

  // Constants for design
  const inputClasses = "w-full bg-black/40 border border-white/10 rounded-sm p-4 text-sm font-sans focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-white/20";
  const labelClasses = "font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 block";
  
  const handleDateChange = (date: string) => {
    setLoadingSlots(true);
    setFormData(prev => ({ ...prev, date, time: '' }));
    setTimeout(() => setLoadingSlots(false), 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20 mb-8">
          <CheckCircle2 className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="font-serif text-4xl mb-4 text-white">Cita Reservada</h2>
        <p className="font-sans text-sm text-white/60 max-w-sm mb-8 leading-relaxed">
          Tu sesión para {formData.date} a las {formData.time} ha sido procesada. Recibirás un SMS de confirmación en breve.
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
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 p-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Left Column: Client Data & Details */}
      <div className="lg:col-span-7 space-y-12">
        <section className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/20 text-red-600 font-serif">1</div>
            <h2 className="font-serif text-3xl text-white">Identidad</h2>
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
            <div className="mt-8 pt-4 border-t border-white/5">
              <button
                type="button"
                disabled={!isContactValid || isCapturing}
                onClick={handleCaptureLead}
                className="w-full py-4 bg-white text-black font-sans text-[10px] tracking-[0.3em] uppercase transition-all hover:bg-red-600 hover:text-white disabled:opacity-20 flex items-center justify-center gap-3 rounded-sm group overflow-hidden relative"
              >
                {isCapturing ? (
                  <span className="animate-pulse">Capturando...</span>
                ) : (
                  <>
                    <span>Validar Identidad y Continuar</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="mt-4 font-sans text-[9px] text-white/20 uppercase tracking-tighter text-center">Iniciaremos tu ficha de cliente para asegurar el seguimiento de tu sesión.</p>
            </div>
          ) : (
            <div className="mt-8 flex items-center gap-3 text-red-600 bg-red-600/5 p-4 rounded-sm border border-red-600/20 animate-in fade-in slide-in-from-left-4 duration-700">
              <CheckCircle2 className="w-4 h-4" />
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
              <h2 className="font-serif text-4xl text-white tracking-tight">Especificaciones</h2>
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
                    ? 'border-red-600 bg-red-600/5 text-white ring-1 ring-red-600/20' 
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20 text-white/60'
                  }`}
                >
                  <div className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2">{size.duration}</div>
                  <div className="font-serif text-xl mb-3">{size.label}</div>
                  <div className="font-sans text-[9px] text-white/20 leading-relaxed uppercase tracking-widest">{size.description}</div>
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
                    ? 'border-red-600 bg-red-600/5 text-white ring-1 ring-red-600/20' 
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20 text-white/60'
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0">
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
                    <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30">{artist.specialty}</div>
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
        <div className="luxury-glass p-8 md:p-10 sticky top-32 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-4 mb-12">
            <Calendar className="w-5 h-5 text-red-600" />
            <h2 className="font-serif text-4xl text-white tracking-tight">Agenda</h2>
          </div>
          
          <div className="mb-10">
            <div className="grid grid-cols-7 gap-1 text-center mb-6">
              {['D','L','M','X','J','V','S'].map(d => (
                <div key={d} className="font-sans text-[10px] tracking-widest text-white/20 uppercase font-bold">{d}</div>
              ))}
              {Array.from({length: 31}).map((_, i) => {
                const day = i + 1;
                const dateKey = `2026-05-${day.toString().padStart(2, '0')}`;
                const hasSlots = mockSlots[dateKey];
                const isSelected = formData.date === dateKey;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!hasSlots}
                    onClick={() => handleDateChange(dateKey)}
                    className={`aspect-square text-[11px] font-sans flex items-center justify-center rounded-sm transition-all duration-300 ${
                      isSelected ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 
                      hasSlots ? 'text-white/80 hover:bg-white/10 border border-white/5' : 
                      'text-white/5 pointer-events-none'
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
              <div className="h-28 flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-sm animate-pulse">
                <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/20">Sincronizando...</span>
              </div>
            ) : formData.date ? (
              <div className="grid grid-cols-2 gap-3">
                {mockSlots[formData.date]?.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData({...formData, time})}
                    className={`p-4 border text-[10px] font-sans tracking-[0.2em] uppercase rounded-sm transition-all duration-500 ${
                      formData.time === time 
                      ? 'border-red-600 bg-red-600/10 text-white ring-1 ring-red-600/20' 
                      : 'border-white/5 hover:border-white/20 text-white/40'
                    }`}
                  >
                    {time}
                  </button>
                )) || <p className="text-white/20 text-[10px] uppercase font-sans tracking-widest">Agenda Completa</p>}
              </div>
            ) : (
              <p className="text-white/10 text-[10px] uppercase font-sans tracking-[0.3em] text-center py-10 border border-white/5 border-dashed rounded-sm">Selecciona una fecha</p>
            )}
          </div>

          <div className="mt-16 pt-10 border-t border-white/10 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <p className={`${labelClasses} mb-1`}>Costo de Sesión</p>
                <p className="font-serif text-4xl text-white tracking-tight">GRATIS</p>
              </div>
              <p className="font-sans text-[9px] text-white/20 uppercase tracking-[0.2em] text-right max-w-[140px] leading-relaxed">
                Asesoría visual inicial sin compromiso.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={!formData.date || !formData.time || !formData.sizeId || !isIdentityCaptured}
              className="w-full py-5 bg-red-600 text-white font-sans text-[10px] tracking-[0.4em] uppercase transition-all duration-500 hover:bg-red-700 disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-4 rounded-sm group overflow-hidden relative"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              
              <span className="relative z-10">Confirmar Cita Gratis</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-500" />
            </button>
            <p className="font-sans text-[8px] text-center text-white/10 uppercase tracking-[0.2em]">Al confirmar aceptas nuestras políticas de cancelación.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
