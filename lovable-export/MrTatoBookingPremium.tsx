import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * Mr. Tato Standalone Premium Booking Page
 * 
 * INSTRUCTIONS:
 * 1. Install dependencies: npm install lucide-react
 * 2. This component includes its own layout, form logic, and success states.
 * 3. Copy this file into your Lovable project.
 */

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

export function MrTatoBookingPremium() {
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

  // Validate contact info
  useEffect(() => {
    const isValid = formData.name.split(' ').length >= 2 && 
                    formData.email.includes('@') && 
                    formData.phone.length >= 8;
    setIsContactValid(isValid);
  }, [formData.name, formData.email, formData.phone]);

  const handleCaptureLead = useCallback(async () => {
    if (!isContactValid || isIdentityCaptured || isCapturing) return;
    setIsCapturing(true);
    
    // Simulate API Call
    setTimeout(() => {
      setContactId('ghl_contact_' + Math.random().toString(36).substr(2, 9));
      setIsIdentityCaptured(true);
      setIsCapturing(false);
    }, 1500);
  }, [formData, isContactValid, isIdentityCaptured, isCapturing]);

  const handleDateChange = (date: string) => {
    setLoadingSlots(true);
    setFormData(prev => ({ ...prev, date, time: '' }));
    setTimeout(() => setLoadingSlots(false), 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const inputClasses = "w-full bg-black/40 border border-white/10 rounded-sm p-4 text-sm font-sans focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-white/20 text-white";
  const labelClasses = "font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 block";

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans antialiased selection:bg-red-600/30">
      {/* Visual Ambiance */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] bg-neutral-900 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <main className="relative z-10 w-full pt-40 pb-32">
        <div className="px-6 mb-16 text-center max-w-2xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-red-600 mb-4 animate-mr-tato-fade-down">The Studio Experience</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6 animate-mr-tato-fade-up">AGEN<span className="italic font-light text-red-600">DA</span></h1>
          <p className="font-sans text-sm text-white/40 leading-relaxed max-w-lg mx-auto uppercase tracking-widest text-[10px] animate-mr-tato-fade-up">Reserva tu espacio en la cronología del arte. Gestión directa, sin esperas, con precisión quirúrgica.</p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center p-8 animate-mr-tato-zoom">
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
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 p-4 animate-mr-tato-fade-up">
            
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
                    <input required type="text" placeholder="John Doe" className={inputClasses} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClasses}>Número de Teléfono</label>
                    <input required type="tel" placeholder="+1 (555) 000-0000" className={inputClasses} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div className="mt-6">
                  <label className={labelClasses}>Correo Electrónico</label>
                  <input required type="email" placeholder="john@example.com" className={inputClasses} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                {!isIdentityCaptured ? (
                  <div className="mt-8 pt-4 border-t border-white/5">
                    <button
                      type="button"
                      disabled={!isContactValid || isCapturing}
                      onClick={handleCaptureLead}
                      className="w-full py-4 bg-white text-black font-sans text-[10px] tracking-[0.3em] uppercase transition-all hover:bg-red-600 hover:text-white disabled:opacity-20 flex items-center justify-center gap-3 rounded-sm group overflow-hidden relative"
                    >
                      {isCapturing ? <span className="animate-pulse">Capturando...</span> : <span>Validar Identidad y Continuar</span>}
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 flex items-center gap-3 text-red-600 bg-red-600/5 p-4 rounded-sm border border-red-600/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <p className="font-sans text-[10px] tracking-[0.3em] uppercase">Identidad Verificada — Cliente: {contactId?.slice(-6).toUpperCase()}</p>
                  </div>
                )}
              </section>

              {/* Step 2 & 3: Reveal Logic */}
              <div className={`space-y-16 transition-all duration-1000 ${isIdentityCaptured ? 'opacity-100 translate-y-0 blur-0' : 'opacity-10 translate-y-8 blur-[2px] pointer-events-none grayscale'}`}>
                <section>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/20 text-red-600 font-serif">II</div>
                    <h2 className="font-serif text-4xl text-white tracking-tight">Especificaciones</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {sizes.map(size => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setFormData({...formData, sizeId: size.id})}
                        className={`p-6 border rounded-sm text-left transition-all duration-500 ${formData.sizeId === size.id ? 'border-red-600 bg-red-600/5 text-white' : 'border-white/5 bg-white/[0.01] text-white/60'}`}
                      >
                        <div className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2">{size.duration}</div>
                        <div className="font-serif text-xl mb-3">{size.label}</div>
                        <div className="font-sans text-[9px] text-white/20 leading-relaxed tracking-widest">{size.description}</div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Right Column: Calendar */}
            <div className={`lg:col-span-5 space-y-8 transition-all duration-1000 ${isIdentityCaptured ? 'opacity-100' : 'opacity-10 pointer-events-none'}`}>
              <div className="bg-white/[0.02] backdrop-blur-3xl p-8 md:p-10 sticky top-32 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-12">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <h2 className="font-serif text-4xl text-white tracking-tight">Agenda</h2>
                </div>
                
                <div className="mb-10">
                  <div className="grid grid-cols-7 gap-1 text-center mb-6">
                    {['D','L','M','X','J','V','S'].map(d => <div key={d} className="font-sans text-[10px] text-white/20 uppercase font-bold">{d}</div>)}
                    {Array.from({length: 31}).map((_, i) => {
                      const day = i + 1;
                      const dateKey = `2026-05-${day.toString().padStart(2, '0')}`;
                      const hasSlots = mockSlots[dateKey];
                      const isSelected = formData.date === dateKey;
                      return (
                        <button key={i} type="button" disabled={!hasSlots} onClick={() => handleDateChange(dateKey)}
                          className={`aspect-square text-[11px] font-sans flex items-center justify-center rounded-sm transition-all ${isSelected ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : hasSlots ? 'text-white/80 hover:bg-white/10 border border-white/5' : 'text-white/5 pointer-events-none'}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="submit" disabled={!formData.date || !formData.time || !formData.sizeId || !isIdentityCaptured}
                  className="w-full py-5 bg-red-600 text-white font-sans text-[10px] tracking-[0.4em] uppercase transition-all duration-500 hover:bg-red-700 disabled:opacity-20 rounded-sm"
                >
                  Confirmar Cita Gratis
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <style>{`
        @keyframes mr-tato-fade-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mr-tato-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mr-tato-zoom {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-mr-tato-fade-down { animation: mr-tato-fade-down 1s forwards; }
        .animate-mr-tato-fade-up { animation: mr-tato-fade-up 1s forwards; }
        .animate-mr-tato-zoom { animation: mr-tato-zoom 0.7s forwards; }
      `}</style>
    </div>
  );
}
