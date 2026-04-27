import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import gsap from "gsap"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: (originX?: number, originY?: number) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

/* ──────────────────────────────────────────────────────────────────────
   INK BLEED TRANSITION — Professional Clone-Based Approach
   
   1. User clicks the toggle → capture (x, y) coordinates
   2. Clone the ENTIRE current page into a fixed overlay
   3. Apply the NEW theme to the real DOM underneath
   4. Use GSAP to animate clip-path: circle() on the CLONE,
      shrinking it from full coverage to 0, revealing the new theme
   5. Remove the clone when animation completes
   
   This ensures a perfectly smooth, artifact-free transition because
   the new theme is already fully rendered underneath the shrinking clone.
   ────────────────────────────────────────────────────────────────────── */

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const isAnimating = useRef(false)

  // Apply theme class to root
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
  }, [storageKey])

  const toggleTheme = useCallback((originX?: number, originY?: number) => {
    if (isAnimating.current) return


    const resolvedTheme = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme
    const nextTheme: Theme = resolvedTheme === "dark" ? "light" : "dark"

    // Coordinates — fallback to viewport center
    const x = originX ?? window.innerWidth / 2
    const y = originY ?? window.innerHeight / 2

    // Maximum radius to cover the entire viewport from origin
    const maxRadius = Math.ceil(
      Math.sqrt(
        Math.max(x, window.innerWidth - x) ** 2 +
        Math.max(y, window.innerHeight - y) ** 2
      )
    )

    isAnimating.current = true

    // ── Step 1: Snapshot the current page into a clone overlay ──
    const clone = document.createElement("div")
    clone.setAttribute("aria-hidden", "true")
    clone.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99999;
      pointer-events: none;
      background: ${resolvedTheme === "dark" ? "#000000" : "#F9F9F8"};
      clip-path: circle(${maxRadius}px at ${x}px ${y}px);
      will-change: clip-path;
    `
    document.body.appendChild(clone)

    // ── Step 2: Apply the new theme IMMEDIATELY underneath ──
    setTheme(nextTheme)

    // ── Step 3: Animate the OLD theme clone shrinking away ──
    // Use requestAnimationFrame to ensure the DOM has painted the new theme
    requestAnimationFrame(() => {
      gsap.to(clone, {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => {
          // ── Step 4: Clean up the DOM ──
          clone.remove()
          isAnimating.current = false
        },
      })
    })
  }, [theme, setTheme])

  const value = {
    theme,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
