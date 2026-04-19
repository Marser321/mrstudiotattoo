import { type HeaderHeroConfig, headerHeroConfig } from "./headerHeroConfig";

export const headerHeroConfigV2: HeaderHeroConfig = {
  ...headerHeroConfig,
  frameCount: 600,
  framePathPattern: "/assets/hero-sequence-v4/frame_{index}.webp",
  bgFrameCount: 0, 
  bgFramePathPattern: "",
  title: "Precision in Motion",
  ctaLabel: "Book Your Session",
  ctaHref: "#contact",
  cards: [
    {
      id: "fineline",
      eyebrow: "✦ Fine Line",
      title: "Líneas Precisas",
      body: "Diseños delicados con líneas calculadas. Cada trazo es intencional, perfecto para minimalistas.",
      ctaLabel: "DESDE $100",
      ctaHref: "#",
    },
    {
      id: "realismo",
      eyebrow: "◎ Realismo",
      title: "Esencia Viva",
      body: "Retratos hiper-realistas en blanco y negro que capturan la esencia de tus momentos más queridos.",
      ctaLabel: "DESDE $300",
      ctaHref: "#",
    },
    {
      id: "geometrico",
      eyebrow: "⬡ Geométrico",
      title: "Armonía Pura",
      body: "Patrones geométricos y mandalas de precisión matemática que crean armonía visual única.",
      ctaLabel: "DESDE $150",
      ctaHref: "#",
    },
    {
      id: "custom",
      eyebrow: "◈ Custom",
      title: "Obra Única",
      body: "Diseños personalizados únicos creados en colaboración directa contigo. Tu visión, nuestra maestría.",
      ctaLabel: "CONSULTAR",
      ctaHref: "#",
    },
    {
      id: "coverups",
      eyebrow: "⟐ Cover-Ups",
      title: "Transformación",
      body: "Transformamos tatuajes existentes en obras maestras nuevas. Maestría en rediseño y cobertura.",
      ctaLabel: "CONSULTAR",
      ctaHref: "#",
    },
  ],
  visualFraming: {
    ...headerHeroConfig.visualFraming,
    layoutSplit: "75/25",
    pinDistanceVh: 520,
    scrub: 1,
    machineFeatherStrength: 0,
    visualScale: 0.9, // Reduced zoom to preserve vertical information (9:16)
    visualOffsetX: 0.0, // Centered
  },
};
