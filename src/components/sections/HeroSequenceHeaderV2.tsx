import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { headerHeroConfigV2 } from "@/config/headerHeroConfigV2";
import {
  type HeaderHeroCard,
  type HeaderHeroConfig,
  type HeaderHeroFonts,
  type HeaderHeroVisualFraming,
} from "@/config/headerHeroConfig";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_MAX = 767;

type HeaderHeroConfigInput = Partial<HeaderHeroConfig> & {
  cards?: HeaderHeroCard[];
  fonts?: Partial<HeaderHeroFonts>;
  visualFraming?: Partial<HeaderHeroVisualFraming>;
};

export interface HeroSequenceHeaderProps {
  config?: HeaderHeroConfigInput;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function framePathFromPattern(pattern: string, frameNumber: number) {
  const padded = frameNumber.toString().padStart(4, "0");
  return pattern.replace("{index}", padded);
}

function parseLayoutSplit(input: string) {
  const match = input.trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (!match) return { left: 60, right: 40 };

  const left = Number(match[1]);
  const right = Number(match[2]);
  const total = left + right;

  if (!Number.isFinite(left) || !Number.isFinite(right) || total <= 0) {
    return { left: 60, right: 40 };
  }

  return {
    left: (left / total) * 100,
    right: (right / total) * 100,
  };
}

function revealOpacity(progress: number, framing: HeaderHeroVisualFraming) {
  const start = clamp(framing.roseRevealStart, 0, 1);
  const end = clamp(framing.roseRevealEnd, 0, 1);
  const maxOpacity = clamp(framing.roseMaxOpacity, 0, 1);

  if (end <= start) return maxOpacity;
  if (progress <= start) return 0;
  if (progress >= end) return maxOpacity;

  const t = (progress - start) / (end - start);
  return clamp(t * maxOpacity, 0, maxOpacity);
}

function staticRoseOpacity(framing: HeaderHeroVisualFraming) {
  const midpoint = clamp((framing.roseRevealStart + framing.roseRevealEnd) * 0.5, 0, 1);
  const opacity = revealOpacity(midpoint, framing);
  const floor = clamp(framing.roseMaxOpacity * 0.35, 0, 1);
  return clamp(Math.max(opacity, floor), 0, 1);
}

function cardsTrackProgress(progress: number, framing: HeaderHeroVisualFraming) {
  const start = clamp(framing.cardsRevealStart, 0, 1);
  const end = clamp(framing.cardsRevealEnd, 0, 1);

  if (end <= start) return 1;
  return clamp((progress - start) / (end - start), 0, 1);
}

function drawImagePanel(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  alpha: number,
  scale: number,
  offsetX: number,
  fit: "cover" | "contain" = "cover"
) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const hRatio = canvasWidth / image.width;
  const vRatio = canvasHeight / image.height;
  const ratio = (fit === "contain" ? Math.min(hRatio, vRatio) : Math.max(hRatio, vRatio)) * scale;
  const drawWidth = image.width * ratio;
  const drawHeight = image.height * ratio;
  const baseX = (canvasWidth - drawWidth) * 0.5;
  const offsetXPx = canvasWidth * offsetX;
  const offsetY = (canvasHeight - drawHeight) * 0.5;

  context.save();
  context.globalAlpha = clamp(alpha, 0, 1);
  context.drawImage(image, baseX + offsetXPx, offsetY, drawWidth, drawHeight);
  context.restore();
}

function findFallbackImage(images: Array<HTMLImageElement | null>) {
  return images.find(Boolean) ?? null;
}

function resolveHeaderHeroConfig(input?: HeaderHeroConfigInput): HeaderHeroConfig {
  return {
    ...headerHeroConfigV2,
    ...input,
    cards: input?.cards?.length ? input.cards : headerHeroConfigV2.cards,
    fonts: {
      ...headerHeroConfigV2.fonts,
      ...input?.fonts,
    },
    visualFraming: {
      ...headerHeroConfigV2.visualFraming,
      ...input?.visualFraming,
    },
  };
}

export function HeroSequenceHeaderV2({ config }: HeroSequenceHeaderProps) {
  const { t } = useTranslation();
  const resolvedConfig = useMemo(() => {
    const base = resolveHeaderHeroConfig(config);
    return {
      ...base,
      title: t('hero.title', { defaultValue: base.title }),
      eyebrow: t('hero.eyebrow', { defaultValue: base.eyebrow }),
      ctaLabel: t('hero.ctaLabel', { defaultValue: base.ctaLabel }),
      cards: base.cards.map(card => ({
        ...card,
        eyebrow: t(`hero.cards.${card.id}.eyebrow`, { defaultValue: card.eyebrow }),
        title: t(`hero.cards.${card.id}.title`, { defaultValue: card.title }),
        body: t(`hero.cards.${card.id}.body`, { defaultValue: card.body }),
        ctaLabel: card.ctaLabel ? t(`hero.cards.${card.id}.ctaLabel`, { defaultValue: card.ctaLabel }) : undefined
      }))
    };
  }, [config, t]);
  const split = useMemo(
    () => parseLayoutSplit(resolvedConfig.visualFraming.layoutSplit),
    [resolvedConfig.visualFraming.layoutSplit],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const visualPaneRef = useRef<HTMLDivElement>(null);
  const cardsPaneRef = useRef<HTMLDivElement>(null);
  const cardsViewportRef = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);
  const shellWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticBgRef = useRef<HTMLImageElement>(null);
  const staticMachineRef = useRef<HTMLImageElement>(null);
  const playheadRef = useRef({ frame: 0 });
  const cardsMaxShiftRef = useRef(0);
  const machineImagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const bgImagesRef = useRef<(HTMLImageElement | null)[]>([]);

  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth <= MOBILE_MAX,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const [machineLoadedCount, setMachineLoadedCount] = useState(0);
  const [bgLoadedCount, setBgLoadedCount] = useState(0);
  const [hasMachineError, setHasMachineError] = useState(false);
  const [firstMachineFrameSrc, setFirstMachineFrameSrc] = useState<string | null>(null);
  const [firstBgFrameSrc, setFirstBgFrameSrc] = useState<string | null>(null);

  const shouldUseStaticFallback =
    prefersReducedMotion || hasMachineError || machineLoadedCount < 2;

  const updateCardsMetrics = useCallback(() => {
    const track = cardsTrackRef.current;
    const viewport = cardsViewportRef.current;
    if (!track || !viewport) return;

    cardsMaxShiftRef.current = Math.max(0, track.scrollWidth - viewport.clientWidth);
  }, []);

  const applyCardsTrackByProgress = useCallback(
    (progress: number) => {
      const track = cardsTrackRef.current;
      const pane = cardsPaneRef.current;
      if (!track) return;

      if (isMobileViewport) {
        track.style.transform = "translate3d(0, 0, 0)";
        return;
      }

      const p = cardsTrackProgress(progress, resolvedConfig.visualFraming);
      const x = -cardsMaxShiftRef.current * p;

      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      pane?.style.setProperty("--header-hero-cards-progress", String(p));
    },
    [isMobileViewport, resolvedConfig.visualFraming],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const visualPane = visualPaneRef.current;
    if (!canvas || !visualPane || typeof window === "undefined") return;

    const rect = visualPane.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, []);

  const resolveBgImage = useCallback(
    (machineIndex: number) => {
      if (bgLoadedCount === 0 || resolvedConfig.bgFrameCount <= 0) return null;

      const progress =
        resolvedConfig.frameCount <= 1
          ? 0
          : clamp(machineIndex / (resolvedConfig.frameCount - 1), 0, 1);
      const mappedIndex = Math.round(progress * (resolvedConfig.bgFrameCount - 1));

      return bgImagesRef.current[mappedIndex] ?? findFallbackImage(bgImagesRef.current);
    },
    [bgLoadedCount, resolvedConfig.bgFrameCount, resolvedConfig.frameCount],
  );

  const drawComposite = useCallback(
    (machineIndex: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const machineImage =
        machineImagesRef.current[machineIndex] ?? findFallbackImage(machineImagesRef.current);

      if (!canvas || !context || !machineImage) return;

      const progress =
        resolvedConfig.frameCount <= 1
          ? 0
          : clamp(machineIndex / (resolvedConfig.frameCount - 1), 0, 1);
      const bgImage = resolveBgImage(machineIndex);
      const bgOpacity = revealOpacity(progress, resolvedConfig.visualFraming);
      const featherStrength = clamp(
        resolvedConfig.visualFraming.machineFeatherStrength,
        0,
        1,
      );
      const featherBlur = featherStrength * 16;
      const featherOpacity = clamp(0.05 + featherStrength * 0.5, 0, 0.38);

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      if (bgImage) {
        drawImagePanel(
          context,
          canvas,
          bgImage,
          bgOpacity,
          resolvedConfig.visualFraming.bgScale,
          resolvedConfig.visualFraming.bgOffsetX,
        );
      }

      if (featherBlur > 0.1) {
        context.save();
        context.filter = `blur(${featherBlur.toFixed(2)}px)`;
        drawImagePanel(
          context,
          canvas,
          machineImage,
          featherOpacity,
          resolvedConfig.visualFraming.visualScale,
          resolvedConfig.visualFraming.visualOffsetX,
          "contain"
        );
        context.restore();
      }

      context.save();
      context.filter = "none";
      drawImagePanel(
        context,
        canvas,
        machineImage,
        1,
        resolvedConfig.visualFraming.visualScale,
        resolvedConfig.visualFraming.visualOffsetX,
        "contain"
      );
      context.restore();

      applyCardsTrackByProgress(progress);
    },
    [applyCardsTrackByProgress, resolveBgImage, resolvedConfig.frameCount, resolvedConfig.visualFraming],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    const updateViewport = () => setIsMobileViewport(window.innerWidth <= MOBILE_MAX);

    updatePreference();
    updateViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);
    } else {
      mediaQuery.addListener(updatePreference);
    }

    window.addEventListener("resize", updateViewport);

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", updatePreference);
      } else {
        mediaQuery.removeListener(updatePreference);
      }

      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === "undefined") {
      setHasStartedLoading(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setHasStartedLoading(true);
      },
      { rootMargin: "240px" },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    machineImagesRef.current = new Array(resolvedConfig.frameCount).fill(null);
    bgImagesRef.current = new Array(resolvedConfig.bgFrameCount).fill(null);
    playheadRef.current.frame = 0;
    setMachineLoadedCount(0);
    setBgLoadedCount(0);
    setHasMachineError(false);
    setFirstMachineFrameSrc(null);
    setFirstBgFrameSrc(null);

    const machinePreview = new Image();
    machinePreview.decoding = "async";
    machinePreview.onload = () => {
      if (cancelled) return;
      machineImagesRef.current[0] = machinePreview;
      setFirstMachineFrameSrc(machinePreview.src);
      setMachineLoadedCount(1);
    };
    machinePreview.onerror = () => {
      if (!cancelled) setHasMachineError(true);
    };
    machinePreview.src = framePathFromPattern(resolvedConfig.framePathPattern, 1);

    const bgPreview = new Image();
    bgPreview.decoding = "async";
    bgPreview.onload = () => {
      if (cancelled) return;
      bgImagesRef.current[0] = bgPreview;
      setFirstBgFrameSrc(bgPreview.src);
      setBgLoadedCount(1);
    };
    bgPreview.src = framePathFromPattern(resolvedConfig.bgFramePathPattern, 1);

    return () => {
      cancelled = true;
    };
  }, [
    resolvedConfig.bgFrameCount,
    resolvedConfig.bgFramePathPattern,
    resolvedConfig.frameCount,
    resolvedConfig.framePathPattern,
  ]);

  useEffect(() => {
    if (!hasStartedLoading || prefersReducedMotion) return;

    let cancelled = false;
    let machineCompleted = machineImagesRef.current[0] ? 1 : 0;
    let machineSuccessful = machineImagesRef.current[0] ? 1 : 0;
    for (let index = 1; index < resolvedConfig.frameCount; index += 1) {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (cancelled) return;

        machineImagesRef.current[index] = image;
        machineCompleted += 1;
        machineSuccessful += 1;
        setMachineLoadedCount((current) => current + 1);
        setFirstMachineFrameSrc((current) => current ?? image.src);

        if (machineCompleted === resolvedConfig.frameCount && machineSuccessful < 2) {
          setHasMachineError(true);
        }
      };
      image.onerror = () => {
        if (cancelled) return;
        machineCompleted += 1;
        if (machineCompleted === resolvedConfig.frameCount && machineSuccessful < 2) {
          setHasMachineError(true);
        }
      };
      image.src = framePathFromPattern(resolvedConfig.framePathPattern, index + 1);
    }

    for (let index = 1; index < resolvedConfig.bgFrameCount; index += 1) {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (cancelled) return;
        bgImagesRef.current[index] = image;
        setBgLoadedCount((current) => current + 1);
        setFirstBgFrameSrc((current) => current ?? image.src);
      };
      image.onerror = () => {
        if (cancelled) return;
      };
      image.src = framePathFromPattern(resolvedConfig.bgFramePathPattern, index + 1);
    }

    return () => {
      cancelled = true;
    };
  }, [
    hasStartedLoading,
    prefersReducedMotion,
    resolvedConfig.bgFrameCount,
    resolvedConfig.bgFramePathPattern,
    resolvedConfig.frameCount,
    resolvedConfig.framePathPattern,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let resizeTimer: number;

    const handleResize = () => {
      resizeCanvas();
      updateCardsMetrics();

      if (!shouldUseStaticFallback) {
        drawComposite(Math.round(playheadRef.current.frame));
      } else {
        applyCardsTrackByProgress(0);
      }

      ScrollTrigger.refresh();
    };

    const debouncedResize = () => {
      window.cancelAnimationFrame(resizeTimer);
      resizeTimer = window.requestAnimationFrame(handleResize);
    };

    handleResize();
    window.addEventListener("resize", debouncedResize, { passive: true });

    return () => {
      window.cancelAnimationFrame(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [applyCardsTrackByProgress, drawComposite, resizeCanvas, shouldUseStaticFallback, updateCardsMetrics]);

  useEffect(() => {
    if (shouldUseStaticFallback) {
      applyCardsTrackByProgress(0);
    }
  }, [applyCardsTrackByProgress, shouldUseStaticFallback]);

  useGSAP(
    () => {
      if (!sectionRef.current || !stageRef.current || shouldUseStaticFallback) return;

      playheadRef.current.frame = 0;
      resizeCanvas();
      updateCardsMetrics();
      drawComposite(0);

      let cleanup: () => void;

      if (isMobileViewport) {
        const tween = gsap.to(playheadRef.current, {
          frame: resolvedConfig.frameCount - 1,
          snap: "frame",
          ease: "none",
          onUpdate: () => {
            drawComposite(Math.round(playheadRef.current.frame));
          },
          duration: resolvedConfig.frameCount / 30,
          repeat: -1,
          yoyo: true,
        });
        cleanup = () => {
          tween.kill();
        };
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () =>
              `+=${Math.round(window.innerHeight * (resolvedConfig.visualFraming.pinDistanceVh / 100))}`,
            scrub: resolvedConfig.visualFraming.scrub,
            pin: stageRef.current,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        tl.to(
          playheadRef.current,
          {
            frame: resolvedConfig.frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 1,
            onUpdate: () => {
              drawComposite(Math.round(playheadRef.current.frame));
            },
          },
          0,
        );

        if (shellWrapperRef.current) {
          // The next section starts entering when 100vh remains in the pin distance.
          const overlapFraction = 100 / resolvedConfig.visualFraming.pinDistanceVh;
          // Start the exit right as the next section arrives
          const parallaxStart = Math.max(0, 1 - overlapFraction);

          tl.to(
            shellWrapperRef.current,
            {
              y: "-110vh", // Move completely off-screen upwards
              opacity: 0,
              ease: "power2.inOut",
              duration: 1 - parallaxStart,
            },
            parallaxStart,
          );
        }

        cleanup = () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      }

      return cleanup;
    },
    {
      scope: sectionRef,
      dependencies: [
        drawComposite,
        resizeCanvas,
        resolvedConfig.frameCount,
        resolvedConfig.visualFraming.pinDistanceVh,
        resolvedConfig.visualFraming.scrub,
        shouldUseStaticFallback,
        updateCardsMetrics,
        isMobileViewport,
      ],
    },
  );

  useGSAP(
    () => {
      if (
        !isMobileViewport ||
        prefersReducedMotion ||
        !shouldUseStaticFallback ||
        !staticMachineRef.current ||
        !sectionRef.current
      ) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.65,
        },
      });

      if (staticBgRef.current) {
        timeline.to(staticBgRef.current, { "--header-hero-bg-y": "-40px", ease: "none" }, 0);
      }

      timeline.to(
        staticMachineRef.current,
        { "--header-hero-machine-y": "-16px", ease: "none" },
        0,
      );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    {
      scope: sectionRef,
      dependencies: [isMobileViewport, prefersReducedMotion, shouldUseStaticFallback],
    },
  );

  const visualPaneStyle: CSSProperties = {
    height: isMobileViewport ? "62vh" : "100%",
    background:
      "radial-gradient(circle at 30% 45%, rgba(220,38,38,0.06), transparent 42%), #0a0000",
  };

  const shellStyle: CSSProperties = isMobileViewport
    ? { display: "block" }
    : {
        display: "grid",
        gridTemplateColumns: `minmax(0, ${split.left.toFixed(4)}%) minmax(0, ${split.right.toFixed(4)}%)`,
      };

  const sectionStyle: CSSProperties = isMobileViewport
    ? {}
    : { height: `${resolvedConfig.visualFraming.pinDistanceVh}vh` };

  const staticBgStyle: CSSProperties = {
    objectPosition: `${50 + resolvedConfig.visualFraming.bgOffsetX * 100}% 50%`,
    opacity: firstBgFrameSrc ? staticRoseOpacity(resolvedConfig.visualFraming) : 0,
    transform: `translate3d(0, var(--header-hero-bg-y, 0px), 0) scale(${resolvedConfig.visualFraming.bgScale})`,
  };

  const staticMachineStyle: CSSProperties = {
    objectPosition: `${50 + resolvedConfig.visualFraming.visualOffsetX * 100}% 50%`,
    opacity: firstMachineFrameSrc ? 1 : 0,
    transform: `translate3d(0, var(--header-hero-machine-y, 0px), 0) scale(${resolvedConfig.visualFraming.visualScale})`,
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black text-white"
      style={sectionStyle}
    >
      <div ref={stageRef} className={cn("relative overflow-hidden pt-[104px]", isMobileViewport ? "min-h-screen" : "h-screen")}>
        <div ref={shellWrapperRef} className="relative h-full w-full" style={shellStyle}>
          <div
            ref={visualPaneRef}
            className={cn(
              "relative min-w-0 overflow-hidden",
              isMobileViewport ? "" : "",
            )}
            style={visualPaneStyle}
          >
            {shouldUseStaticFallback ? (
              <>
                {firstBgFrameSrc ? (
                  <img
                    ref={staticBgRef}
                    src={firstBgFrameSrc}
                    alt="Rose background frame"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={staticBgStyle}
                    loading="eager"
                  />
                ) : null}
                {firstMachineFrameSrc ? (
                  <img
                    ref={staticMachineRef}
                    src={firstMachineFrameSrc}
                    alt="Tattoo machine frame"
                    className="absolute inset-0 h-full w-full object-cover drop-shadow-[0_0_16px_rgba(0,0,0,0.54)] drop-shadow-[0_0_34px_rgba(0,0,0,0.35)]"
                    style={staticMachineStyle}
                    loading="eager"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-[#0a0000]" />
                )}
              </>
            ) : (
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-black/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0505]/80 via-transparent to-black/40" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_24%,rgba(220,38,38,0.08)_0_1px,transparent_1px),radial-gradient(circle_at_78%_64%,rgba(220,38,38,0.06)_0_1px,transparent_1px),radial-gradient(circle_at_42%_84%,rgba(255,255,255,0.08)_0_1px,transparent_1px)] bg-[length:3px_3px,4px_4px,5px_5px] opacity-15 mix-blend-multiply dark:mix-blend-screen" />

            {/* Transition fade to black at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

            <div className="absolute bottom-4 left-4 z-20 max-w-[80%] md:bottom-9 md:left-8 md:max-w-[26rem]">
              <p
                className={cn(
                  resolvedConfig.fonts.eyebrowClass,
                  "mb-3 text-[10px] uppercase tracking-[0.32em] text-white/70",
                )}
              >
                {resolvedConfig.eyebrow}
              </p>
              <h1
                className={cn(
                  resolvedConfig.fonts.headingClass,
                  "mb-6 text-4xl leading-[0.95] text-white md:text-6xl xl:text-[4.4rem]",
                )}
              >
                {resolvedConfig.title}
              </h1>
            </div>


            <div className="absolute bottom-0 left-1/2 z-20 hidden h-16 w-px -translate-x-1/2 bg-gradient-to-b from-red-500/90 to-red-500/0 md:block" />
          </div>

          <div
            ref={cardsPaneRef}
            className="relative min-w-0 overflow-hidden bg-black"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(220,38,38,0.05),transparent_50%)]" />

            <div
              ref={cardsViewportRef}
              className={cn(
                "relative z-10 box-border h-full w-full",
                isMobileViewport ? "overflow-visible p-4" : "overflow-hidden p-5",
              )}
            >
              <div
                ref={cardsTrackRef}
                className={cn(
                  "flex will-change-transform",
                  isMobileViewport ? "flex-col gap-3" : "h-full flex-row items-stretch gap-4",
                )}
              >
                {resolvedConfig.cards.map((card) => (
                  <article
                    key={card.id}
                    data-id={card.id}
                    className={cn(
                      "group relative flex min-h-full flex-col justify-end gap-3 overflow-hidden border border-white/12 bg-black/45 p-4 shadow-[0_20px_55px_rgba(0,0,0,0.35)] backdrop-blur-[24px] backdrop-saturate-[160%] transition-transform duration-300 hover:-translate-y-1 hover:border-white/25",
                      isMobileViewport ? "min-h-0" : "",
                    )}
                    style={{
                      flex: isMobileViewport ? "1 1 auto" : "0 0 min(78%, 22rem)",
                    }}
                  >
                    {card.imageSrc && (
                      <>
                        <div className="absolute inset-0 z-0 bg-[#060606]">
                          <img
                            src={card.imageSrc}
                            alt={card.title}
                            className="h-full w-full object-contain p-4 opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50"
                          />
                        </div>
                        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-black/10 pointer-events-none" />
                      </>
                    )}
                    <div className="relative z-10 flex h-full flex-col justify-end gap-3">
                      <p
                        className={cn(
                          resolvedConfig.fonts.cardEyebrowClass,
                          "m-0 text-[10px] uppercase tracking-[0.3em] text-white/66",
                        )}
                      >
                        {card.eyebrow}
                      </p>
                      <h2
                        className={cn(
                          resolvedConfig.fonts.cardTitleClass,
                          "m-0 text-[clamp(1.45rem,2.2vw,2rem)] leading-[1.03] text-white",
                        )}
                      >
                        {card.title}
                      </h2>
                      <p
                        className={cn(
                          resolvedConfig.fonts.cardBodyClass,
                          "m-0 text-sm leading-relaxed text-white/80",
                        )}
                      >
                        {card.body}
                      </p>
                      {card.ctaLabel ? (
                        <a
                          href={card.ctaHref ?? "#"}
                          className={cn(
                            resolvedConfig.fonts.buttonClass,
                            "mt-auto inline-flex w-fit items-center border border-white/42 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black backdrop-blur-md",
                          )}
                        >
                          {card.ctaLabel}
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!prefersReducedMotion && machineLoadedCount > 0 && machineLoadedCount < resolvedConfig.frameCount ? (
          <div className="absolute bottom-0 left-0 z-30 h-0.5 w-full bg-white/10">
            <div
              className="h-full bg-white/70 transition-[width] duration-200"
              style={{ width: `${(machineLoadedCount / resolvedConfig.frameCount) * 100}%` }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
