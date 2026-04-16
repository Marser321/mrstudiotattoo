# Implementation Plan - Lovable Header Hero Integration

Date: 2026-04-16
Workspace: `/Users/mariomorera/Desktop/mr tato`
User Approval: Explicitly approved to implement (`"PLEASE IMPLEMENT THIS PLAN"`).

## Objective
- Promote the validated lateral scrollytelling hero from `embed/` into a native React section suitable for the client's Lovable codebase.
- Centralize logo, typography classes, cards, and visual framing in a single brand config file.
- Mount the section as the home header entry point so the GitHub-synced Lovable project can consume it directly.

## Scope
1. Create a typed brand config contract:
   - `HeaderHeroCard`
   - `HeaderHeroConfig`
   - `headerHeroConfig`
2. Rebuild `HeroSequenceHeader` as a native React version of the lateral embed:
   - Left visual scrub panel
   - Right horizontal cards panel
   - Machine + rose synchronized progress
   - Mobile/reduced-motion fallback
3. Mount the section in `App.tsx` in place of the current static hero.
4. Use stable public asset paths for:
   - `/assets/logo.svg`
   - `/assets/hero-sequence-v2/*`
   - `/assets/rose-sequence-v1/*`
5. Update local integration docs to describe the config-driven usage.

## Validation Plan
1. Type/script validation:
   - `node --check` is not applicable to TSX, so validate with project TypeScript/Vite build checks.
2. Functional checks:
   - Desktop: pinned 60/40 layout, synchronized scrub, horizontal cards, logo + branded copy.
   - Mobile: static/parallax fallback and vertical card stack.
   - Reduced motion: static fallback without scrub.
3. Editorial checks:
   - Changing logo path, font classes, and cards in `headerHeroConfig` updates the hero without touching component logic.

## Constraints
- Keep the implementation React-native for Lovable compatibility; do not inject the standalone embed script into app composition.
- Preserve unrelated local changes already present in the worktree.
- Only fix unrelated build blockers when they are trivial and required to complete validation.
