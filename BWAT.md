# BWAT.md

This file provides guidance to Bwat when working with code in this repository.

## Tech Stack

- Plain HTML / CSS / vanilla JavaScript. No framework, no build step, no package.json, no dependencies.
- No Three.js / WebGL — the hero 3D fog figure was removed (was `js/scene.js` + `js/vendor/three.min.js`, both deleted). See Architecture Notes.
- Fonts from Google Fonts: Anton (display), Manrope (body), JetBrains Mono (mono labels).
- Deployment: drag the folder into Netlify Drop or Vercel — static, nothing to build.

## Brand Identity

All tokens live in `:root` in [css/style.css](css/style.css) (lines 7–28). Use the variables, never raw hex, except in `.web` (light) section which has its own hardcoded palette.

**Colors**:
- Page background: `--black: #060504`
- Card / panel: `--ink: #0b0906`, raised panel: `--ink-2: #120e07`
- Text: `--text: #ece7da` (warm white); secondary `--muted: #a89c82`; tertiary `--faint: #6f6552`
- Brand gold: `--gold: #f5c518`; light gold `--gold-hi: #ffe37a`; dark gold `--gold-lo: #a37400`
- Hairlines: `--line: rgba(245, 197, 24, .16)`; gradients `--grad-gold` and `--grad-title` (gold vertical sweep used for gradient-text via `background-clip: text`)
- WhatsApp green: `--wa: #25D366`, `--wa-deep: #128C7E`; Instagram pink: `--ig: #E1306C`
- Light `.web` section (intentional contrast): background `#f4efdf`, text `#171207`, card bg `#fffdf7`

**Typography**:
- Display / headings: `'Anton', sans-serif` (`--font-display`) — uppercase, tight line-height
- Body: `'Manrope', sans-serif` (`--font-body`)
- Mono labels / slate text: `'JetBrains Mono', monospace` (`--font-mono`) — used for nav, buttons, section meta, chips

**Geometry**:
- Border radius: `0` on all dark-theme buttons and cards (sharp, cinematic). Only the light `.web` cards use radius (10px cards, 8px number badges). Respect this split.
- Spacing: fluid via `clamp()` — `--pad-x: clamp(20px, 5vw, 60px)`, `--pad-y: clamp(90px, 13vh, 170px)`. Use clamp for any new sizing.
- Letterbox: `--lb-h: clamp(14px, 3vh, 42px)` fixed bars top/bottom that collapse on scroll.

**Visual language**: Dark luxury noir — gold on black, film-grade motion (letterbox, scene counter, reveal fades), sharp corners, film-grain overlay, drift fog. One deliberately light cream section (`.web`) breaks the dark theme on purpose.

## Coding Conventions

- **BEM naming**: `block__element--modifier` (e.g. `.nav__links`, `.btn--gold`). Follow it for new markup/CSS.
- **CSS**: all shared tokens in `:root` custom properties; add new tokens there, not inline. Section banners are commented `/* ============ SECTION ============ */`.
- **JS**: `js/main.js` is an ES5-style IIFE (`(function(){ "use strict"; ... })()`, `var` only, no imports). Keep it dependency-free and matching that style. `js/videos.js` is a plain `const REELS = [...]` and `js/site-data.js` is a plain `const SITE = { stats, reviews }` — content data only, no logic.
- **Script order matters**: `videos.js` and `site-data.js` must load before `main.js` (main.js reads the globals `REELS` and `SITE`, each guarded by `typeof X !== "undefined"`).
- **Motion**: every animation/transition must respect `prefers-reduced-motion` — CSS has a media query forcing elements visible/static, and main.js checks `reduceMotion` before running preloader, parallax, stat counters, and the reveals. New animations need both.
- **Accessibility**: `aria-hidden`, `aria-label`, skip link, focus-visible gold outline, and an `html.no-js` CSS fallback are all established patterns. New UI should include them.

## Architecture Notes

- Single-page site; `index.html` holds all markup (sections + inline SVG logo marks), `css/style.css` all styles, `js/videos.js` (reels), `js/site-data.js` (stats + reviews) the content, `js/main.js` the engine. Content is only ever edited in `videos.js`, `site-data.js` and `index.html`.
- **Reveal system**: elements with `.reveal` start hidden in CSS; `main.js` adds `.is-in` via IntersectionObserver as they scroll into view. Each `<section>` carries `data-scene="01"…"08"` for the scene counter (contact is `08` — "FINAL SCENE"). The sticker-peel system (`data-peel`, `updatePeels()`, `--peel-x`) and the 3D hero scene were removed — a tombstone comment in style.css marks the spot if we bring them back.
- **Body state classes** (gated in JS, styled in CSS): `is-loaded` (preloader done — unlocks hero title rise), `is-scrolled` (collapses letterbox, gives nav blurred background), `menu-open` (scroll lock when mobile menu open).
- **Reels rendering**: `main.js` renders each `REELS` entry into `#reelGrid` as a card; the `art` array becomes `--g1`/`--g2` CSS vars for the card gradient. An empty `link` renders a non-clickable `.is-soon` card.
- **Stats + reviews rendering**: `main.js` renders `SITE.stats` into `#statGrid` (types: `count` animated + optional `suffix`, `text` static, `note` full-width card) and `SITE.reviews` into `#reviewGrid` (chips colored via `--wa`/`--ig`). The stat cards carry a two-pseudo sweep reaction: `.stat::before` is the one-shot reveal sweep (gated on `.is-in`, staggered via `--sweep-delay`), `.stat::after` the transition-based hover sweep. Reduced-motion block must keep the `.stat::before { animation: none !important; }` kill (its delay isn't zeroed globally).
- **Hero figure**: removed — no 3D scene, no SVG figure. The hero is the title + text over the gold fog blobs (`.hero__fog`). `js/scene.js` and `js/vendor/three.min.js` were deleted; `window.SA3D` and the `sa-loaded` event no longer exist — don't call them from main.js.

## Commands

- Local preview: `npx serve .` — or just double-click `index.html`. There is no build, test, or lint step.

## Gotchas

- **Phone number**: `256768715617` (digits only) is duplicated across `index.html` in `wa.me/` links, `tel:` links, and aria-labels. To change it, search-replace `256768715617` in `index.html` only — don't reformat with `+` or spaces in the hrefs.
- **Scene counter**: the `/08` total is hardcoded twice — the initial "SCENE 01/08" in index.html and the `counter.textContent` template in main.js (line ~237). Adding or removing a section with `data-scene` requires updating both.
- **Logo mark (FOG CIRCLE — chosen)**: the mark is a gold-gradient figure in a radial fog halo (concept 04 — "The figure in a fog halo with the SA mark"). The full badge (figure + halo + `SA` monogram) appears in the preloader and the favicon data-URI in `<head>`; the figure + halo only (no SA — unreadable at that size) appears in the nav, the footer badge, and the reels watermark (`FIG` in main.js, a 400-viewBox `translate(0 30) scale(2)` variant). Every copy must be kept in sync — they share the same figure paths (`M72 170c5-28 11-42 22-49l6-2 6 2…`, head `circle cx=100 cy=82 r=17`, hat `M66 89a35 10 0 0 1 68 0z`) and gradients (`#ffe37a`→`#a37400` linear, `#f5c518` radial fog). The old plain fog-figure mark was fully replaced; don't reintroduce the pre-navigation copies.
- **Contact socials**: the Instagram/TikTok/YouTube/LinkedIn links in the contact section are `href="#"` placeholders — not wired to real profiles yet. A `<!-- SOCIAL LINKS -->` comment marks the four paste slots.
- **Peel system (removed)**: sections no longer hide or peel — they render flat. New sections only need `data-scene` (for the scene counter). If the peel ever returns, don't re-add `clip-path` hiding to sections without the `.is-in` reveal logic, or the site can load black.
- **`.web` section is intentionally light** — cream background, dark text, rounded cards. Do not "fix" it to match the dark theme; the dark/light contrast is a deliberate design choice.
- **Reel platforms**: `platform` in `videos.js` must be exactly `"tiktok"`, `"instagram"`, or `"youtube"` — anything else silently falls back to the TikTok icon.
- **Reel modal (in-place player)**: clicking a reel card now opens a modal with the platform's official embed instead of leaving the site. `main.js` derives the embed URL from `link` + `platform` (TikTok `/embed/v2/<id>`, IG `/embed`, YouTube `/embed/<id>?autoplay=1`). `thumb` field is optional — if set it's used directly; otherwise TikTok thumbnails are auto-fetched via `https://www.tiktok.com/oembed?url=…` (results cached in memory for the session). Instagram oEmbed was deprecated by Meta in 2024 and won't work — for IG reels, paste a `thumb` URL yourself (right-click the video on IG → copy image address works in most browsers). Close the modal with the X button, ESC, or by clicking the backdrop. **To revert to "open in new tab"**: delete the `<!-- REEL MODAL -->` block at the bottom of `index.html`, delete the `/* REEL MODAL */` and `/* REEL THUMBNAIL */` blocks at the bottom of `css/style.css`, and replace the entire `REELS RENDERER + IN-PLACE MODAL PLAYER` block in `js/main.js` with the old version (git has it).
- **Review platforms**: `platform` in `site-data.js` reviews must be exactly `"whatsapp"` or `"instagram"` — anything else silently falls back to the WhatsApp chip.
- **Review page (`review/index.html`)** — a standalone 2-question client-feedback form, not linked from the nav. Served at `/review` (folder layout — Vercel serves the `index.html` automatically, so the shareable link is `sir-abaho-portfolio.vercel.app/review`, no `.html`). Posts to `formsubmit.co/paulabaho747@gmail.com`. **Activation**: the first submission triggers a confirmation email from FormSubmit to that address — click the link once to start receiving responses. No data is stored on the portfolio's own server. **To remove entirely** (once enough reviews are collected): delete the `review/` folder and the `/* REVIEW PAGE */` block at the bottom of `css/style.css`. No other file references it. `<meta name="robots" content="noindex">` keeps it out of search engines.
