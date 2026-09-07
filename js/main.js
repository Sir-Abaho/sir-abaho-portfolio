/* ============================================================
   SIR-ABAHO — site engine
   Preloader · scene counter · hero parallax ·
   reels renderer · process line · stats · nav · menu
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Footer year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     PRELOADER → curtain lift
     ============================================================ */
  var preloader = $("#preloader");
  var preCount = $("#preCount");
  var preBar = preloader ? $(".preloader__bar i", preloader) : null;
  var loaded = false;

  function finishPreloader() {
    if (loaded) return;
    loaded = true;
    preloader.classList.add("is-done");
    setTimeout(function () {
      document.body.classList.add("is-loaded");
    }, 620);
    setTimeout(function () { preloader.setAttribute("aria-hidden", "true"); }, 1600);
  }

  if (preloader) {
    if (reduceMotion) {
      if (preCount) preCount.textContent = "100";
      if (preBar) preBar.style.width = "100%";
      setTimeout(finishPreloader, 250);
    } else {
      var t0 = performance.now();
      var DUR = 1500;
      (function tick(now) {
        var p = Math.min((now - t0) / DUR, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var n = Math.round(eased * 100);
        if (preCount) preCount.textContent = n;
        if (preBar) preBar.style.width = n + "%";
        if (p < 1) requestAnimationFrame(tick);
        else setTimeout(finishPreloader, 160);
      })(t0);
    }
    setTimeout(finishPreloader, 4200); // safety net
  } else {
    document.body.classList.add("is-loaded");
  }

  /* ============================================================
     REELS RENDERER  +  IN-PLACE MODAL PLAYER
     - Cards open a modal with the official platform embed
       (TikTok / Instagram / YouTube) instead of leaving the site.
     - TikTok thumbnails auto-fetched via oEmbed (CORS-friendly,
       no auth). Instagram: paste a `thumb` URL yourself.
     - Reduced-motion: modal fades only, no scale.
     ============================================================ */
  var ICONS = {
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.6 6.7a4.8 4.8 0 0 1-3.4-1.4 4.8 4.8 0 0 1-1.4-3.3h-3.3v13.4a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.3a6 6 0 0 0-.8-.1 6 6 0 1 0 6 6V9.9a7.9 7.9 0 0 0 4.8 1.6V8.2c-.6 0-1.3-.1-1.9-.4v3.4a7.9 7.9 0 0 1-4.8 1.6 5.9 5.9 0 0 1-1.2-.1v3.4c.4.1.8.1 1.2.1a6 6 0 0 0 6-6c0-.3 0-.6-.1-.9z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1m0-2.2C8.7 0 8.3 0 7 .1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.8-2.2 1.5C1.2 2.8.7 3.5.4 4.3.1 5.1-.1 6 0 7.2.1 8.5.1 8.9.1 12s0 3.5.1 4.8c.1 1.2.3 2.1.6 2.9.3.8.8 1.5 1.5 2.2.7.7 1.4 1.2 2.2 1.5.8.3 1.7.5 2.9.6 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.2-.1 2.1-.3 2.9-.6.8-.3 1.5-.8 2.2-1.5.7-.7 1.2-1.4 1.5-2.2.3-.8.5-1.7.6-2.9.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.2-.3-2.1-.6-2.9-.3-.8-.8-1.5-1.5-2.2C21.2 1.2 20.5.7 19.7.4c-.8-.3-1.7-.5-2.9-.6C15.5.1 15.1 0 12 0m0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4m0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.4-10.5a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12c0 1.9.2 3.9.5 5.8a3 3 0 0 0 2.1 2.2c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.2c.3-1.9.5-3.9.5-5.8s-.2-3.9-.5-5.8M9.6 15.6V8.4L15.8 12z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2m4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.2z"/></svg>'
  };
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>';
  var FIG = '<svg viewBox="0 0 400 400" aria-hidden="true"><defs><linearGradient id="rf-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d060" stop-opacity=".9"/><stop offset="1" stop-color="#c69000" stop-opacity="0"/></linearGradient><radialGradient id="rf-f" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#f5c518" stop-opacity=".5"/><stop offset="1" stop-color="#f5c518" stop-opacity="0"/></radialGradient></defs><g transform="translate(0 30) scale(2)"><g fill="url(#rf-g)"><path d="M72 170c5-28 11-42 22-49l6-2 6 2c11 7 17 21 22 49z"/><circle cx="100" cy="82" r="17"/><path d="M66 89a35 10 0 0 1 68 0z"/></g><circle cx="100" cy="100" r="86" fill="url(#rf-f)"/></g></svg>';
  var PLATFORM_NAME = { tiktok: "TikTok", instagram: "Instagram", youtube: "YouTube" };

  var grid = $("#reelGrid");
  var modal = $("#reelModal");
  var modalPlayer = $("#reelModalPlayer");
  var modalTitle = $("#reelModalTitle");
  var modalClient = $("#reelModalClient");
  var modalPlatform = $("#reelModalPlatform");
  var modalFallback = $("#reelModalFallback");
  var modalFallbackName = $("#reelModalFallbackName");
  var lastFocused = null;

  // Resolve a thumbnail: prefer `thumb` field, then oEmbed for TikTok, else gradient
  var thumbCache = Object.create(null);
  function resolveThumb(reel, cb) {
    if (!reel || !reel.platform) return cb(null);
    if (reel.thumb) return cb(reel.thumb);
    if (reel.platform !== "tiktok" || !reel.link) return cb(null);
    var key = reel.link;
    if (thumbCache[key]) return cb(thumbCache[key]);
    var endpoint = "https://www.tiktok.com/oembed?url=" + encodeURIComponent(reel.link);
    fetch(endpoint, { method: "GET" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var url = (j && j.thumbnail_url) || null;
        if (url) thumbCache[key] = url;
        cb(url);
      })
      .catch(function () { cb(null); });
  }

  // Apply thumbnail as a CSS background-image on the .reel__visual container.
  // Bypasses all <img> + opacity + crossOrigin complexity.
  function setCardThumb(visual, reel) {
    if (!visual) return;
    resolveThumb(reel, function (url) {
      if (!url) return;
      // Preload the image to verify it loads before applying as background
      var probe = new Image();
      probe.onload = function () {
        visual.style.setProperty("--thumb", "url(\"" + url + "\")");
        visual.classList.add("reel__visual--has-thumb");
      };
      probe.onerror = function () { /* keep gradient fallback */ };
      probe.src = url;
    });
  }

  function openReelModal(reel) {
    if (!modal || !modalPlayer) return;
    lastFocused = document.activeElement;
    modalPlayer.innerHTML = "";
    modalTitle.textContent = reel.title || "Reel";
    modalClient.textContent = reel.client || "";
    modalPlatform.textContent = PLATFORM_NAME[reel.platform] || "the platform";
    if (reel.link) {
      modalFallback.href = reel.link;
      modalFallbackName.textContent = PLATFORM_NAME[reel.platform] || "the platform";
      modalFallback.style.display = "";
    } else {
      modalFallback.style.display = "none";
    }

    // Build the embed inside the modal
    var embedUrl = reel.embed || buildEmbedUrl(reel);
    if (embedUrl) {
      var iframe = document.createElement("iframe");
      iframe.src = embedUrl;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("title", reel.title || "Embedded reel");
      iframe.className = "reel-modal__iframe";
      modalPlayer.appendChild(iframe);
    } else {
      modalPlayer.innerHTML = '<div class="reel-modal__empty">No embed available for this platform yet.</div>';
    }

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    // Focus the close button for keyboard users
    var closeBtn = modal.querySelector(".reel-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeReelModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    if (modalPlayer) modalPlayer.innerHTML = "";
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      try { lastFocused.focus(); } catch (e) {}
    }
  }

  function buildEmbedUrl(reel) {
    if (!reel || !reel.platform || !reel.link) return "";
    var link = reel.link;
    if (reel.platform === "tiktok") {
      // Accept full URL or just /video/<id>; emit the official embed
      var m = link.match(/\/video\/(\d+)/);
      var id = m ? m[1] : "";
      return id ? "https://www.tiktok.com/embed/v2/" + id + "?lang=en-US" : "";
    }
    if (reel.platform === "instagram") {
      // IG embed expects the /reel/<id>/ or /p/<id>/ URL
      return link.replace(/\?.*$/, "").replace(/\/$/, "") + "/embed";
    }
    if (reel.platform === "youtube") {
      // Accept watch?v= or youtu.be/
      var idm = link.match(/(?:v=|youtu\.be\/)([\w-]{6,})/);
      return idm ? "https://www.youtube.com/embed/" + idm[1] + "?autoplay=1&rel=0" : "";
    }
    return "";
  }

  if (grid && typeof REELS !== "undefined") {
    REELS.forEach(function (reel, i) {
      var card = document.createElement("article");
      card.className = "reel";
      card.style.setProperty("--g1", (reel.art && reel.art[0]) || "#3a2a05");
      card.style.setProperty("--g2", (reel.art && reel.art[1]) || "#140d03");

      var visual =
        '<div class="reel__visual">' +
        '<span class="reel__chip">' + (reel.category || "REEL") + "</span>" +
        '<span class="reel__platform">' + (ICONS[reel.platform] || ICONS.tiktok) + "</span>" +
        '<div class="reel__fig">' + FIG + "</div>" +
        '<span class="reel__num">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" +
        '<span class="reel__play">' + PLAY + "</span>" +
        (reel.link
          ? '<span class="reel__watch">WATCH</span>'
          : '<span class="reel__soon-tag">SOON</span>') +
        '<div class="reel__info"><b>' + (reel.title || "Untitled reel") + "</b><i>" + (reel.client || "") + "</i></div>" +
        "</div>";

      if (reel.link) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "reel__link";
        btn.setAttribute("aria-label", "Play " + (reel.title || "reel") + " here");
        btn.innerHTML = visual;
        (function (r, b) {
          b.addEventListener("click", function () { openReelModal(r); });
        })(reel, btn);
        card.appendChild(btn);
        // Wire the thumbnail against the .reel__visual container
        setCardThumb(btn.querySelector(".reel__visual"), reel);
      } else {
        var div = document.createElement("div");
        div.className = "reel__link is-soon";
        div.setAttribute("aria-label", (reel.title || "Reel") + " — video coming soon");
        div.innerHTML = visual;
        card.appendChild(div);
      }
      grid.appendChild(card);
    });
  }

  // Modal: close on backdrop, close button, ESC
  if (modal) {
    var closers = modal.querySelectorAll("[data-reel-close]");
    Array.prototype.forEach.call(closers, function (el) {
      el.addEventListener("click", closeReelModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeReelModal();
    });
  }

  /* ============================================================
     STATS + REVIEWS RENDERERS (fed from js/site-data.js)
     ============================================================ */
  var statGrid = $("#statGrid");
  if (statGrid && typeof SITE !== "undefined" && SITE.stats) {
    SITE.stats.forEach(function (s) {
      var card = document.createElement("div");
      card.className = "stat reveal";
      if (s.type === "note") {
        card.className += " stat--wide";
        card.innerHTML = "<span>" + s.label + "</span><p>" + s.text + "</p>";
      } else {
        if (s.type === "text") card.className += " stat--text";
        if (s.label && s.label.length > 30) card.className += " stat--long";
        card.innerHTML =
          (s.type === "text"
            ? "<b>" + s.value + "</b>"
            : '<b data-count="' + s.value + '"' + (s.suffix ? ' data-suffix="' + s.suffix + '"' : "") + ">0</b>") +
          "<span>" + s.label + "</span>";
      }
      statGrid.appendChild(card);
    });
  }

  var revGrid = $("#reviewGrid");
  if (revGrid && typeof SITE !== "undefined" && SITE.reviews) {
    SITE.reviews.forEach(function (r) {
      var p = r.platform === "instagram" ? "instagram" : "whatsapp";
      var card = document.createElement("article");
      card.className = "review reveal";
      card.innerHTML =
        '<span class="review__platform review__platform--' + p + '">' +
        ICONS[p] +
        "VIA " + p.toUpperCase() +
        "</span>" +
        '<p class="review__text">' + r.text + "</p>" +
        '<footer class="review__meta"><b>' + r.name + "</b><i>" + (r.business || "") + "</i></footer>";
      revGrid.appendChild(card);
    });
  }

  /* ============================================================
     SCROLL — progress bar, letterbox, hero fade, process line
     ============================================================ */
  var hero = $("#home");
  var heroInner = hero ? $("#home .hero__inner") : null;
  var heroStage = $("#heroStage");
  var progress = $(".progress i");
  var processSec = $("#process");
  var vh = window.innerHeight || 800;

  var parX = 0, parY = 0;

  function onScroll() {
    var y = window.scrollY;
    document.body.classList.toggle("is-scrolled", y > 30);

    var doc = document.documentElement;
    var max = doc.scrollHeight - vh;
    if (progress && max > 0) progress.style.width = Math.min((y / max) * 100, 100) + "%";

    if (hero) {
      var p = Math.min(y / vh, 1);
      if (heroInner) {
        heroInner.style.opacity = String(Math.max(1 - p * 1.2, 0));
        heroInner.style.transform = "translateY(" + (p * 70).toFixed(1) + "px)";
      }
    }

    if (processSec) {
      var rect = processSec.getBoundingClientRect();
      var total = processSec.offsetHeight - vh;
      var cur = Math.min(Math.max(-rect.top, 0), total);
      if (total > 0) processSec.style.setProperty("--proc", (cur / total) * 100 + "%");
    }
  }

  /* ============================================================
     HERO PARALLAX (mouse) — subtle tilt on the title stage
     ============================================================ */
  if (hero && heroStage && finePointer && !reduceMotion) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      parX = (e.clientX - r.left) / r.width - 0.5;
      parY = (e.clientY - r.top) / r.height - 0.5;
      heroStage.style.transform =
        "rotateY(" + (parX * 7).toFixed(2) + "deg) rotateX(" + (parY * -5).toFixed(2) + "deg)";
    });
    hero.addEventListener("mouseleave", function () {
      parX = 0; parY = 0;
      heroStage.style.transform = "";
    });
  }

  /* ============================================================
     REVEALS + SCENE COUNTER + STAGES + STATS
     ============================================================ */
  function observeOnce(els, cls, options) {
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add(cls); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add(cls);
          obs.unobserve(en.target);
        }
      });
    }, options);
    els.forEach(function (el) { obs.observe(el); });
  }

  // reveals (hero reveals are gated by body.is-loaded in CSS instead)
  observeOnce($$(".reveal").filter(function (el) { return !el.closest(".hero"); }), "is-in", { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  // scene counter — flash when the active scene changes
  var counter = $(".scene-counter");
  if (counter && "IntersectionObserver" in window) {
    var sceneObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          counter.textContent = "SCENE " + en.target.getAttribute("data-scene") + "/08";
          counter.classList.add("is-live");
          setTimeout(function () { counter.classList.remove("is-live"); }, 800);
        }
      });
    }, { rootMargin: "-42% 0px -52% 0px" });
    $$("section[data-scene]").forEach(function (s) { sceneObs.observe(s); });
  }

  // process stages light up as they cross the centre
  observeOnce($$(".stage"), "is-live", { threshold: 0.3, rootMargin: "-40% 0px -40% 0px" });

  // stat counters
  var statEls = $$("[data-count]");
  function statFinal(el) {
    return el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
  }
  if (reduceMotion) {
    statEls.forEach(function (el) { el.textContent = statFinal(el); });
  } else if ("IntersectionObserver" in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        countObs.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var t0 = performance.now();
        var DUR = 1300;
        (function step(now) {
          var p = Math.min((now - t0) / DUR, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.5 });
    statEls.forEach(function (el) { countObs.observe(el); });
  } else {
    statEls.forEach(function (el) { el.textContent = statFinal(el); });
  }

  /* ============================================================
     NAV + MOBILE MENU
     ============================================================ */
  var burger = $("#burger");
  var mobileMenu = $("#mobileMenu");
  if (burger && mobileMenu) {
    function setMenu(open) {
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobileMenu.classList.toggle("is-open", open);
      mobileMenu.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("menu-open", open);
    }
    burger.addEventListener("click", function () {
      setMenu(!burger.classList.contains("is-open"));
    });
    $$("a", mobileMenu).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* ============================================================
     LISTENERS
     ============================================================ */
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }
  }, { passive: true });
  onScroll();
})();
