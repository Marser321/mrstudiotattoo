# Hero Sequence Header - Lovable Integration Guide

This project now includes a Lovable-ready header section:

- `src/components/sections/HeroSequenceHeader.tsx`
- `src/config/headerHeroConfig.ts`

The component is mounted in `src/App.tsx` and is driven by a single config object so logo, typography classes, cards, and framing can be edited without touching the animation logic.

## 1) Brand config source of truth

Edit:

```ts
src/config/headerHeroConfig.ts
```

This file controls:

- `logoSrc`
- `eyebrow`
- `title`
- `ctaLabel`
- `ctaHref`
- `cards`
- `fonts`
- `visualFraming`

## 2) Current integration shape

```tsx
import { HeroSequenceHeader } from "@/components/sections/HeroSequenceHeader";
import { headerHeroConfig } from "@/config/headerHeroConfig";

export function App() {
  return <HeroSequenceHeader config={headerHeroConfig} />;
}
```

## 3) Assets expected by the component

- `/assets/logo.svg`
- `/assets/hero-sequence-v2/frame_{index}.webp`
- `/assets/rose-sequence-v1/frame_{index}.webp`

## 4) Typography mapping

The component does not hardcode brand font names. It expects class/tokens from the host project:

- `headingClass`
- `bodyClass`
- `eyebrowClass`
- `buttonClass`
- `cardTitleClass`
- `cardBodyClass`
- `cardEyebrowClass`

This makes the section easier to reuse inside Lovable projects with different design systems.

## 5) Visual framing controls

`visualFraming` centralizes the approved composition values:

- `layoutSplit`
- `pinDistanceVh`
- `scrub`
- `roseRevealStart`
- `roseRevealEnd`
- `roseMaxOpacity`
- `machineFeatherStrength`
- `visualScale`
- `visualOffsetX`
- `bgScale`
- `bgOffsetX`
- `cardsRevealStart`
- `cardsRevealEnd`

## 6) Validation checklist

- `pnpm build`
- Desktop: pinned 60/40 layout + horizontal cards + synchronized scrub
- Mobile: static/parallax fallback + stacked cards
- Reduced motion: static fallback without scrub
- Editorial test: edit logo, one font class, and one card in `headerHeroConfig.ts`
