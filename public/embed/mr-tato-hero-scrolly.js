/* global window, document */
(function setupMrTatoHeroScrolly(global, doc) {
  "use strict";

  var API_NAME = "initMrTatoHeroScrolly";
  var MOBILE_MAX = 767;
  var DEFAULTS = {
    rootSelector: "#mr-tato-hero-scrolly",
    frameCount: 150,
    framePathPattern: "/assets/hero-sequence-v2/frame_{index}.webp",
    bgFrameCount: 150,
    bgFramePathPattern: "/assets/rose-sequence-v1/frame_{index}.webp",
    pinDistanceVh: 320,
    scrub: 1,
    roseRevealStart: 0.0,
    roseRevealEnd: 0.35,
    roseMaxOpacity: 0.92,
    machineFeatherStrength: 0.08,
    layoutSplit: "60/40",
    cardFlow: "horizontal-track",
    cardsRevealStart: 0.18,
    cardsRevealEnd: 1.0,
    visualScale: 0.89,
    visualOffsetX: 0.02,
    bgScale: 0.9,
    bgOffsetX: -0.08,
    title: "Precision in Motion",
    ctaLabel: "Book Your Session",
    ctaHref: "#contact",
    logoSrc: "",
    cards: null,
  };

  var DEFAULT_CARDS = [
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
      ctaHref: "#contact",
    },
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function padFrame(value) {
    return String(value).padStart(4, "0");
  }

  function framePath(pattern, frameNumber) {
    return String(pattern).replace("{index}", padFrame(frameNumber));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseLayoutSplit(input) {
    if (typeof input !== "string") return { left: 60, right: 40 };
    var match = input.trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
    if (!match) return { left: 60, right: 40 };

    var left = Number(match[1]);
    var right = Number(match[2]);
    var total = left + right;
    if (!Number.isFinite(left) || !Number.isFinite(right) || total <= 0) return { left: 60, right: 40 };
    return {
      left: (left / total) * 100,
      right: (right / total) * 100,
    };
  }

  function addMediaListener(mql, callback) {
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", callback);
      return function remove() {
        mql.removeEventListener("change", callback);
      };
    }
    mql.addListener(callback);
    return function remove() {
      mql.removeListener(callback);
    };
  }

  function normalizeCards(input) {
    var source = Array.isArray(input) && input.length ? input : DEFAULT_CARDS;
    return source.map(function mapCard(card, index) {
      var safe = card && typeof card === "object" ? card : {};
      return {
        id: safe.id || "card-" + index,
        eyebrow: safe.eyebrow || "",
        title: safe.title || "Tarjeta",
        body: safe.body || "",
        ctaLabel: safe.ctaLabel || "",
        ctaHref: safe.ctaHref || "#",
        icon: safe.icon || "",
        imageSrc: safe.imageSrc || "",
        isHighlighted: !!safe.isHighlighted,
        secondCtaLabel: safe.secondCtaLabel || "",
        secondCtaHref: safe.secondCtaHref || "#",
      };
    });
  }

  function revealOpacity(progress, config) {
    var start = clamp(config.roseRevealStart, 0, 1);
    var end = clamp(config.roseRevealEnd, 0, 1);
    var maxOpacity = clamp(config.roseMaxOpacity, 0, 1);

    if (end <= start) return maxOpacity;
    if (progress <= start) return 0;
    if (progress >= end) return maxOpacity;

    var t = (progress - start) / (end - start);
    return clamp(t * maxOpacity, 0, maxOpacity);
  }

  function cardsTrackProgress(progress, config) {
    var start = clamp(config.cardsRevealStart, 0, 1);
    var end = clamp(config.cardsRevealEnd, 0, 1);
    if (end <= start) return 1;
    return clamp((progress - start) / (end - start), 0, 1);
  }

  function staticRoseOpacity(config) {
    var midpoint = clamp((config.roseRevealStart + config.roseRevealEnd) * 0.5, 0, 1);
    var opacity = revealOpacity(midpoint, config);
    var floor = clamp(config.roseMaxOpacity * 0.35, 0, 1);
    return clamp(Math.max(opacity, floor), 0, 1);
  }

  function ensureGsap() {
    var gsap = global.gsap;
    var scrollTrigger = global.ScrollTrigger || (gsap && gsap.plugins && gsap.plugins.ScrollTrigger);
    if (!gsap || !scrollTrigger) {
      throw new Error("GSAP + ScrollTrigger are required before calling initMrTatoHeroScrolly.");
    }
    gsap.registerPlugin(scrollTrigger);
    return { gsap: gsap, ScrollTrigger: scrollTrigger };
  }

  function mergeConfig(input) {
    var merged = {};
    var key;
    for (key in DEFAULTS) merged[key] = DEFAULTS[key];
    if (input && typeof input === "object") {
      for (key in input) merged[key] = input[key];
    }

    merged.frameCount = Math.max(2, Number(merged.frameCount) || DEFAULTS.frameCount);
    merged.bgFrameCount = Math.max(2, Number(merged.bgFrameCount) || DEFAULTS.bgFrameCount);
    merged.pinDistanceVh = Math.max(100, Number(merged.pinDistanceVh) || DEFAULTS.pinDistanceVh);
    merged.scrub = Number(merged.scrub) > 0 ? Number(merged.scrub) : DEFAULTS.scrub;
    merged.roseRevealStart = clamp(Number(merged.roseRevealStart), 0, 1);
    merged.roseRevealEnd = clamp(Number(merged.roseRevealEnd), 0, 1);
    merged.roseMaxOpacity = clamp(Number(merged.roseMaxOpacity), 0, 1);
    merged.machineFeatherStrength = clamp(Number(merged.machineFeatherStrength), 0, 1);
    merged.cardsRevealStart = clamp(Number(merged.cardsRevealStart), 0, 1);
    merged.cardsRevealEnd = clamp(Number(merged.cardsRevealEnd), 0, 1);
    merged.visualScale = Math.max(0.05, Number(merged.visualScale) || DEFAULTS.visualScale);
    merged.visualOffsetX = clamp(Number(merged.visualOffsetX), -0.5, 0.5);
    merged.bgScale = Math.max(0.8, Number(merged.bgScale) || DEFAULTS.bgScale);
    merged.bgOffsetX = clamp(Number(merged.bgOffsetX), -0.5, 0.5);
    merged.layoutSplit = typeof merged.layoutSplit === "string" ? merged.layoutSplit : DEFAULTS.layoutSplit;
    merged.cardFlow = merged.cardFlow === "horizontal-track" ? merged.cardFlow : "horizontal-track";
    merged.cards = normalizeCards(merged.cards);
    return merged;
  }

  function buildMarkup(config) {
    var logoHtml = config.logoSrc
      ? '<img class="msth-logo -visible" src="' + escapeHtml(config.logoSrc) + '" alt="Client logo" />'
      : '<img class="msth-logo" alt="" aria-hidden="true" />';

    return (
      '' +
      '<div class="msth-stage">' +
      '  <div class="msth-shell">' +
      '    <div class="msth-visual-pane">' +
      '      <canvas class="msth-canvas msth-bg-canvas" aria-hidden="true"></canvas>' +
      '      <img class="msth-static-bg" alt="Rose background frame" loading="eager" />' +
      '      <div class="msth-bg-layer -left" aria-hidden="true"></div>' +
      '      <div class="msth-bg-layer -bottom" aria-hidden="true"></div>' +
      '      <div class="msth-grain" aria-hidden="true"></div>' +
      '      <div class="msth-copy">' +
      '        <p class="msth-kicker">MR STUDIO TATO</p>' +
      '        <h2 class="msth-title">' +
      escapeHtml(config.title) +
      "</h2>" +
      '        <a class="msth-cta" href="' +
      escapeHtml(config.ctaHref) +
      '">' +
      escapeHtml(config.ctaLabel) +
      "</a>" +
      "      </div>" +
      "    </div>" +
      '    <div class="msth-cards-pane">' +
      '      <div class="msth-cards-viewport">' +
      '        <div class="msth-cards-track"></div>' +
      "      </div>" +
      logoHtml +
      "    </div>" +
      "  </div>" +
      '  <canvas class="msth-canvas msth-machine-canvas" aria-hidden="true"></canvas>' +
      '  <img class="msth-static-machine" alt="Tattoo machine frame" loading="eager" />' +
      '  <div class="msth-scroll-indicator" aria-hidden="true"></div>' +
      '  <div class="msth-progress" aria-hidden="true"><div class="msth-progress-fill"></div></div>' +
      "</div>"
    );
  }

  function renderCards(trackEl, cards) {
    trackEl.innerHTML = "";
    cards.forEach(function eachCard(card) {
      var cardEl = doc.createElement("article");
      cardEl.className = "msth-card" + (card.isHighlighted ? " -highlighted" : "");
      cardEl.setAttribute("data-id", card.id);

      if (card.imageSrc) {
        var imageWrap = doc.createElement("div");
        imageWrap.className = "msth-card-image";
        var img = doc.createElement("img");
        img.src = card.imageSrc;
        img.alt = card.title + " sketch";
        img.loading = "lazy";
        imageWrap.appendChild(img);
        cardEl.appendChild(imageWrap);
      }

      var content = doc.createElement("div");
      content.className = "msth-card-content";

      if (card.icon) {
        var iconEl = doc.createElement("div");
        iconEl.className = "msth-card-icon";
        iconEl.innerHTML = card.icon;
        content.appendChild(iconEl);
      }

      if (card.eyebrow) {
        var eyebrow = doc.createElement("p");
        eyebrow.className = "msth-card-eyebrow";
        eyebrow.textContent = card.eyebrow;
        content.appendChild(eyebrow);
      }

      var title = doc.createElement("h3");
      title.className = "msth-card-title";
      title.textContent = card.title;
      content.appendChild(title);

      var body = doc.createElement("p");
      body.className = "msth-card-body";
      body.textContent = card.body;
      content.appendChild(body);

      if (card.ctaLabel || card.secondCtaLabel) {
        var ctaContainer = doc.createElement("div");
        ctaContainer.className = "msth-card-cta-container";

        if (card.ctaLabel) {
          var cta = doc.createElement("a");
          cta.className = "msth-card-cta";
          cta.href = card.ctaHref || "#";
          cta.textContent = card.ctaLabel;
          ctaContainer.appendChild(cta);
        }

        if (card.secondCtaLabel) {
          var cta2 = doc.createElement("a");
          cta2.className = "msth-card-cta -second";
          cta2.href = card.secondCtaHref || "#";
          cta2.textContent = card.secondCtaLabel;
          ctaContainer.appendChild(cta2);
        }
        content.appendChild(ctaContainer);
      }

      cardEl.appendChild(content);
      trackEl.appendChild(cardEl);
    });
  }

  function findFallbackImage(images) {
    var i;
    for (i = 0; i < images.length; i += 1) {
      if (images[i]) return images[i];
    }
    return null;
  }

  function drawImagePanel(context, canvas, image, alpha, scale, offsetX, anchorY) {
    if (!image) return;

    var cWidth = canvas.width;
    var cHeight = canvas.height;
    var hRatio = cWidth / image.width;
    var vRatio = cHeight / image.height;
    var ratio = Math.max(hRatio, vRatio) * scale;
    var drawWidth = image.width * ratio;
    var drawHeight = image.height * ratio;
    var baseX = (cWidth - drawWidth) * 0.5;
    var offsetXPx = cWidth * offsetX;
    var yAnchor = typeof anchorY === "number" ? anchorY : 0.5;
    var offsetY = (cHeight - drawHeight) * yAnchor;

    context.save();
    context.globalAlpha = clamp(alpha, 0, 1);
    context.drawImage(image, baseX + offsetXPx, offsetY, drawWidth, drawHeight);
    context.restore();
  }

  global[API_NAME] = function initMrTatoHeroScrolly(userConfig) {
    var libs = ensureGsap();
    var gsap = libs.gsap;
    var config = mergeConfig(userConfig);
    var root = doc.querySelector(config.rootSelector);

    if (!root) {
      throw new Error("Root not found for selector: " + config.rootSelector);
    }

    if (root.__msthInstance && typeof root.__msthInstance.destroy === "function") {
      root.__msthInstance.destroy();
    }

    var split = parseLayoutSplit(config.layoutSplit);
    var originalHtml = root.innerHTML;

    root.classList.add("msth-host");
    root.classList.remove("msth-error", "msth-static-mode");
    root.style.setProperty("--msth-pin-distance", config.pinDistanceVh + "vh");
    root.style.setProperty("--msth-left-col", split.left.toFixed(4) + "%");
    root.style.setProperty("--msth-right-col", split.right.toFixed(4) + "%");
    root.innerHTML = buildMarkup(config);

    var stage = root.querySelector(".msth-stage");
    var visualPane = root.querySelector(".msth-visual-pane");
    var cardsPane = root.querySelector(".msth-cards-pane");
    var cardsViewport = root.querySelector(".msth-cards-viewport");
    var cardsTrack = root.querySelector(".msth-cards-track");
    var bgCanvas = root.querySelector(".msth-bg-canvas");
    var machineCanvas = root.querySelector(".msth-machine-canvas");
    var staticBg = root.querySelector(".msth-static-bg");
    var staticMachine = root.querySelector(".msth-static-machine");
    var progressFill = root.querySelector(".msth-progress-fill");
    var bgContext = bgCanvas.getContext("2d");
    var machineContext = machineCanvas.getContext("2d");

    renderCards(cardsTrack, config.cards);

    var machineImages = new Array(config.frameCount).fill(null);
    var bgImages = new Array(config.bgFrameCount).fill(null);
    var playhead = { frame: 0 };
    var cardsMaxShift = 0;

    var tween = null;
    var mobileParallaxTween = null;
    var observer = null;
    var destroyed = false;
    var resizeRaf = 0;

    var startedMachineBulkLoad = false;
    var startedBgBulkLoad = false;
    var machineLoadedCount = 0;
    var machineCompletedCount = 0;
    var bgLoadedCount = 0;
    var bgCompletedCount = 0;
    var hasMachineError = false;

    var motionQuery =
      typeof global.matchMedia === "function"
        ? global.matchMedia("(prefers-reduced-motion: reduce)")
        : {
            matches: false,
            addListener: function addListener() {},
            removeListener: function removeListener() {},
          };
    var prefersReducedMotion = motionQuery.matches;
    var removeMotionListener = null;

    function isMobileViewport() {
      return global.innerWidth <= MOBILE_MAX;
    }

    function normalizedProgress(machineIndex) {
      if (config.frameCount <= 1) return 0;
      return clamp(machineIndex / (config.frameCount - 1), 0, 1);
    }

    function resolveBgFrameIndex(machineIndex) {
      if (config.bgFrameCount <= 1) return 0;
      var progress = normalizedProgress(machineIndex);
      return Math.round(progress * (config.bgFrameCount - 1));
    }

    function resolveBgImage(machineIndex) {
      if (bgLoadedCount === 0) return null;
      var mappedIndex = clamp(resolveBgFrameIndex(machineIndex), 0, config.bgFrameCount - 1);
      return bgImages[mappedIndex] || findFallbackImage(bgImages);
    }

    function updateProgress() {
      if (!progressFill) return;
      var ratio = Math.max(0, Math.min(1, machineLoadedCount / config.frameCount));
      progressFill.style.width = ratio * 100 + "%";
    }

    function updateCardsMetrics() {
      cardsMaxShift = Math.max(0, cardsTrack.scrollWidth - cardsViewport.clientWidth);
    }

    function applyCardsTrackByProgress(progress) {
      if (isMobileViewport() || config.cardFlow !== "horizontal-track") {
        cardsTrack.style.transform = "translate3d(0,0,0)";
        return;
      }

      var p = cardsTrackProgress(progress, config);
      var x = -cardsMaxShift * p;
      cardsTrack.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
      cardsPane.style.setProperty("--msth-cards-progress", String(p));
    }

    function resizeCanvas() {
      var rect = visualPane.getBoundingClientRect();
      var stageRect = stage.getBoundingClientRect();
      var dpr = global.devicePixelRatio || 1;
      
      var bWidth = Math.max(1, Math.round(rect.width * dpr));
      var bHeight = Math.max(1, Math.round(rect.height * dpr));
      bgCanvas.width = bWidth;
      bgCanvas.height = bHeight;
      bgCanvas.style.width = rect.width + "px";
      bgCanvas.style.height = rect.height + "px";

      var mWidth = Math.max(1, Math.round(stageRect.width * dpr));
      var mHeight = Math.max(1, Math.round(stageRect.height * dpr));
      machineCanvas.width = mWidth;
      machineCanvas.height = mHeight;
      machineCanvas.style.width = stageRect.width + "px";
      machineCanvas.style.height = stageRect.height + "px";
    }

    function applyStaticObjectPosition() {
      var machinePosX = (50 + config.visualOffsetX * 100).toFixed(2) + "%";
      var bgPosX = (50 + config.bgOffsetX * 100).toFixed(2) + "%";
      staticMachine.style.objectPosition = machinePosX + " 50%";
      staticBg.style.objectPosition = bgPosX + " 50%";
      staticMachine.style.setProperty("--msth-static-machine-scale", config.visualScale.toFixed(4));
      staticMachine.style.setProperty("--msth-static-machine-y", "0px");
      staticBg.style.setProperty("--msth-static-bg-scale", config.bgScale.toFixed(4));
      staticBg.style.setProperty("--msth-static-bg-y", "0px");
    }

    function drawComposite(machineIndex) {
      if (!bgContext || !machineContext) return;
      var machineImage = machineImages[machineIndex];
      var bgImage = resolveBgImage(machineIndex);
      var progress = normalizedProgress(machineIndex);
      var bgOpacity = revealOpacity(progress, config);
      var featherStrength = clamp(config.machineFeatherStrength, 0, 1);
      var featherBlur = featherStrength * 16;
      var featherOpacity = clamp(0.05 + featherStrength * 0.5, 0, 0.38);

      bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      bgContext.imageSmoothingEnabled = true;
      bgContext.imageSmoothingQuality = "high";

      machineContext.clearRect(0, 0, machineCanvas.width, machineCanvas.height);
      machineContext.imageSmoothingEnabled = true;
      machineContext.imageSmoothingQuality = "high";

      if (bgImage) {
        drawImagePanel(bgContext, bgCanvas, bgImage, bgOpacity, config.bgScale, config.bgOffsetX);
      }

      if (machineImage) {
        if (featherBlur > 0.1) {
          machineContext.save();
          machineContext.filter = "blur(" + featherBlur.toFixed(2) + "px)";
          drawImagePanel(machineContext, machineCanvas, machineImage, featherOpacity, config.visualScale, config.visualOffsetX, 1.0);
          machineContext.restore();
        }
        machineContext.save();
        machineContext.filter = "none";
        drawImagePanel(machineContext, machineCanvas, machineImage, 1, config.visualScale, config.visualOffsetX, 1.0);
        machineContext.restore();
      }

      applyCardsTrackByProgress(progress);
    }

    function applyStaticLayers(machineIndex) {
      var safeMachineIndex = clamp(machineIndex || 0, 0, config.frameCount - 1);
      var machineImage = machineImages[safeMachineIndex] || findFallbackImage(machineImages);
      var bgImage = resolveBgImage(safeMachineIndex);

      if (machineImage) {
        staticMachine.src = machineImage.src;
        staticMachine.style.opacity = "1";
      } else {
        staticMachine.style.opacity = "0";
      }

      if (bgImage) {
        staticBg.src = bgImage.src;
        staticBg.style.opacity = String(staticRoseOpacity(config));
      } else {
        staticBg.style.opacity = "0";
      }
      applyCardsTrackByProgress(normalizedProgress(safeMachineIndex));
    }

    function hideStaticLayers() {
      staticMachine.style.opacity = "0";
      staticBg.style.opacity = "0";
    }

    function isStaticMode() {
      return prefersReducedMotion || hasMachineError || isMobileViewport() || machineLoadedCount < 2;
    }

    function setStaticMode(enabled) {
      if (enabled) root.classList.add("msth-static-mode");
      else root.classList.remove("msth-static-mode");
    }

    function killAnimation(target) {
      if (!target) return;
      if (target.scrollTrigger) target.scrollTrigger.kill();
      target.kill();
    }

    function clearRuntimeTweens() {
      killAnimation(tween);
      killAnimation(mobileParallaxTween);
      tween = null;
      mobileParallaxTween = null;
    }

    function setupMobileParallaxIfNeeded() {
      if (!isMobileViewport() || prefersReducedMotion || !staticMachine.getAttribute("src")) return;

      mobileParallaxTween = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.65,
        },
      });
      mobileParallaxTween.to(staticBg, { "--msth-static-bg-y": "-40px", ease: "none" }, 0);
      mobileParallaxTween.to(
        staticMachine,
        {
          "--msth-static-machine-y": "-16px",
          "--msth-static-machine-scale": (config.visualScale + 0.01).toFixed(4),
          ease: "none",
        },
        0
      );
    }

    function setupDesktopScrub() {
      if (isStaticMode()) return;

      hideStaticLayers();
      playhead.frame = 0;
      drawComposite(0);

      tween = gsap.to(playhead, {
        frame: config.frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: function onUpdate() {
          drawComposite(Math.round(playhead.frame));
        },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: function end() {
            return "+=" + Math.round(global.innerHeight * (config.pinDistanceVh / 100));
          },
          scrub: config.scrub,
          pin: stage,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }

    function refreshMotionStrategy() {
      if (destroyed) return;
      clearRuntimeTweens();
      setStaticMode(isStaticMode());

      if (isStaticMode()) {
        applyStaticLayers(Math.round(playhead.frame));
        setupMobileParallaxIfNeeded();
      } else {
        setupDesktopScrub();
      }

      if (global.ScrollTrigger && typeof global.ScrollTrigger.refresh === "function") {
        global.ScrollTrigger.refresh();
      }
    }

    function markMachineFatalError() {
      hasMachineError = true;
      root.classList.add("msth-error");
      refreshMotionStrategy();
    }

    function onMachineFrameLoaded(index, image) {
      if (destroyed) return;
      machineImages[index] = image;
      machineLoadedCount += 1;
      machineCompletedCount += 1;
      updateProgress();

      var shouldRefresh = false;

      if (index === 0) {
        staticMachine.src = image.src;
        shouldRefresh = true;
      }

      if (isStaticMode() && !staticMachine.getAttribute("src")) {
        shouldRefresh = true;
      }

      if (machineLoadedCount === 2) {
        shouldRefresh = true;
      }

      if (shouldRefresh) {
        refreshMotionStrategy();
      }

      if (machineCompletedCount === config.frameCount) {
        if (machineLoadedCount < 2) markMachineFatalError();
        else refreshMotionStrategy();
      }
    }

    function onMachineFrameError() {
      if (destroyed) return;
      machineCompletedCount += 1;
      if (machineCompletedCount === config.frameCount && machineLoadedCount < 2) {
        markMachineFatalError();
      }
    }

    function onBgFrameLoaded(index, image) {
      if (destroyed) return;
      bgImages[index] = image;
      bgLoadedCount += 1;
      bgCompletedCount += 1;

      if (index === 0) {
        staticBg.src = image.src;
      }

      if (!isStaticMode() && machineLoadedCount >= 1) {
        drawComposite(Math.round(playhead.frame));
      } else {
        applyStaticLayers(Math.round(playhead.frame));
      }
    }

    function onBgFrameError() {
      if (destroyed) return;
      bgCompletedCount += 1;
    }

    function preloadMachineFirstFrame() {
      var preview = new Image();
      preview.decoding = "async";
      preview.onload = function onLoad() {
        onMachineFrameLoaded(0, preview);
      };
      preview.onerror = function onError() {
        machineCompletedCount = Math.max(1, machineCompletedCount);
        markMachineFatalError();
      };
      preview.src = framePath(config.framePathPattern, 1);
    }

    function preloadBgFirstFrame() {
      var preview = new Image();
      preview.decoding = "async";
      preview.onload = function onLoad() {
        onBgFrameLoaded(0, preview);
      };
      preview.onerror = onBgFrameError;
      preview.src = framePath(config.bgFramePathPattern, 1);
    }

    function startMachineBulkLoad() {
      if (startedMachineBulkLoad || destroyed || prefersReducedMotion) return;
      startedMachineBulkLoad = true;

      var i;
      for (i = 1; i < config.frameCount; i += 1) {
        (function loadAt(frameIndex) {
          var image = new Image();
          image.decoding = "async";
          image.onload = function onLoad() {
            onMachineFrameLoaded(frameIndex, image);
          };
          image.onerror = onMachineFrameError;
          image.src = framePath(config.framePathPattern, frameIndex + 1);
        })(i);
      }
    }

    function startBgBulkLoad() {
      if (startedBgBulkLoad || destroyed || prefersReducedMotion) return;
      startedBgBulkLoad = true;

      var i;
      for (i = 1; i < config.bgFrameCount; i += 1) {
        (function loadAt(frameIndex) {
          var image = new Image();
          image.decoding = "async";
          image.onload = function onLoad() {
            onBgFrameLoaded(frameIndex, image);
          };
          image.onerror = onBgFrameError;
          image.src = framePath(config.bgFramePathPattern, frameIndex + 1);
        })(i);
      }
    }

    function onResize() {
      if (resizeRaf) global.cancelAnimationFrame(resizeRaf);
      resizeRaf = global.requestAnimationFrame(function resizeTick() {
        resizeCanvas();
        updateCardsMetrics();
        applyStaticObjectPosition();
        if (!isStaticMode()) {
          drawComposite(Math.round(playhead.frame));
        }
        refreshMotionStrategy();
      });
    }

    function onMotionPreferenceChanged() {
      prefersReducedMotion = motionQuery.matches;
      refreshMotionStrategy();
      if (!prefersReducedMotion) {
        startMachineBulkLoad();
        startBgBulkLoad();
      }
    }

    if (typeof global.IntersectionObserver === "function") {
      observer = new global.IntersectionObserver(
        function onIntersection(entries) {
          if (!entries.length || !entries[0].isIntersecting) return;
          startMachineBulkLoad();
          startBgBulkLoad();
          if (observer) observer.disconnect();
        },
        { rootMargin: "240px" }
      );
      observer.observe(root);
    } else {
      startMachineBulkLoad();
      startBgBulkLoad();
    }

    removeMotionListener = addMediaListener(motionQuery, onMotionPreferenceChanged);
    global.addEventListener("resize", onResize, { passive: true });

    resizeCanvas();
    updateCardsMetrics();
    applyStaticObjectPosition();
    preloadMachineFirstFrame();
    preloadBgFirstFrame();
    refreshMotionStrategy();

    var instance = {
      destroy: function destroy() {
        if (destroyed) return;
        destroyed = true;

        if (observer) observer.disconnect();
        if (removeMotionListener) removeMotionListener();
        global.removeEventListener("resize", onResize);

        clearRuntimeTweens();
        if (resizeRaf) global.cancelAnimationFrame(resizeRaf);

        root.classList.remove("msth-host", "msth-error", "msth-static-mode");
        root.style.removeProperty("--msth-pin-distance");
        root.style.removeProperty("--msth-left-col");
        root.style.removeProperty("--msth-right-col");
        root.innerHTML = originalHtml;
        delete root.__msthInstance;
      },
    };

    root.__msthInstance = instance;
    return instance;
  };
})(window, document);
