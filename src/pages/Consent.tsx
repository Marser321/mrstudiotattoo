import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ConsentWizard } from '../components/consent/ConsentWizard'
import { InkBackground } from '../components/ui/InkBackground'

export function Consent() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden font-sans antialiased selection:bg-primary/30 transition-colors duration-500">
      <InkBackground />
      <div className="static-grain" />
      <Navbar />

      <main className="relative z-10 w-full pt-36 sm:pt-40 pb-32 bg-transparent">
        {/* Decorative glows */}
        <div className="fixed top-0 left-0 w-[40vw] h-[40vh] bg-primary/[0.02] rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 right-0 w-[35vw] h-[35vh] bg-card rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Page Header */}
        <div className="px-6 mb-16 sm:mb-20 text-center max-w-2xl mx-auto">
          <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-5 animate-in fade-in slide-in-from-top-4 duration-1000">
            Consentimiento Informado
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            CON<span className="italic font-light text-primary">SENT</span>
          </h1>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Completa tu formulario de consentimiento de forma digital. Rápido, seguro y sin papel.
          </p>
        </div>

        <ConsentWizard />
      </main>

      <Footer />
    </div>
  )
}
