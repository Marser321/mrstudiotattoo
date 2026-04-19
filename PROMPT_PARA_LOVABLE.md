# INTEGRACIÓN: Scrollytelling Hero con Scroll Lateral de Tarjetas

## OBJETIVO

Integrar un hero scrollytelling interactivo (Canvas + GSAP ScrollTrigger) que reemplace el hero actual. Este hero ocupa pantalla completa, divide la vista en 60/40 (video animado / tarjetas horizontales), y usa scroll vertical para avanzar una animación de frames + desplazar tarjetas de servicios horizontalmente. **NO toques las secciones que ya existen después del hero** (Philosophy, Portfolio, Artists, Testimonials, Footer, Navbar). Solo reemplaza el hero y agrega transiciones suaves entre secciones.

El repositorio fuente está en: `https://github.com/Marser321/mrtato` — úsalo para descargar los assets binarios (frames WebP e imágenes PNG) que no se pueden incluir en este prompt.

---

## PASO 1: Instalar dependencias

Asegúrate de que `gsap` y `@gsap/react` estén instalados:

```bash
npm install gsap @gsap/react
```

---

## PASO 2: Descargar assets binarios del repositorio

Desde `https://github.com/Marser321/mrtato`, descarga y coloca en `public/`:

```
public/assets/hero-sequence-v2/frame_0001.webp ... frame_0150.webp  (150 frames de la máquina)
public/assets/rose-sequence-v1/frame_0001.webp ... frame_0150.webp  (150 frames de la rosa)
public/assets/card-sketches/fineline.png
public/assets/card-sketches/realismo.png
public/assets/card-sketches/geometrico.png
public/assets/card-sketches/custom.png
public/assets/card-sketches/coverups.png
```

---

## PASO 3: Crear `public/embed/mr-tato-hero-scrolly.css`

Copia este archivo EXACTAMENTE tal cual (464 líneas). Es el sistema de estilos completo del scrollytelling — glassmorphism, layout split, tarjetas, responsividad:

```css
.msth-host {
  --msth-bg: #000000;
  --msth-fg: #ffffff;
  --msth-accent: #dc2626;
  --msth-muted: rgba(255, 255, 255, 0.72);
  --msth-glass: rgba(255, 255, 255, 0.05);
  --msth-pin-distance: 320vh;
  --msth-left-col: 60%;
  --msth-right-col: 40%;
  --msth-cards-progress: 0;
  position: relative;
  width: 100%;
  height: var(--msth-pin-distance);
  min-height: 100vh;
  color: var(--msth-fg);
  background: var(--msth-bg);
  overflow: clip;
  isolation: isolate;
}

.msth-stage {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--msth-bg);
}

.msth-shell {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, var(--msth-left-col)) minmax(0, var(--msth-right-col));
}

.msth-visual-pane {
  position: relative;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(circle at 30% 45%, rgba(255, 255, 255, 0.08), transparent 42%), #000;
}

.msth-cards-pane {
  position: relative;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: #050505;
  box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.07);
  isolation: isolate;
}

.msth-cards-viewport {
  position: relative;
  z-index: 4;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: clamp(1.2rem, 2vw, 2rem);
  box-sizing: border-box;
}

.msth-cards-track {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 1.1rem;
  height: 100%;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

.msth-card {
  flex: 0 0 min(85%, 32rem);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 8, 8, 0.42);
  border-radius: 12px;
  backdrop-filter: blur(18px) saturate(140%);
  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.45);
  transition: transform 300ms ease, border-color 300ms ease;
  overflow: hidden;
}

.msth-card-image {
  width: 100%;
  height: 55%;
  min-height: 200px;
  overflow: hidden;
  position: relative;
}

.msth-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  transition: opacity 400ms ease, transform 600ms ease;
}

.msth-card:hover .msth-card-image img {
  opacity: 0.9;
  transform: scale(1.03);
}

.msth-card-content {
  padding: clamp(1rem, 2vw, 1.6rem);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.msth-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.12);
}

.msth-card.-highlighted { position: relative; }
.msth-card.-highlighted::after {
  content: "";
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 2px;
  background: linear-gradient(90deg, var(--msth-accent), transparent);
}

.msth-card-icon { color: var(--msth-accent); font-size: 1.6rem; line-height: 1; }

.msth-card-eyebrow {
  margin: 0;
  font: 600 0.61rem/1 "Inter", "Helvetica Neue", Arial, sans-serif;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.66);
}

.msth-card-title {
  margin: 0;
  font-family: "Playfair Display", "Times New Roman", serif;
  font-weight: 500;
  font-size: clamp(1.45rem, 2.2vw, 1.8rem);
  line-height: 1.1;
  color: #fff;
}

.msth-card.-highlighted .msth-card-title { color: var(--msth-accent); }

.msth-card-body {
  margin: 0;
  font: 400 0.85rem/1.6 "Inter", "Helvetica Neue", Arial, sans-serif;
  color: #888;
}

.msth-card-cta-container {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 1rem;
}

.msth-card-cta {
  color: var(--msth-accent);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font: 600 0.65rem/1 "Inter", "Helvetica Neue", Arial, sans-serif;
  transition: color 250ms ease;
  background: transparent;
  border: none;
  padding: 0;
}

.msth-card-cta:hover { color: #fff; background: transparent; border: none; }
.msth-card-cta.-second { color: rgba(255, 255, 255, 0.5); }
.msth-card-cta.-second:hover { color: #fff; }

.msth-logo {
  display: none;
  position: absolute;
  right: clamp(1rem, 2vw, 1.6rem);
  top: clamp(1rem, 2vw, 1.6rem);
  width: min(5.5rem, 12vw);
  opacity: 0.8;
  z-index: 5;
  filter: drop-shadow(0 8px 22px rgba(0, 0, 0, 0.32));
}
.msth-logo.-visible { display: block; }

.msth-canvas, .msth-machine-canvas, .msth-static-bg, .msth-static-machine {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
.msth-canvas { z-index: 0; display: block; }
.msth-machine-canvas {
  z-index: 1; display: block; pointer-events: none;
  opacity: 0.30;
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 90%);
  mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 90%);
  mix-blend-mode: lighten;
}

.msth-static-bg, .msth-static-machine {
  object-fit: cover; opacity: 0; pointer-events: none;
  transform-origin: 50% 50%; will-change: transform, opacity;
  transition: opacity 240ms ease;
}
.msth-static-bg {
  z-index: 0;
  transform: translate3d(0, var(--msth-static-bg-y, 0px), 0) scale(var(--msth-static-bg-scale, 1));
}
.msth-static-machine {
  z-index: 1;
  transform: translate3d(0, var(--msth-static-machine-y, 0px), 0) scale(var(--msth-static-machine-scale, 1));
  filter: none;
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 90%);
  mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 90%);
  mix-blend-mode: lighten;
}

.msth-static-mode .msth-canvas { opacity: 0; }
.msth-static-mode .msth-static-machine { opacity: 0.30; }

.msth-grain {
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  opacity: 0.17; mix-blend-mode: soft-light;
  background-image:
    radial-gradient(circle at 12% 24%, rgba(255,255,255,0.12) 0 1px, transparent 1px),
    radial-gradient(circle at 78% 64%, rgba(255,255,255,0.09) 0 1px, transparent 1px),
    radial-gradient(circle at 42% 84%, rgba(255,255,255,0.08) 0 1px, transparent 1px);
  background-size: 3px 3px, 4px 4px, 5px 5px;
}

.msth-bg-layer { position: absolute; inset: 0; pointer-events: none; z-index: 3; }
.msth-bg-layer.-left { background: linear-gradient(90deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.58) 100%); }
.msth-bg-layer.-bottom { background: linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 42%, rgba(0,0,0,0.76) 100%); }

.msth-copy {
  position: absolute;
  left: clamp(1rem, 2.2vw, 2rem);
  bottom: clamp(1.1rem, 2.4vw, 2.3rem);
  z-index: 4;
  max-width: min(26rem, 80%);
}

.msth-kicker {
  margin: 0 0 0.55rem;
  font: 600 0.58rem/1 "Inter", "Helvetica Neue", Arial, sans-serif;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.msth-title {
  margin: 0 0 0.9rem;
  font-family: "Playfair Display", "Times New Roman", serif;
  font-weight: 500; line-height: 0.95;
  font-size: clamp(1.75rem, 4.3vw, 3.5rem);
  text-wrap: balance;
}

.msth-cta {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.68);
  color: #fff; background: rgba(255, 255, 255, 0.06);
  text-decoration: none; text-transform: uppercase;
  letter-spacing: 0.21em;
  font: 600 0.64rem/1 "Inter", "Helvetica Neue", Arial, sans-serif;
  transition: background-color 220ms ease, color 220ms ease, border-color 220ms ease, transform 220ms ease;
}
.msth-cta:hover { background: #fff; color: #000; border-color: #fff; transform: translateY(-1px); }

.msth-scroll-indicator {
  position: absolute; left: 50%; bottom: 0.95rem;
  width: 1px; height: 4.1rem;
  background: linear-gradient(180deg, rgba(220, 38, 38, 0.9) 0%, rgba(220, 38, 38, 0) 100%);
  transform: translateX(-50%); opacity: 0.52; z-index: 8;
  animation: msthPulse 1.75s ease-in-out infinite;
}

.msth-progress { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: rgba(255,255,255,0.1); z-index: 9; }
.msth-progress-fill { height: 100%; width: 0; background: rgba(255,255,255,0.78); transition: width 170ms linear; }

.msth-host.msth-error .msth-visual-pane {
  background: radial-gradient(circle at 30% 20%, rgba(220,38,38,0.24), transparent 45%),
    radial-gradient(circle at 80% 60%, rgba(255,255,255,0.08), transparent 50%), #000;
}

@media (max-width: 1024px) { .msth-card { flex-basis: min(82%, 20rem); } }

@media (max-width: 767px) {
  .msth-host { height: auto; min-height: 100vh; }
  .msth-stage { height: auto; }
  .msth-shell { display: block; }
  .msth-visual-pane { height: 62vh; border-right: 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .msth-cards-pane { height: auto; min-height: 38vh; overflow: visible; }
  .msth-cards-viewport { overflow: visible; padding: 1rem; }
  .msth-cards-track { flex-direction: column; gap: 0.85rem; transform: translate3d(0,0,0) !important; }
  .msth-card { flex: 1 1 auto; min-height: 0; }
  .msth-copy { max-width: 88%; left: 0.9rem; bottom: 1rem; }
  .msth-title { font-size: clamp(1.35rem, 8.7vw, 2.05rem); }
  .msth-cta { font-size: 0.58rem; padding: 0.65rem 1rem; }
  .msth-scroll-indicator { display: none; }
}

@keyframes msthPulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.75; } }
```

---

## PASO 4: Crear `public/embed/mr-tato-hero-scrolly.js`

Este es el motor de animación completo (835 líneas). Cópialo EXACTAMENTE del repositorio GitHub: `https://github.com/Marser321/mrtato/blob/main/public/embed/mr-tato-hero-scrolly.js`

El archivo es demasiado largo para incluirlo inline aquí (28KB), pero es vanilla JS puro y se autoregistra como `window.initMrTatoHeroScrolly`. Se debe copiar byte por byte del repo.

---

## PASO 5: Crear componente `src/components/sections/HeroScrollyEmbed.tsx`

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HeroScrollyEmbed() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (typeof window !== "undefined") {
      (window as any).gsap = gsap;
      (window as any).ScrollTrigger = ScrollTrigger;
    }

    if (!document.querySelector('link[href="/embed/mr-tato-hero-scrolly.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/embed/mr-tato-hero-scrolly.css";
      document.head.appendChild(link);
    }

    const initScrolly = () => {
      if ((window as any).initMrTatoHeroScrolly) {
        (window as any).initMrTatoHeroScrolly({
          rootSelector: "#mr-tato-hero-scrolly",
          layoutSplit: "60/40",
          cardFlow: "horizontal-track",
          frameCount: 150,
          framePathPattern: "/assets/hero-sequence-v2/frame_{index}.webp",
          bgFrameCount: 150,
          bgFramePathPattern: "/assets/rose-sequence-v1/frame_{index}.webp",
          pinDistanceVh: 520,
          scrub: 1,
          roseRevealStart: 0.0,
          roseRevealEnd: 0.35,
          roseMaxOpacity: 0.92,
          machineFeatherStrength: 0.12,
          cardsRevealStart: 0.18,
          cardsRevealEnd: 1.0,
          visualScale: 0.45,
          visualOffsetX: 0.30,
          bgScale: 0.9,
          bgOffsetX: -0.08,
          title: "Precision in Motion",
          ctaLabel: "Book Your Session",
          ctaHref: "#contact",
          cards: [
            {
              id: "fineline",
              icon: "✦",
              title: "Fine Line",
              body: "Diseños delicados con líneas precisas. Cada trazo es calculado, cada detalle es intencional. Perfecto para minimalistas.",
              ctaLabel: "DESDE $100",
              ctaHref: "#",
              imageSrc: "/assets/card-sketches/fineline.png",
            },
            {
              id: "realismo",
              icon: "◎",
              title: "Realismo",
              body: "Retratos hiper-realistas en blanco y negro que capturan la esencia de tus momentos y personas más queridas.",
              ctaLabel: "DESDE $300",
              ctaHref: "#",
              imageSrc: "/assets/card-sketches/realismo.png",
            },
            {
              id: "geometrico",
              icon: "⬡",
              title: "Geométrico",
              body: "Patrones geométricos y mandalas de precisión matemática. Líneas perfectas que crean armonía visual.",
              ctaLabel: "DESDE $150",
              ctaHref: "#",
              imageSrc: "/assets/card-sketches/geometrico.png",
            },
            {
              id: "custom",
              icon: "◈",
              title: "Custom Artwork",
              body: "Diseños personalizados únicos creados en colaboración directa contigo. Tu visión, nuestra maestría.",
              ctaLabel: "CONSULTAR",
              ctaHref: "#",
              imageSrc: "/assets/card-sketches/custom.png",
            },
            {
              id: "coverups",
              icon: "⟐",
              title: "Cover-Ups",
              body: "Transformamos tatuajes existentes en obras maestras nuevas. Maestría en rediseño y cobertura.",
              ctaLabel: "CONSULTAR",
              ctaHref: "#",
              imageSrc: "/assets/card-sketches/coverups.png",
            }
          ],
        });
      }
    };

    if (!document.querySelector('script[src="/embed/mr-tato-hero-scrolly.js"]')) {
      const script = document.createElement("script");
      script.src = "/embed/mr-tato-hero-scrolly.js";
      script.async = true;
      script.onload = initScrolly;
      document.body.appendChild(script);
    } else {
      initScrolly();
    }
  }, []);

  return <section id="mr-tato-hero-scrolly"></section>;
}
```

---

## PASO 6: Crear componente `src/components/ui/SectionTransition.tsx`

```tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  variant?: 'fade' | 'line' | 'gradient';
  height?: string;
  accent?: boolean;
}

export function SectionTransition({ variant = 'fade', height = '20vh', accent = false }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { opacity: 0 }, {
      opacity: 1, duration: 1, ease: 'power2.inOut',
      scrollTrigger: { trigger: ref.current, start: 'top 90%', end: 'bottom 60%', scrub: true }
    });
    if (lineRef.current) {
      gsap.fromTo(lineRef.current, { scaleX: 0 }, {
        scaleX: 1, ease: 'power3.inOut',
        scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 50%', scrub: true }
      });
    }
  }, { scope: ref });

  if (variant === 'line') {
    return (
      <div ref={ref} className="relative w-full flex items-center justify-center" style={{ height }} aria-hidden="true">
        <div className="w-full max-w-6xl mx-auto px-8">
          <div ref={lineRef} className="w-full h-[1px] origin-left" style={{ background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', opacity: 0.3 }} />
        </div>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div ref={ref} className="relative w-full pointer-events-none" style={{ height }} aria-hidden="true">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
        {accent && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-8">
            <div ref={lineRef} className="w-full h-[1px] origin-center" style={{ background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', opacity: 0.2 }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative w-full pointer-events-none" style={{ height }} aria-hidden="true">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(220,38,38,0.03) 0%, transparent 70%)' }} />
      {accent && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-primary/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
          <div className="w-[1px] h-8 bg-gradient-to-t from-transparent to-primary/20" />
        </div>
      )}
    </div>
  );
}
```

---

## PASO 7: Actualizar App.tsx (estructura del layout)

Reemplaza el hero actual por `HeroScrollyEmbed` y agrega `SectionTransition` entre secciones. **NO modifiques las secciones existentes**, solo cambia el layout wrapper:

```tsx
import { HeroScrollyEmbed } from './components/sections/HeroScrollyEmbed'
import { SectionTransition } from './components/ui/SectionTransition'
// ... mantén todos los imports existentes de las demás secciones ...

// En el layout principal:
<main>
  <HeroScrollyEmbed />
  <SectionTransition variant="gradient" height="16vh" accent />
  <Philosophy />      {/* EXISTENTE — NO TOCAR */}
  <SectionTransition variant="line" height="12vh" />
  <Portfolio />       {/* EXISTENTE — NO TOCAR */}
  <SectionTransition variant="fade" height="14vh" accent />
  <Artists />         {/* EXISTENTE — NO TOCAR */}
  <SectionTransition variant="line" height="12vh" />
  <Testimonials />    {/* EXISTENTE — NO TOCAR */}
</main>
```

**Si existe una sección `Services`, elimínala** — las tarjetas del scrollytelling ya cubren esa información.

---

## REGLAS CRÍTICAS

1. **NO toques Philosophy, Portfolio, Artists, Testimonials, Footer, Navbar** — están más trabajadas y deben permanecer intactas.
2. El `--msth-accent: #dc2626` debe coincidir con el `--primary` del design system existente.
3. El hero se fija (pin) durante **520vh de scroll** antes de liberar al usuario.
4. Las tarjetas se desplazan horizontalmente sincronizadas con el scroll vertical.
5. La máquina de tatuar se renderiza a un tamaño proporcional de pantalla (0.45x ancho del stage) como **fondo animado** abarcando todo el stage, pero limitando su visibilidad solo a la sección derecha de las tarjetas usando un mix-blend-mode screen al 65% y máscara radial gigante. Las tarjetas son súper translúcidas (15% bg opacity + blur 24px) con efecto glassmorphism intenso de "cristal" para apreciar dicho fondo.
6. En mobile (≤767px), el layout pasa automáticamente a vertical con tarjetas apiladas.
7. Los typos del hero usan "Playfair Display" para títulos y "Inter" para body — asegúrate de que ambas fuentes estén disponibles.
