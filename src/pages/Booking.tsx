import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { MultiStepBooking } from '../components/booking/MultiStepBooking'
import { InkBackground } from '../components/ui/InkBackground'
import { useTranslation } from 'react-i18next'

export function Booking() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden font-sans antialiased selection:bg-primary/30 transition-colors duration-500">
      <InkBackground />
      <div className="static-grain" />
      <Navbar />
      
      <main className="relative z-10 w-full pt-40 pb-32 bg-transparent">
        {/* Subtle decorative glows */}
        <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] bg-card rounded-full blur-[120px] pointer-events-none -z-10" />
        
        {/* Page Header */}
        <div className="px-6 mb-20 text-center max-w-2xl mx-auto">
          <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-5 animate-in fade-in slide-in-from-top-4 duration-1000">
            {t('booking.studioExp')}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {t('booking.title1')}<span className="italic font-light text-primary">{t('booking.title2')}</span>
          </h1>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {t('booking.desc')}
          </p>
        </div>

        <MultiStepBooking />
      </main>

      <Footer />
    </div>
  )
}
