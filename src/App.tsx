import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Services } from './components/sections/Services'
import { Portfolio } from './components/sections/Portfolio'
import { Philosophy } from './components/sections/Philosophy'
import { Artists } from './components/sections/Artists'
import { Testimonials } from './components/sections/Testimonials'
import { InkBackground } from './components/ui/InkBackground'

function App() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans antialiased selection:bg-primary selection:text-primary-foreground transition-colors duration-500">
      <InkBackground />
      <Navbar />
      
      {/* We apply a transparent background to main to let the InkBackground show through */}
      <main className="relative z-10 w-full overflow-hidden bg-transparent">
        <Hero />
        
        {/* Stats + Services grid */}
        <Services />
        
        {/* The colossal text narrative replacing the empty layout space */}
        <Philosophy />
        
        <Portfolio />
        
        {/* Meet the artists */}
        <Artists />
        
        {/* Social proof */}
        <Testimonials />
      </main>

      <Footer />
    </div>
  )
}

export default App
