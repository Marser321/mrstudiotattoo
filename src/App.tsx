import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { HeroScrollyEmbed } from './components/sections/HeroScrollyEmbed'
import { Portfolio } from './components/sections/Portfolio'
import { Philosophy } from './components/sections/Philosophy'
import { Artists } from './components/sections/Artists'
import { Testimonials } from './components/sections/Testimonials'
import { InkBackground } from './components/ui/InkBackground'
import { SectionTransition } from './components/ui/SectionTransition'


function App() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans antialiased selection:bg-primary selection:text-primary-foreground transition-colors duration-500">
      <InkBackground />
      <Navbar />
      
      {/* We apply a transparent background to main to let the InkBackground show through */}
      <main className="relative z-10 w-full overflow-hidden bg-transparent">
        <HeroScrollyEmbed />
        
        <SectionTransition variant="gradient" height="16vh" accent />

        {/* The colossal text narrative replacing the empty layout space */}
        <Philosophy />
        
        <SectionTransition variant="line" height="12vh" />
        
        <Portfolio />
        
        <SectionTransition variant="fade" height="14vh" accent />
        
        {/* Meet the artists */}
        <Artists />
        
        <SectionTransition variant="line" height="12vh" />
        
        {/* Social proof */}
        <Testimonials />
      </main>

      <Footer />
    </div>
  )
}

export default App
