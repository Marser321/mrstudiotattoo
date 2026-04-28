
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { IntakeForm } from '../components/booking/simple/IntakeForm';
import { Toaster } from 'sonner';
import { InkBackground } from '../components/ui/InkBackground';
import { useTranslation } from 'react-i18next';

export function BookingSimple() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-red-600/30 font-sans antialiased overflow-x-hidden transition-colors duration-500">
      <Toaster position="top-center" theme="dark" closeButton />
      <InkBackground />
      <div className="static-grain" />
      <Navbar />

      <main>
        {/* HERO SECTION: SHORTER & IMPACTFUL */}
        <section className="relative h-[45vh] flex items-center justify-center overflow-hidden border-b border-border">
          {/* Video Background with High Contrast Noir Filters */}
          <div className="absolute inset-0 z-0 bg-zinc-950">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              preload="metadata"
              className="w-full h-full object-cover grayscale brightness-[0.25] contrast-[1.2]"
            >
              <source src="/assets/mr-studio-tattoo/videos/hero-bg.mov" type="video/quicktime" />
              Tu navegador no soporta video.
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-16">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary mb-4 font-bold">
              {t('booking.fastTrack')}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl tracking-[0.05em] leading-[0.9] mb-4">
              {t('booking.simpleTitle1')} <span className="italic font-light text-primary">{t('booking.simpleTitle2')}</span>
            </h1>
            <p className="font-sans text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-light">
              {t('booking.simpleDesc')}
            </p>
          </div>
        </section>

        {/* INTAKE FORM SECTION: IMMEDIATE ACCESS */}
        <section id="intake" className="py-20 relative overflow-hidden bg-transparent">
          {/* Glowing accents for noir aesthetic */}
          <div className="absolute top-0 left-0 w-[30vw] h-[30vh] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[30vw] h-[30vh] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="lg:sticky lg:top-32 space-y-8">
                <div>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed uppercase tracking-[0.2em] mb-12">
                    {t('booking.simpleInfo')}
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="w-10 h-[1px] bg-red-600" />
                    <span className="text-[10px] tracking-widest uppercase font-bold">{t('booking.response24h')}</span>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="w-10 h-[1px] bg-red-600" />
                    <span className="text-[10px] tracking-widest uppercase font-bold">{t('booking.directConnection')}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-1 bg-red-600/10 blur-xl rounded-full opacity-20" />
                <IntakeForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
