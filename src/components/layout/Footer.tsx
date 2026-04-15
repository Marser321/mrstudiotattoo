export function Footer() {
  return (
    <footer className="w-full bg-background pt-24 pb-12 px-8 md:px-16 lg:px-32 border-t border-white/5" id="contact">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <div className="lg:col-span-2">
          <span className="font-serif text-2xl tracking-widest uppercase font-bold mb-8 block opacity-80">
            Mr. <span className="text-primary italic">Tato</span>
          </span>
          <h3 className="font-serif text-4xl md:text-5xl text-white mb-6 uppercase tracking-wider">
            Ready for your<br/><span className="text-primary italic">Masterpiece?</span>
          </h3>
          <p className="font-sans text-sm text-muted-foreground max-w-sm leading-relaxed mb-8">
            Ubicado en el corazón de Little Havana. Nuestros artistas son maestros del realismo y las líneas finas. Walk-ins bienvenidos.
          </p>
          <a href="#" className="inline-block border-b border-primary text-white font-sans text-xs tracking-widest uppercase pb-1 hover:text-primary transition-colors">
            Book Now on Booksy
          </a>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="font-sans text-xs tracking-[0.2em] text-white/50 uppercase">Visit Us</h4>
          <address className="font-sans text-sm text-white not-italic leading-relaxed">
            1756 SW 8th St #201<br/>
            Miami, FL 33135<br/>
            United States
          </address>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-primary text-xs uppercase tracking-widest font-sans hover:text-white transition-colors">
            Get Directions
          </a>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="font-sans text-xs tracking-[0.2em] text-white/50 uppercase">Contact</h4>
          <div className="flex flex-col gap-2 font-sans text-sm text-white">
            <a href="tel:7862095950" className="hover:text-primary transition-colors">(786) 209-5950</a>
            <a href="mailto:reinierrielodiaz@gmail.com" className="hover:text-primary transition-colors">reinierrielodiaz@gmail.com</a>
          </div>
          <div className="mt-4 flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-all text-white">
              <span className="font-sans text-xs">IG</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-all text-white">
              <span className="font-sans text-xs">TK</span>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-sans text-xs text-white/30 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Mr. Studio Tattoo. All Rights Reserved.
        </p>
        <div className="flex gap-8 font-sans text-xs text-white/30 uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
