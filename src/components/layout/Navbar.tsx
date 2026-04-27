import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useTheme } from "../theme-provider"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    toggleTheme(x, y)
  }

  /* Minimal ink-drop theme indicator */
  const ThemeToggleIcon = () => (
    <div className="relative w-4 h-4 rounded-full border border-current overflow-hidden transition-colors duration-500">
      <div
        className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{
          background: 'currentColor',
          transform: theme === "dark" ? 'translateY(0%)' : 'translateY(50%)',
        }}
      />
    </div>
  )

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 px-8 py-4 flex justify-between items-center text-foreground luxury-glass magnetic-element">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Mr Studio Tattoo Logo" className="h-8 w-auto object-contain" />
            <span className="font-serif text-xl tracking-widest uppercase font-bold text-foreground hidden sm:inline-block">
              Mr. <span className="text-primary italic">Tato</span>
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex gap-8 font-sans text-xs tracking-[0.2em] uppercase items-center">
          <Link to="/#services" className="hover:text-primary transition-colors">Services</Link>
          <Link to="/#portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
          <Link to="/#philosophy" className="hover:text-primary transition-colors">Philosophy</Link>
          <Link to="/booking" className="hover:text-primary transition-colors px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-sm">Contact</Link>
          
          <button
            onClick={handleToggle}
            className="ml-4 p-2.5 rounded-full border border-border hover:border-foreground/30 magnetic-element flex items-center justify-center transition-all duration-500"
            aria-label="Toggle theme"
          >
            <ThemeToggleIcon />
          </button>
        </nav>
        
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={handleToggle}
            className="p-2 mr-2 transition-colors hover:text-primary"
            aria-label="Toggle theme"
          >
            <ThemeToggleIcon />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-8 h-8 flex flex-col justify-center items-center gap-1.5 cursor-pointer group"
            aria-label="Open menu"
          >
            <div className="h-px bg-current w-full transition-all group-hover:bg-primary"></div>
            <div className="h-px bg-current w-full transition-all group-hover:bg-primary"></div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex justify-between items-center p-8 pt-10">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/assets/logo.png" alt="Mr Studio Tattoo Logo" className="h-8 w-auto object-contain" />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-white hover:text-primary transition-colors"
            aria-label="Close menu"
          >
            <X size={28} strokeWidth={1} />
          </button>
        </div>
        
        <nav className="flex-1 flex flex-col justify-center items-center gap-8 font-serif text-3xl tracking-widest uppercase">
          <Link 
            to="/#services" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-primary transition-all hover:scale-105 hover:tracking-[0.25em]"
          >
            Services
          </Link>
          <Link 
            to="/#portfolio" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-primary transition-all hover:scale-105 hover:tracking-[0.25em]"
          >
            Portfolio
          </Link>
          <Link 
            to="/#philosophy" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-primary transition-all hover:scale-105 hover:tracking-[0.25em]"
          >
            Philosophy
          </Link>
          <div className="w-12 h-px bg-white/20 my-4"></div>
          <Link 
            to="/booking" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-sans text-sm tracking-[0.2em] border border-primary text-primary px-8 py-3 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Book Appointment
          </Link>
        </nav>
      </div>
    </>
  );
}
