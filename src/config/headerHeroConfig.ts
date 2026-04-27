export interface HeaderHeroCard {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
}

export interface HeaderHeroFonts {
  headingClass: string;
  bodyClass: string;
  eyebrowClass: string;
  buttonClass: string;
  cardTitleClass: string;
  cardBodyClass: string;
  cardEyebrowClass: string;
}

export interface HeaderHeroVisualFraming {
  layoutSplit: string;
  pinDistanceVh: number;
  scrub: number;
  roseRevealStart: number;
  roseRevealEnd: number;
  roseMaxOpacity: number;
  machineFeatherStrength: number;
  visualScale: number;
  visualOffsetX: number;
  bgScale: number;
  bgOffsetX: number;
  cardsRevealStart: number;
  cardsRevealEnd: number;
}

export interface HeaderHeroConfig {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  logoSrc: string;
  frameCount: number;
  framePathPattern: string;
  bgFrameCount: number;
  bgFramePathPattern: string;
  cards: HeaderHeroCard[];
  fonts: HeaderHeroFonts;
  visualFraming: HeaderHeroVisualFraming;
}

export const headerHeroConfig: HeaderHeroConfig = {
  eyebrow: "MR STUDIO TATO",
  title: "Precision in Motion",
  ctaLabel: "Book Your Session",
  ctaHref: "/booking",
  logoSrc: "/assets/logo.png",
  frameCount: 150,
  framePathPattern: "/assets/hero-sequence-v2/frame_{index}.webp",
  bgFrameCount: 150,
  bgFramePathPattern: "/assets/rose-sequence-v1/frame_{index}.webp",
  cards: [
    {
      id: "concept",
      eyebrow: "Concepto",
      title: "Diseño Con Intención",
      body: "Cada pieza nace con dirección visual clara para que la narrativa avance junto al scroll.",
      ctaLabel: "Ver Proceso",
      ctaHref: "#process",
    },
    {
      id: "craft",
      eyebrow: "Técnica",
      title: "Precisión de Línea",
      body: "El detalle fino y la composición anatómica se trabajan para que el resultado luzca limpio y atemporal.",
      ctaLabel: "Explorar Portafolio",
      ctaHref: "#portfolio",
    },
    {
      id: "book",
      eyebrow: "Reserva",
      title: "Agenda Tu Sesión",
      body: "Definimos idea, tamaño y estilo en una consulta guiada para aterrizar una pieza única.",
      ctaLabel: "Reservar Ahora",
      ctaHref: "/booking",
    },
  ],
  fonts: {
    headingClass: "font-serif",
    bodyClass: "font-sans",
    eyebrowClass: "font-sans",
    buttonClass: "font-sans",
    cardTitleClass: "font-serif",
    cardBodyClass: "font-sans",
    cardEyebrowClass: "font-sans",
  },
  visualFraming: {
    layoutSplit: "60/40",
    pinDistanceVh: 320,
    scrub: 1,
    roseRevealStart: 0,
    roseRevealEnd: 0.35,
    roseMaxOpacity: 0.92,
    machineFeatherStrength: 0.08,
    visualScale: 0.89,
    visualOffsetX: 0.02,
    bgScale: 0.9,
    bgOffsetX: -0.08,
    cardsRevealStart: 0.18,
    cardsRevealEnd: 1,
  },
};
