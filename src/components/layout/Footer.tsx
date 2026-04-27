import { Link } from 'react-router-dom';
import { FileText, MapPin, Phone, Mail, ArrowUpRight, Clock } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────────────
   DOORMAT FOOTER — Mr Studio Tattoo
   Architecture:
     1. Top Consent Banner (full-width)
     2. 3-column CSS Grid Doormat (Navigation | Social & Contact | CTA)
     3. Massive full-width studio name (viewport-fill typography)
     4. Legal bottom bar
   ────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Artistas', to: '/#artists' },
  { label: 'Galería', to: '/#gallery' },
  { label: 'Filosofía', to: '/#philosophy' },
  { label: 'Reservar', to: '/booking' },
  { label: 'Consentimiento', to: '/consent' },
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/mr.tatostudio',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@mr.tatostudio',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.15a4.85 4.85 0 0 1-1-.46z"/>
      </svg>
    ),
  },
];

/* ── CSS for premium link micro-interactions ── */
const ftLinkStyle = {
  color: 'var(--foreground-secondary, #A3A3A3)',
  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
  transition: 'color 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
  display: 'inline-block',
  willChange: 'transform, color',
} as const;

const handleLinkEnter = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.color = 'var(--accent, #DC2626)';
  e.currentTarget.style.transform = 'translateY(-2px)';
};
const handleLinkLeave = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.color = 'var(--foreground-secondary, #A3A3A3)';
  e.currentTarget.style.transform = 'translateY(0)';
};

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const studioNameRef = useRef<HTMLDivElement>(null);
  const studioTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!footerRef.current) return;
    const ctx = footerRef.current;

    /* ── Staggered reveal for all doormat cells ── */
    const reveals = ctx.querySelectorAll('.ft-reveal');
    if (reveals.length) {
      gsap.fromTo(
        reveals,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctx,
            start: 'top 88%',
          },
        }
      );
    }

    /* ── Kinetic Typography: scroll-scrubbed parallax + opacity ── */
    if (studioNameRef.current && studioTextRef.current) {
      // Opacity reveal tied to scroll position
      gsap.fromTo(
        studioNameRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: studioNameRef.current,
            start: 'top bottom',
            end: 'bottom 75%',
            scrub: 1,
          },
        }
      );

      // Horizontal parallax drift on the inner text
      gsap.fromTo(
        studioTextRef.current,
        { xPercent: 5 },
        {
          xPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: studioNameRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );
    }

    /* ── Horizontal line draw animation ── */
    const lines = ctx.querySelectorAll('.ft-line');
    lines.forEach((line) => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 95%',
          },
        }
      );
    });
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      id="contact"
      style={{ background: 'var(--background, #030303)' }}
      className="w-full relative overflow-hidden"
    >
      {/* ═══════════ CONSENT BANNER ═══════════ */}
      <div className="ft-reveal border-b" style={{ borderColor: 'var(--border, #222)' }}>
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-10 md:py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <FileText className="w-4 h-4" style={{ color: 'var(--foreground-muted, #666)' }} />
              <span
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em]"
                style={{ color: 'var(--foreground-muted, #666)', fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}
              >
                Documentación Legal
              </span>
            </div>
            <h3
              className="text-xl sm:text-2xl mb-2"
              style={{ color: 'var(--foreground, #F5F5F5)', fontFamily: "var(--font-display, 'Playfair Display', serif)", fontWeight: 600 }}
            >
              Completa tu consentimiento antes de la cita
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--foreground-secondary, #A3A3A3)', fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}
            >
              Formulario digital obligatorio. Para menores, se requiere presencia del tutor legal.
            </p>
          </div>
          <div className="flex gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/consent"
              className="group/cta flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300"
              style={{
                background: 'var(--accent, #DC2626)',
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover, #EF4444)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent, #DC2626)')}
            >
              Consentimiento
              <ArrowUpRight className="w-4 h-4 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform duration-200" />
            </Link>
            <a
              href="#policies"
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-7 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300"
              style={{
                border: '1px solid var(--border, #222)',
                color: 'var(--foreground-secondary, #A3A3A3)',
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong, #2A2A2A)';
                e.currentTarget.style.color = 'var(--foreground, #F5F5F5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border, #222)';
                e.currentTarget.style.color = 'var(--foreground-secondary, #A3A3A3)';
              }}
            >
              Políticas
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════ DOORMAT 3-COLUMN GRID ═══════════ */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">

          {/* ─── COLUMN 1: Navigation ─── */}
          <div className="ft-reveal">
            <h4
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] mb-8"
              style={{ color: 'var(--foreground-muted, #666)', fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}
            >
              Navegación
            </h4>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group inline-flex items-center gap-3 text-sm py-1.5"
                  style={ftLinkStyle}
                  onMouseEnter={handleLinkEnter}
                  onMouseLeave={handleLinkLeave}
                >
                  <span
                    className="w-0 group-hover:w-3 h-px transition-all duration-500 ease-out"
                    style={{ background: 'var(--accent, #DC2626)' }}
                  />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ─── COLUMN 2: Social & Contact ─── */}
          <div className="ft-reveal">
            <h4
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] mb-8"
              style={{ color: 'var(--foreground-muted, #666)', fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}
            >
              Contacto
            </h4>

            {/* Social */}
            <div className="flex gap-3 mb-8">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    border: '1px solid var(--border, #222)',
                    color: 'var(--foreground-secondary, #A3A3A3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent, #DC2626)';
                    e.currentTarget.style.color = 'var(--accent, #DC2626)';
                    e.currentTarget.style.background = 'rgba(220, 38, 38, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border, #222)';
                    e.currentTarget.style.color = 'var(--foreground-secondary, #A3A3A3)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-4">
              <a
                href="tel:7862095950"
                className="inline-flex items-center gap-3 text-sm py-1"
                style={ftLinkStyle}
                onMouseEnter={handleLinkEnter}
                onMouseLeave={handleLinkLeave}
              >
                <Phone className="w-4 h-4 shrink-0" style={{ color: 'var(--foreground-muted, #666)' }} />
                (786) 209-5950
              </a>
              <a
                href="mailto:reinierrielodiaz@gmail.com"
                className="inline-flex items-center gap-3 text-sm py-1"
                style={ftLinkStyle}
                onMouseEnter={handleLinkEnter}
                onMouseLeave={handleLinkLeave}
              >
                <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--foreground-muted, #666)' }} />
                reinierrielodiaz@gmail.com
              </a>
              <div
                className="inline-flex items-start gap-3 text-sm"
                style={{
                  color: 'var(--foreground-secondary, #A3A3A3)',
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                }}
              >
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--foreground-muted, #666)' }} />
                <address className="not-italic leading-relaxed">
                  1756 SW 8th St #201<br/>
                  Miami, FL 33135
                </address>
              </div>
            </div>
          </div>

          {/* ─── COLUMN 3: Call to Action ─── */}
          <div className="ft-reveal flex flex-col">
            <h4
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] mb-8"
              style={{ color: 'var(--foreground-muted, #666)', fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}
            >
              Reservar Sesión
            </h4>

            <p
              className="text-sm leading-relaxed mb-6"
              style={{
                color: 'var(--foreground-secondary, #A3A3A3)',
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              }}
            >
              Artistas especializados en realismo, fine&nbsp;line y diseño a medida. 
              Walk-ins bienvenidos según disponibilidad.
            </p>

            <div className="flex items-center gap-3 mb-8"
              style={{
                color: 'var(--foreground-muted, #666)',
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              }}
            >
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.08em]">Lun — Sáb · 11:00 AM — 8:00 PM</span>
            </div>

            <Link
              to="/booking"
              className="group/book mt-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-lg text-white text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300"
              style={{
                background: 'var(--accent, #DC2626)',
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover, #EF4444)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent, #DC2626)')}
            >
              Book Now
              <ArrowUpRight className="w-4 h-4 group-hover/book:translate-x-0.5 group-hover/book:-translate-y-0.5 transition-transform duration-200" />
            </Link>

            <a
              href="https://maps.google.com/?q=1756+SW+8th+St+201+Miami+FL+33135"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] mt-4"
              style={{
                ...ftLinkStyle,
                color: 'var(--foreground-muted, #666)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent, #DC2626)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--foreground-muted, #666)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MapPin className="w-3.5 h-3.5" />
              Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════ HORIZONTAL RULE ═══════════ */}
      <div
        className="ft-line origin-left"
        style={{ height: '1px', background: 'var(--border, #222)' }}
      />

      {/* ═══════════ MASSIVE STUDIO NAME (100vw fill) ═══════════ */}
      <div
        ref={studioNameRef}
        className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden select-none py-8 md:py-10"
        aria-hidden="true"
      >
        <div
          ref={studioTextRef}
          className="whitespace-nowrap text-center leading-[0.85] font-bold uppercase"
          style={{
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            fontSize: 'clamp(4rem, 14vw, 16rem)',
            color: 'var(--foreground, #F5F5F5)',
            opacity: 0.06,
            letterSpacing: '-0.03em',
          }}
        >
          MR STUDIO TATTOO
        </div>
      </div>

      {/* ═══════════ HORIZONTAL RULE ═══════════ */}
      <div
        className="ft-line origin-right"
        style={{ height: '1px', background: 'var(--border, #222)' }}
      />

      {/* ═══════════ LEGAL BOTTOM BAR ═══════════ */}
      <div className="ft-reveal max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p
          className="text-[0.6875rem] uppercase tracking-[0.1em] text-center sm:text-left"
          style={{
            color: 'var(--foreground-ghost, #404040)',
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          }}
        >
          &copy; {new Date().getFullYear()} Mr Studio Tattoo. All Rights Reserved.
        </p>
        <div
          className="flex gap-6 text-[0.6875rem] uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}
        >
          {[
            { label: 'Consentimiento', to: '/consent' },
            { label: 'Políticas', href: '#policies' },
            { label: 'Terms', href: '#terms' },
          ].map((item) =>
            'to' in item ? (
              <Link
                key={item.label}
                to={item.to!}
                style={{
                  color: 'var(--foreground-ghost, #404040)',
                  transition: 'color 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent, #DC2626)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--foreground-ghost, #404040)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: 'var(--foreground-ghost, #404040)',
                  transition: 'color 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent, #DC2626)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--foreground-ghost, #404040)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {item.label}
              </a>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
