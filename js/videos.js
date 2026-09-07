/* ============================================================
   SIR-ABAHO — YOUR VIDEOS LIVE HERE
   ------------------------------------------------------------
   HOW TO ADD A VIDEO:
   1. Open this file in any text editor.
   2. Copy one full block between { } — from { to },
   3. Paste it after the last block, add a comma,
   4. Change the details, save, refresh the site.

   FIELDS:
   - title     : what shows on the card
   - client    : who it was for (or "Private Client")
   - category  : PRODUCT / SOCIALS / EVENT — the chip on the card
   - platform  : "tiktok", "instagram" or "youtube" — shows the icon
   - link      : paste the video link here. Leave "" and the card
                 shows "SOON" until you paste a link.
   - art       : the card's background colours — change to anything
   ============================================================ */

const REELS = [
  {
    title: "Test reel — TikTok embed",
    client: "Real client",
    category: "PRODUCT",
    platform: "tiktok",
    link: "https://www.tiktok.com/@polo_abaho/video/7664666054429248789",
    art: ["#3a2a05", "#140d03"]
  },
  {
    title: "Kitchenware — 30s product film",
    client: "Kitchenware Shop",
    category: "PRODUCT",
    platform: "tiktok",
    link: "",
    art: ["#3a2a05", "#140d03"]
  },
  {
    title: "Salon glow-up — cuts & colour",
    client: "Beauty Salon",
    category: "PRODUCT",
    platform: "instagram",
    link: "",
    art: ["#43190b", "#1a0d05"]
  },
  {
    title: "Barbershop — morning rush",
    client: "Barber Shop",
    category: "PRODUCT",
    platform: "tiktok",
    link: "",
    art: ["#2b1b0c", "#120c05"]
  },
  {
    title: "Estate tour — 4K walkthrough",
    client: "Real Estate",
    category: "BRAND FILM",
    platform: "youtube",
    link: "",
    art: ["#3d2a0a", "#181005"]
  },
  {
    title: "Birthday — the party film",
    client: "Private Client",
    category: "EVENT",
    platform: "instagram",
    link: "",
    art: ["#4a3406", "#1e1503"]
  },
  {
    title: "Hotel & airbnb — stay inspired",
    client: "Hotel / Airbnb",
    category: "BRAND FILM",
    platform: "youtube",
    link: "",
    art: ["#381e08", "#150a04"]
  }
];
