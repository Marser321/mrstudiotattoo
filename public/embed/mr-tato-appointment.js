/* global window, document */
(function setupMrTatoAppointment(global, doc) {
  "use strict";

  var API_NAME = "initMrTatoAppointment";

  var DEFAULTS = {
    rootSelector: "#mr-tato-appointment",
    ghlCalendarUrl: "",
    title: "Reserva tu sesión",
    subtitle: "Selecciona el mejor día y hora. El estudio te está esperando.",
    /* Array of image URLs — the actual tattoo art JPGs */
    artImages: [],
    /* Seconds each image stays visible before crossfading to the next */
    displayDuration: 10,
    /* Seconds for the fade transition */
    fadeDuration: 3,
  };

  /* ── helpers ──────────────────────────────────────────────────────────── */
  function merge(defaults, overrides) {
    var out = {};
    var k;
    for (k in defaults) out[k] = defaults[k];
    if (overrides && typeof overrides === "object") {
      for (k in overrides) out[k] = overrides[k];
    }
    return out;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── markup ──────────────────────────────────────────────────────────── */
  function buildHTML(cfg) {
    var cal = cfg.ghlCalendarUrl
      ? '<iframe id="msta-iframe" src="' + esc(cfg.ghlCalendarUrl) +
        '" scrolling="yes"></iframe>'
      : '<div style="padding:3rem;text-align:center;color:#ef4444">Configurá la URL del calendario GHL.</div>';

    return (
      /* Left art panel — images will be injected here by JS */
      '<div class="msta-art-panel -left" id="msta-panel-left"></div>' +
      /* Right art panel */
      '<div class="msta-art-panel -right" id="msta-panel-right"></div>' +
      /* Center */
      '<div class="msta-content">' +
        '<div class="msta-header">' +
          '<h1>' + esc(cfg.title) + '</h1>' +
          '<p>' + esc(cfg.subtitle) + '</p>' +
        '</div>' +
        '<div class="msta-glass">' +
          '<div class="msta-loader" id="msta-loader"><div class="msta-spinner"></div></div>' +
          cal +
        '</div>' +
      '</div>'
    );
  }

  /* ── image rotation engine ───────────────────────────────────────────── */
  function createRotator(panelEl, images, displayMs, fadeMs, startOffset) {
    if (!images.length) return;

    // Pre-create all <img> elements and append them to the panel
    var imgEls = images.map(function (src) {
      var img = doc.createElement("img");
      img.className = "msta-art-img";
      img.src = src;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.draggable = false;
      panelEl.appendChild(img);
      return img;
    });

    var current = startOffset % images.length;
    var cycleMs = displayMs + fadeMs;

    function show(index) {
      imgEls.forEach(function (el, i) {
        if (i === index) {
          el.classList.add("-visible");
        } else {
          el.classList.remove("-visible");
        }
      });
    }

    // Start after a small delay
    global.setTimeout(function () {
      show(current);
      global.setInterval(function () {
        current = (current + 1) % images.length;
        show(current);
      }, cycleMs);
    }, 400 + startOffset * 1500); // stagger left/right slightly
  }

  /* ── iframe loaded handler ───────────────────────────────────────────── */
  function watchIframe(root) {
    var iframe = root.querySelector("#msta-iframe");
    var loader = root.querySelector("#msta-loader");
    if (!iframe || !loader) return;
    iframe.addEventListener("load", function () {
      loader.classList.add("-hidden");
    });
  }

  /* ── public API ──────────────────────────────────────────────────────── */
  global[API_NAME] = function initMrTatoAppointment(userCfg) {
    var cfg = merge(DEFAULTS, userCfg);
    var root = doc.querySelector(cfg.rootSelector);
    if (!root) throw new Error("Root not found: " + cfg.rootSelector);

    root.classList.add("msta-host");
    root.innerHTML = buildHTML(cfg);

    watchIframe(root);

    var images = Array.isArray(cfg.artImages) ? cfg.artImages : [];
    if (!images.length) return; // nothing to rotate

    var displayMs = Math.max(2000, (cfg.displayDuration || 10) * 1000);
    var fadeMs    = Math.max(500,  (cfg.fadeDuration || 3) * 1000);

    var leftPanel  = root.querySelector("#msta-panel-left");
    var rightPanel = root.querySelector("#msta-panel-right");

    // Left panel shows images in order, right panel starts offset by half the array
    var rightOffset = Math.floor(images.length / 2);
    if (rightOffset === 0 && images.length > 1) rightOffset = 1;

    createRotator(leftPanel,  images, displayMs, fadeMs, 0);
    createRotator(rightPanel, images, displayMs, fadeMs, rightOffset);
  };

})(
  typeof window !== "undefined" ? window : this,
  typeof document !== "undefined" ? document : null
);
