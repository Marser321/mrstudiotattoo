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
          visualScale: 0.17,
          visualOffsetX: 0.1,
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
