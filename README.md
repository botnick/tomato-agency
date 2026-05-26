# Tomato Agency — Landing Page

Static, PWA-ready landing page for **Tomato Agency** — เอเจนซี่ดูแลวีเจไลฟ์สด (Live VJ) ของไทย.

[![Built with HTML/CSS/JS](https://img.shields.io/badge/stack-vanilla-c41c23?style=flat-square)](https://github.com/botnick/tomato-agency)
[![Deploy: Cloudflare Pages](https://img.shields.io/badge/deploy-Cloudflare%20Pages-c41c23?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![PWA](https://img.shields.io/badge/PWA-enabled-c41c23?style=flat-square)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-MIT-c41c23?style=flat-square)](#license)

## Stack

- HTML / CSS / JS (no framework, no build step required)
- PWA: `manifest.webmanifest` + service worker (stale-while-revalidate)
- Full SEO: Open Graph, Twitter cards, JSON-LD (Organization, WebSite, FAQPage, Service, BreadcrumbList)
- Cloudflare Pages friendly: `_headers`, `_redirects`, `wrangler.toml`

## Brand

- Colors: `#C41C23` red · `#FFB5CD` pink · `#FFFFFF` white · `#BAE2F7` blue
- Display type: DM Serif Display italic (close to **Manison**) + Manrope sans
- Thai body: IBM Plex Sans Thai
- Key elements: tomato · bow · lace · crown · heart · sparkle · trophy · berries

## Local preview

The site is fully static — open `index.html` directly, or use any static server:

```bash
# any one of:
npx serve .
python -m http.server 8000
npx wrangler pages dev .   # closest to Cloudflare Pages runtime
```

## Deploy — Cloudflare Pages

### Option A · Direct upload (no GitHub)

1. Install wrangler once: `npm i -g wrangler` (or use `npx wrangler`).
2. Authenticate: `npx wrangler login`.
3. From this folder:
   ```bash
   npx wrangler pages deploy . --project-name=tomato-agency
   ```
4. First run creates the project; subsequent runs deploy to production.

### Option B · GitHub integration

1. Push the contents of this folder to a GitHub repo.
2. In the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Settings:
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/`
   - **Root directory**: `/`
4. Add custom domain `tomato.in.th` in **Custom domains** once created.

## Project layout

```
.
├── index.html                  Landing page
├── manifest.webmanifest        PWA manifest
├── sw.js                       Service worker
├── robots.txt                  Crawler rules + sitemap pointer
├── sitemap.xml                 SEO sitemap
├── browserconfig.xml           Windows tile config
├── _headers                    CF Pages: cache + security headers
├── _redirects                  CF Pages: vanity URLs + www→apex
├── wrangler.toml               CF Pages project config
├── package.json                Dev scripts (wrangler)
├── .well-known/
│   └── security.txt
└── assets/
    ├── css/style.css           Brand stylesheet (mobile-first)
    ├── js/main.js              Splash, scroll reveal, counter, etc.
    ├── img/                    logo, og-image
    ├── icons/                  Favicons + PWA icons + apple touch
    └── patterns/               (reserved for future SVG patterns)
```

## What's included

- **Splash screen** — animated CI-brand splash with lace frame, bow, crown, sparkle, marquee ribbon.
- **Hero** — fluid wordmark, orbiting brand elements, marquee strip.
- **About / Stats / Services / Process / Talent / Voices / FAQ / CTA / Footer.**
- **PWA**: installable, with three shortcuts (Apply / Services / Contact). Maskable icons supported.
- **SEO**: `<title>`, meta description, OG, Twitter card, JSON-LD Organization + WebSite + FAQPage + Service + BreadcrumbList.
- **Accessibility**: skip link, focus rings, ARIA labels, `prefers-reduced-motion` respected.
- **Responsive**: mobile-first, tested across 320px → 1440px+ breakpoints.

## Update the canonical domain

Search-and-replace `https://tomato.in.th` in `index.html`, `sitemap.xml`, `robots.txt`, `_redirects`,
and the JSON-LD blocks if the production hostname changes.
