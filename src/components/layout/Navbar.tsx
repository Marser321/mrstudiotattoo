import { Moon, Sun } from "lucide-react"
import { useTheme } from "../theme-provider"

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 px-8 py-4 flex justify-between items-center text-foreground luxury-glass magnetic-element">
      <div className="flex items-center gap-4">
        {/* We can use an icon or text when image is missing */}
        <span className="font-serif text-xl tracking-widest uppercase font-bold">
          Mr. <span className="text-primary italic">Tato</span>
        </span>
      </div>
      
      <nav className="hidden md:flex gap-8 font-sans text-xs tracking-[0.2em] uppercase items-center">
        <a href="#services" className="hover:text-primary transition-colors">Services</a>
        <a href="#portfolio" className="hover:text-primary transition-colors">Portfolio</a>
        <a href="#philosophy" className="hover:text-primary transition-colors">Philosophy</a>
        <a href="#contact" className="hover:text-primary transition-colors px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-sm">Contact</a>
        
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="ml-4 p-2 rounded-full border border-border hover:bg-secondary magnetic-element flex items-center justify-center transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>
      
      <div className="md:hidden flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 mr-2"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="w-8 flex flex-col gap-1.5 cursor-pointer">
          <div className="h-px bg-current w-full"></div>
          <div className="h-px bg-current w-full"></div>
        </div>
      </div>
    </header>
  );
}
