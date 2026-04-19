import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { BookingForm } from '../components/booking/BookingForm'

export function Booking() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans antialiased selection:bg-red-600/30 transition-colors duration-500">
      <div className="static-grain" />
      <Navbar />
      
      <main className="relative z-10 w-full pt-40 pb-32">
        {/* Subtle decorative glow */}
        <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
        <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] bg-neutral-900 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        <div className="px-6 mb-16 text-center max-w-2xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-red-600 mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">The Studio Experience</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">AGEN<span className="italic font-light text-red-600">DA</span></h1>
          <p className="font-sans text-sm text-white/40 leading-relaxed max-w-lg mx-auto uppercase tracking-widest text-[10px]">Reserva tu espacio en la cronología del arte. Gestión directa, sin esperas, con precisión quirúrgica.</p>
        </div>

        <BookingForm />
      </main>

      <Footer />
    </div>
  )
}

