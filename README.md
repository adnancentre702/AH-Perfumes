<div align="center">

AH Perfumes — Premium Fragrance Website

A production-quality, fully static luxury perfume website for **AH Perfumes**, a premium
fragrance house based in **Sargodha, Pakistan**. It showcases four signature scents —
**Khumra, Silver, Hillfiger and Wanted** — as an immersive, editorial, Awwwards-style
experience, with WhatsApp as the primary ordering channel.

</div>

---

## ✨ Features

- **Cinematic hero** with a smoke/light poster composited from the real product photo, a
  Three.js golden-dust particle layer, and video-ready markup (drop in an MP4 to enable).
- **Four perfume "chapters"** — each fragrance presented as its own scroll-driven section
  with bottle, packaging, description, fragrance notes, price and WhatsApp order button.
- **Interactive Fragrance DNA** — a WebGL particle cloud that re-forms across
  Top → Heart → Base as you scroll.
- **Packaging / unboxing** reveal, full **collection overview**, benefits, and a strong
  final **Order CTA**.
- **WhatsApp everywhere** — floating button (gentle periodic shake), plus per-product and
  general order buttons that open WhatsApp with a pre-filled message.
- **Owners contact** section with click-to-call and WhatsApp links.
- Fully **responsive** (1920 → 360px), **accessible** (semantic HTML, focus states,
  aria-labels, skip link), **SEO-ready** (title/description, Open Graph, Twitter, JSON-LD,
  favicon), and **performance-minded** (WebP images, lazy loading, reduced particles &
  pixel-ratio on mobile).
- Graceful fallbacks: **no WebGL → poster/CSS**, **no video → poster**, **no GSAP →
  IntersectionObserver reveals**, and full **`prefers-reduced-motion`** support.
- Uses the **normal browser cursor** (no custom cursor).

---

## 🧰 Technologies

HTML5 · CSS3 · Vanilla JavaScript · Three.js (WebGL) · GSAP + ScrollTrigger · SVG · WebP.
Third-party libraries are **vendored locally** in `js/vendor/` — no CDN or internet
connection is required at runtime (Google Fonts load online but degrade to system fonts).

---

## 📁 Folder structure

```
perfume-brand/
├── index.html
├── README.md
├── .gitignore
├── css/
│   ├── style.css          # core design system + components
│   ├── responsive.css     # breakpoints
│   └── animations.css     # reveal/animation primitives
├── js/
│   ├── products.js        # ⭐ EDIT THIS: config + product data
│   ├── interactions.js    # rendering, nav, WhatsApp wiring
│   ├── animations.js      # reveals + GSAP scroll effects
│   ├── three-scene.js     # hero + fragrance DNA WebGL
│   ├── main.js            # bootstrap, video fallback
│   └── vendor/            # three.min.js, gsap.min.js, ScrollTrigger.min.js
├── assets/
│   ├── images/            # logo + 4 bottles + 4 boxes (webp + jpg)
│   ├── hero/              # hero-poster, og-image, atmosphere
│   ├── textures/          # grain.png
│   ├── icons/             # favicon.svg / png / apple-touch-icon
│   └── models/            # (reserved)
└── data/
    └── products.sample.json  # reference copy of the product data
```

---

## ▶️ Run locally

**Easiest:** double-click `index.html` to open it in a browser.

**Recommended (so fonts/modules load cleanly), run any static server:**

```bash
# Python
python3 -m http.server 8080
# then visit http://localhost:8080
```

```bash
# Node
npx serve .
```

---

## ♿ Accessibility & performance notes

- Semantic landmarks, keyboard-navigable menu (Esc to close), visible focus rings, skip link.
- All imagery has descriptive `alt` text; decorative canvases are `aria-hidden`.
- Images are WebP with JPG fallback, lazy-loaded below the fold.
- WebGL particle counts and pixel-ratio are reduced on mobile; scenes pause off-screen and
  when the tab is hidden.

---

© AH Perfumes. Product photography and brand logo are property of AH Perfumes.
