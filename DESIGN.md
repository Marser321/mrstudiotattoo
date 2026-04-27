---
# ═══════════════════════════════════════════════════════════════════════════════
# DESIGN.md — Mr Studio Tattoo Visual Identity System
# Standard: Google Labs Design Token Specification v1.0
# Framework: Vite + React 19 · Tailwind CSS v4 · shadcn/ui v4 (base-nova)
# ═══════════════════════════════════════════════════════════════════════════════

schema_version: "1.0"
project: "mr-studio-tattoo"
last_updated: "2026-04-27"

# ─────────────────────────────────────────────────────────────────────────────
# COLOR SYSTEM
# Philosophy: Absolute darkness as canvas. Red as surgical punctuation.
# ─────────────────────────────────────────────────────────────────────────────
colors:

  # === BACKGROUNDS (The Void) ===
  background:
    base:          { value: "#030303", css_var: "--background",           note: "Primary canvas. Near-absolute black." }
    elevated:      { value: "#0A0A0A", css_var: "--background-elevated",  note: "Cards, modals, floating surfaces." }
    subtle:        { value: "#111111", css_var: "--background-subtle",    note: "Sidebar, nav, secondary panels." }

  # === SURFACES (The Architecture) ===
  surface:
    primary:       { value: "#141414", css_var: "--surface-primary",      note: "Card backgrounds, content containers." }
    secondary:     { value: "#1A1A1A", css_var: "--surface-secondary",    note: "Nested containers, input fields." }
    tertiary:      { value: "#1F1F1F", css_var: "--surface-tertiary",     note: "Hover states on surfaces." }

  # === BORDERS (The Structure) ===
  border:
    default:       { value: "#222222", css_var: "--border",               note: "Standard dividers. Barely visible." }
    strong:        { value: "#2A2A2A", css_var: "--border-strong",        note: "Active section separators." }
    subtle:        { value: "#1A1A1A", css_var: "--border-subtle",        note: "Ghost borders. Structural only." }

  # === FOREGROUND (The Voice) ===
  foreground:
    primary:       { value: "#F5F5F5", css_var: "--foreground",           note: "Headlines, primary text. Almost white." }
    secondary:     { value: "#A3A3A3", css_var: "--foreground-secondary", note: "Body text, descriptions." }
    muted:         { value: "#666666", css_var: "--foreground-muted",     note: "Captions, timestamps, metadata." }
    ghost:         { value: "#404040", css_var: "--foreground-ghost",     note: "Placeholder text, disabled states." }

  # === ACCENT — RED (The Blade) ===
  # ⚠️ CRITICAL: Red is EXCLUSIVELY for interaction & conversion elements.
  # It must never be used decoratively.
  accent:
    primary:       { value: "#DC2626", css_var: "--accent",               note: "CTA buttons, booking confirmations." }
    hover:         { value: "#EF4444", css_var: "--accent-hover",         note: "Hover state on accent elements." }
    active:        { value: "#B91C1C", css_var: "--accent-active",        note: "Pressed/active state." }
    muted:         { value: "rgba(220, 38, 38, 0.10)", css_var: "--accent-muted", note: "Subtle bg for selected calendar days." }
    ring:          { value: "rgba(220, 38, 38, 0.30)", css_var: "--accent-ring",  note: "Focus rings on interactive elements." }

  # === SEMANTIC STATES ===
  semantic:
    success:       { value: "#22C55E", css_var: "--success",  note: "Confirmed bookings, positive feedback." }
    warning:       { value: "#EAB308", css_var: "--warning",  note: "Pending states, caution notices." }
    error:         { value: "#DC2626", css_var: "--error",    note: "Mirrors accent. Validation errors." }
    info:          { value: "#6B7280", css_var: "--info",      note: "Neutral informational. Gray, not blue." }

# ─────────────────────────────────────────────────────────────────────────────
# LIGHT MODE — PARCHMENT & BLACKWORK
# Philosophy: Warm parchment as canvas. Carbon ink as voice. Red as blade.
# The light mode must feel like a luxury editorial spread or a tattoo flash
# sheet — NOT a generic white SaaS dashboard.
# ─────────────────────────────────────────────────────────────────────────────
colors_light:

  # === BACKGROUNDS (The Parchment) ===
  background:
    base:          { value: "#F9F9F8", css_var: "--background",           note: "Warm parchment. Never pure white." }
    elevated:      { value: "#F0EDE6", css_var: "--background-elevated",  note: "Cards, modals. Slightly darker cream." }
    subtle:        { value: "#E8E4DB", css_var: "--background-subtle",    note: "Sidebar, nav, secondary panels." }

  # === SURFACES (The Paper) ===
  surface:
    primary:       { value: "#EFECE5", css_var: "--surface-primary",      note: "Card backgrounds on parchment." }
    secondary:     { value: "#E8E4DB", css_var: "--surface-secondary",    note: "Nested containers, input fields." }
    tertiary:      { value: "#DDD9D0", css_var: "--surface-tertiary",     note: "Hover states on surfaces." }

  # === BORDERS (The Sketch Lines) ===
  border:
    default:       { value: "rgba(18, 18, 18, 0.10)", css_var: "--border",        note: "Subtle ink-wash dividers." }
    strong:        { value: "rgba(18, 18, 18, 0.18)", css_var: "--border-strong",  note: "Active section separators." }
    subtle:        { value: "rgba(18, 18, 18, 0.06)", css_var: "--border-subtle",  note: "Ghost borders. Structural only." }

  # === FOREGROUND (The Ink) ===
  foreground:
    primary:       { value: "#121212", css_var: "--foreground",           note: "Carbon ink. Deep black type." }
    secondary:     { value: "#4A4A4A", css_var: "--foreground-secondary", note: "Body text. Warm charcoal." }
    muted:         { value: "#8A8A8A", css_var: "--foreground-muted",     note: "Captions, metadata. Faded ink." }
    ghost:         { value: "#B0B0B0", css_var: "--foreground-ghost",     note: "Placeholder text, disabled states." }

  # === ACCENT — RED (Same Blade, New Canvas) ===
  accent:
    primary:       { value: "#DC2626", css_var: "--accent",               note: "CTA buttons. Unchanged." }
    hover:         { value: "#B91C1C", css_var: "--accent-hover",         note: "Darker on light bg for contrast." }
    active:        { value: "#991B1B", css_var: "--accent-active",        note: "Pressed state." }

  # === BLEND MODE RULES ===
  blend_modes:
    ink_background: { dark: "mix-blend-screen",   light: "mix-blend-multiply",  note: "SVGs and floating tattoos." }
    video_overlay:  { dark: "mix-blend-screen",   light: "mix-blend-multiply",  note: "Video/canvas backgrounds." }
    grain_texture:  { dark: "mix-blend-overlay",  light: "mix-blend-overlay",   note: "Film grain stays overlay in both." }

# ─────────────────────────────────────────────────────────────────────────────
# TYPOGRAPHY
# Philosophy: Editorial serif authority. Every word earns its place.
# ─────────────────────────────────────────────────────────────────────────────
typography:

  font_families:
    display:
      family: "'Playfair Display', Georgia, 'Times New Roman', serif"
      source: "Google Fonts"
      weights: [400, 500, 600, 700, 800, 900]
      usage: "Hero headlines, page titles, section headers. The voice of the brand."

    heading:
      family: "'DM Serif Display', Georgia, serif"
      source: "Google Fonts"
      weights: [400]
      usage: "Card titles, modal headers, navigation labels."

    body:
      family: "'DM Sans', 'Helvetica Neue', Arial, sans-serif"
      source: "Google Fonts"
      weights: [300, 400, 500, 600, 700]
      usage: "Body text, UI labels, form inputs. Clean sans-serif for readability at small sizes."

    mono:
      family: "'JetBrains Mono', 'Fira Code', monospace"
      source: "Google Fonts"
      weights: [400, 500]
      usage: "Prices, codes, timestamps, technical data."

  scale:
    # Mobile-first. Desktop values in parentheses.
    display-xl:  { size: "3rem (4.5rem)",   line_height: "1.05", tracking: "-0.03em", weight: 700 }
    display:     { size: "2.25rem (3.5rem)", line_height: "1.1",  tracking: "-0.025em", weight: 700 }
    h1:          { size: "1.875rem (2.5rem)", line_height: "1.15", tracking: "-0.02em", weight: 600 }
    h2:          { size: "1.5rem (2rem)",    line_height: "1.2",  tracking: "-0.015em", weight: 600 }
    h3:          { size: "1.25rem (1.5rem)", line_height: "1.3",  tracking: "-0.01em", weight: 500 }
    h4:          { size: "1.125rem (1.25rem)", line_height: "1.35", tracking: "0", weight: 500 }
    body-lg:     { size: "1.125rem",         line_height: "1.6",  tracking: "0", weight: 400 }
    body:        { size: "1rem",             line_height: "1.6",  tracking: "0", weight: 400 }
    body-sm:     { size: "0.875rem",         line_height: "1.5",  tracking: "0.005em", weight: 400 }
    caption:     { size: "0.75rem",          line_height: "1.4",  tracking: "0.02em", weight: 500 }
    overline:    { size: "0.6875rem",        line_height: "1.2",  tracking: "0.12em", weight: 600, transform: "uppercase" }

# ─────────────────────────────────────────────────────────────────────────────
# SPACING & LAYOUT
# ─────────────────────────────────────────────────────────────────────────────
spacing:
  unit: "0.25rem"
  scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64]
  section_padding: "clamp(4rem, 8vw, 8rem)"
  container_max_width: "1280px"
  content_max_width: "720px"

# ─────────────────────────────────────────────────────────────────────────────
# MOTION
# ─────────────────────────────────────────────────────────────────────────────
motion:
  duration:
    instant:    "100ms"
    fast:       "200ms"
    normal:     "300ms"
    slow:       "500ms"
    cinematic:  "800ms"
  easing:
    default:    "cubic-bezier(0.25, 0.1, 0.25, 1)"
    in:         "cubic-bezier(0.4, 0, 1, 1)"
    out:        "cubic-bezier(0, 0, 0.2, 1)"
    in_out:     "cubic-bezier(0.4, 0, 0.2, 1)"
    spring:     "cubic-bezier(0.34, 1.56, 0.64, 1)"

# ─────────────────────────────────────────────────────────────────────────────
# RADII & SHADOWS
# ─────────────────────────────────────────────────────────────────────────────
radii:
  none: "0"
  sm:   "0.375rem"
  md:   "0.5rem"
  lg:   "0.75rem"
  xl:   "1rem"
  full: "9999px"

shadows:
  sm:   "0 1px 2px rgba(0, 0, 0, 0.4)"
  md:   "0 4px 12px rgba(0, 0, 0, 0.5)"
  lg:   "0 8px 24px rgba(0, 0, 0, 0.6)"
  glow: "0 0 20px rgba(220, 38, 38, 0.15)"
  note: "Shadows are deep and diffuse. No sharp edges. The glow is reserved for focused accent elements ONLY."

---

# Mr. Tato Studio — Design System

> **Luxury. Raw. Minimal.**
> The ink speaks. The interface listens.

---

## 1. Design Philosophy

This system follows three non-negotiable principles:

| Principle | Mandate |
|---|---|
| **Absolute Restraint** | Every element must justify its existence. If it doesn't serve the user's task, it doesn't exist. |
| **High Contrast** | Content floats on void. `#F5F5F5` text on `#030303` backgrounds. No muddy middle-grounds. |
| **Red as Ritual** | The accent color is not decoration — it is a **call to action**. A blade, not paint. |

---

## 2. The Red Rule — Accent Usage Protocol

> [!CAUTION]
> **The vibrant red (`#DC2626`) is STRICTLY RESERVED for elements that trigger user action or confirm a conversion.** Violating this rule dilutes the brand's visual authority and reduces conversion rates.

### ✅ DO — Use Red For:

| Element | Example |
|---|---|
| **Primary CTA Buttons** | "Book Now", "Reserve Session", "Confirm Appointment" |
| **Calendar Selected State** | Active/selected day in the booking calendar |
| **Form Submit Actions** | Final confirmation buttons in multi-step flows |
| **Active Navigation** | Current page indicator (thin underline or dot, not full background) |
| **Focus Rings** | `--accent-ring` on focused interactive elements |
| **Destructive Actions** | Delete confirmations (shared with semantic error) |
| **Badge/Count Indicators** | Notification counts, unread markers |

### ❌ DON'T — Never Use Red For:

| Anti-Pattern | Why It's Wrong |
|---|---|
| **Headlines or body text** | Red text on dark backgrounds strains readability |
| **Decorative borders** | Borders are structural, not promotional |
| **Background fills on large areas** | Overwhelms the void. Destroys contrast hierarchy |
| **Icons in passive states** | Icons are informational, not interactive, unless clickable |
| **Gradients or glows (decorative)** | No neon. No glow effects unless it's a focused CTA |
| **Section dividers** | Dividers are invisible architecture, not billboards |
| **Loading spinners** | Use `--foreground-muted` gray instead |

---

## 3. Typography Rules

### ✅ DO:

- Use **Playfair Display** exclusively for hero headlines and major section titles
- Use **DM Serif Display** for card titles and secondary headings
- Use **DM Sans** for all body text, labels, and UI controls
- Apply tight negative tracking (`-0.02em` to `-0.03em`) on display sizes
- Use the `overline` style (uppercase, wide tracking) for category labels and metadata tags
- Maintain generous line-height (`1.5`–`1.6`) on body text for editorial readability

### ❌ DON'T:

- Never use serif fonts for button labels, input placeholders, or form helper text
- Never mix more than 2 font families in a single component
- Never use font weights below 400 for body text on dark backgrounds (thin text bleeds)
- Never use pure white `#FFFFFF` — always use `#F5F5F5` to reduce halation on OLED screens

---

## 4. shadcn/ui Component Overrides

All shadcn/ui components must be reskinned to honor the **high-contrast, negative-space** philosophy.

### 4.1 General Component Rules

```
┌─────────────────────────────────────────────────────────┐
│  COMPONENT OVERRIDE PRINCIPLES                          │
│                                                         │
│  1. Remove all default border-radius > 0.75rem (lg)     │
│  2. Replace all gray-100/200 backgrounds with           │
│     --surface-primary (#141414)                         │
│  3. Replace all gray-500 text with                      │
│     --foreground-secondary (#A3A3A3)                    │
│  4. Double default padding on all containers            │
│  5. Remove all colored backgrounds from variants        │
│     except destructive (which uses --accent)            │
│  6. All focus rings use --accent-ring, not blue         │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Specific Component Directives

#### `<Button />`

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| `default` (primary CTA) | `--accent` | `#FFFFFF` | none | `--accent-hover` |
| `secondary` | `--surface-secondary` | `--foreground` | `--border` | `--surface-tertiary` |
| `outline` | transparent | `--foreground-secondary` | `--border` | `--surface-primary` |
| `ghost` | transparent | `--foreground-secondary` | none | `--surface-primary` |
| `destructive` | `--accent` | `#FFFFFF` | none | `--accent-hover` |

> [!IMPORTANT]
> Only `default` and `destructive` variants use the red accent. All other variants are monochromatic.

#### `<Card />`

```css
/* Override: Maximum negative space, minimal borders */
.card {
  background: var(--surface-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);     /* 0.75rem max */
  padding: 2rem;                        /* Double default */
  box-shadow: none;                     /* No elevation by default */
}
.card:hover {
  border-color: var(--border);          /* Subtle reveal on hover */
  transition: border-color 300ms var(--ease-default);
}
```

#### `<Calendar />`

| State | Style |
|---|---|
| Default day | `--foreground-secondary` text, transparent bg |
| Hover | `--surface-tertiary` bg |
| **Selected day** | `--accent` bg, `#FFFFFF` text |
| Today (not selected) | `--border-strong` ring, no fill |
| Disabled/past | `--foreground-ghost` text |
| Range (if applicable) | `--accent-muted` bg between endpoints |

> [!TIP]
> The calendar is the ONE component where red appears as a background fill. This is intentional — it marks the user's commitment (selected appointment day).

#### `<Input />` & `<Textarea />`

```css
.input, .textarea {
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  color: var(--foreground);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
}
.input:focus, .textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-ring);
  outline: none;
}
.input::placeholder {
  color: var(--foreground-ghost);
}
```

#### `<Dialog />` & `<Sheet />`

- Overlay: `rgba(0, 0, 0, 0.80)` — heavy dim, almost opaque
- Content bg: `--background-elevated`
- Generous internal padding: `2.5rem`
- Close button: `ghost` variant, `--foreground-muted`

#### `<Toast />` (Sonner)

- Background: `--surface-primary`
- Border: `--border`
- Text: `--foreground`
- Success icon: `--success` (green, NOT red)
- Error icon: `--accent` (red, appropriate here as it signals error)

---

## 5. Imagery & Media Rules

### ✅ DO:

- Use high-resolution, desaturated tattoo photography
- Apply subtle vignettes to hero images (radial gradient from transparent to `--background`)
- Let images bleed to edges — no rounded corners on hero media
- Use `object-fit: cover` with generous aspect ratios (16:9 minimum for heroes)

### ❌ DON'T:

- Never use stock photos with visible watermarks
- Never apply colored overlays or tints to tattoo photography
- Never use image borders or frames — let content dissolve into the void
- Never auto-play video with sound

---

## 6. Spacing & Negative Space Protocol

> [!IMPORTANT]
> **When in doubt, add more space.** This brand breathes. Cramped layouts signal amateur work.

| Context | Minimum Spacing |
|---|---|
| Between major sections | `clamp(4rem, 8vw, 8rem)` |
| Card internal padding | `2rem` |
| Between card groups | `1.5rem` gap |
| Form field vertical spacing | `1.25rem` |
| Button internal padding | `0.75rem 2rem` (generous horizontal) |
| Page edge gutters (mobile) | `1.25rem` |
| Page edge gutters (desktop) | `2rem` minimum |

---

## 7. Animation & Motion Guidelines

### ✅ DO:

- Use `300ms` ease-out for hover transitions
- Fade-in page content with `500ms` ease-out on route change
- Stagger card entrance animations with `100ms` delay between items
- Use GSAP for scroll-triggered reveals (already in dependencies)

### ❌ DON'T:

- Never use bounce or elastic easing on UI elements (too playful for this brand)
- Never animate color changes on text
- Never use animation duration > `800ms` for UI transitions
- Never use parallax on mobile

---

## 8. Accessibility Baseline

| Requirement | Target |
|---|---|
| Text contrast ratio (WCAG AA) | ≥ 4.5:1 for body, ≥ 3:1 for large text |
| Focus indicators | Visible `--accent-ring` on all interactive elements |
| Touch targets | Minimum `44px × 44px` |
| Motion preference | Respect `prefers-reduced-motion: reduce` |
| Font minimum | `0.875rem` (14px) — never smaller |

---

## 9. File & Token Architecture

```
src/
├── index.css                 ← CSS custom properties (tokens from this file)
├── fonts/                    ← Self-hosted font files (if not using CDN)
├── components/
│   └── ui/                   ← shadcn/ui overrides live here
└── lib/
    └── utils.ts              ← cn() helper, design utilities
```

> [!NOTE]
> All design tokens defined in the YAML header above must be reflected as CSS custom properties in `src/index.css`. The YAML is the **source of truth**; the CSS is the **runtime implementation**.

---

## 10. Quick Reference — Color Application Map

```
╔══════════════════════════════════════════════════════════════════╗
║                    WHERE COLORS LIVE                            ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║   #030303  ████████████████████████████████  Page background      ║
║   #0A0A0A  ██████████████████████████        Modals, cards       ║
║   #141414  ████████████████████              Containers          ║
║   #1A1A1A  ██████████████                    Inputs, nested      ║
║   #222222  ────────────────                  Borders (barely)    ║
║                                                                  ║
║   #666666  Metadata · Timestamps · Placeholders                  ║
║   #A3A3A3  Body text · Descriptions · Labels                     ║
║   #F5F5F5  Headlines · Primary text · Active nav                 ║
║                                                                  ║
║   #DC2626  ▓▓▓▓  CTAs ONLY. Book Now. Selected Day. Submit.     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

*This document is the single source of truth for all visual decisions in the Mr. Tato Studio project. Every component, every pixel, every interaction must trace back to a rule defined here. When the system is silent on a decision, choose the darker option, the quieter option, the one with more space.*
