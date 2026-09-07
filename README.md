# SIR-ABAHO — Videographer Portfolio

A single-page cinematic portfolio for Sir Abaho. Gold-on-black, film-grade
transitions, 3D hero title, and a clean light section for the web-dev side.

## View it

Just open `index.html` in a browser (double-click it). Or run a local server:

```
npx serve .
```

## Add your videos (the important one)

Open `js/videos.js` — it has plain instructions at the top.

- Each block in the `REELS` list is one video card.
- Copy a block, change the details, paste the link into `link: "..."`.
- Leave `link: ""` and the card shows **SOON** until you paste a link.
- Works with TikTok, Instagram and YouTube links — the right icon shows
  automatically based on the `platform` field.

## Edit your stats and client messages

Open `js/site-data.js` — plain instructions at the top.

- `stats` is the numbers row in the **BEHIND THE LENS** section (reels shot,
  businesses, platforms, location, delivery). Change a number or sentence.
- `reviews` is the **CLIENT LOVE** section — paste real WhatsApp / Instagram
  messages from clients. Each entry takes `text`, `name`, `business` and
  `platform` (`"whatsapp"` or `"instagram"` for the colored chip). The two
  entries already there are samples — replace them.

## Change the phone / WhatsApp number

The number +256 768 715 617 is used in a few places. To change it, search
`index.html` for `256768715617` and replace it (digits only, no `+`).

## Logo

The chosen mark is **FOG CIRCLE** — the gold figure in a glowing fog halo
(concept 04). It's wired into the nav, preloader, footer, favicon and the
reel cards. To change the logo, edit every copy in `index.html` (nav,
preloader, favicon) and the `FIG` watermark in `js/main.js` — they must
stay identical.

## Deploy (make it live)

1. Go to https://app.netlify.com/drop (or Vercel's drag-and-drop).
2. Drag this whole folder in.
3. Done — you get a live link. No build step needed.

## Client review form (`/review`)

A standalone 2-question form at `sir-abaho-portfolio.vercel.app/review` —
send that link to clients to capture quick feedback. Responses land in your
inbox via FormSubmit (configured in `review/index.html`).
See the "Review page" note in `BWAT.md` for activation + removal steps.

## Tech

Plain HTML / CSS / JavaScript. No frameworks, no build step, no accounts
required. Fonts load from Google Fonts (Anton, Manrope, JetBrains Mono).
