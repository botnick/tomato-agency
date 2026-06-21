# Tomato Agency — เว็บไซต์ (multi-page + blog)

เว็บไซต์ของ **Tomato Agency** — ค่าย Live VJ ของไทย รับสมัครวีเจไลฟ์สด.
สร้างด้วย **Eleventy (11ty)** เป็น static site ล้วน ไม่มี runtime framework deploy บน Cloudflare Pages.

[![Eleventy](https://img.shields.io/badge/built%20with-Eleventy-c41c23?style=flat-square)](https://www.11ty.dev/)
[![Deploy: Cloudflare Pages](https://img.shields.io/badge/deploy-Cloudflare%20Pages-c41c23?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![PWA](https://img.shields.io/badge/PWA-enabled-c41c23?style=flat-square)](https://web.dev/progressive-web-apps/)

## Stack

- **Eleventy 3 (ESM)** สร้าง HTML/CSS/JS แบบ static — ไม่มี client framework
- เทมเพลต Nunjucks + บทความ Markdown (เพิ่มโพสต์ = วางไฟล์ `.md` ไฟล์เดียว)
- PWA: `manifest.webmanifest` + service worker (network-first HTML, stale-while-revalidate assets)
- **SEO ระดับ Rank Math/Yoast**: title template, meta, canonical, OG + Twitter, article tags, hreflang,
  JSON-LD (Organization, WebSite+SearchAction, WebPage, BreadcrumbList, BlogPosting, FAQPage),
  XML sitemap (+image), RSS feed, breadcrumbs, reading time
- Cloudflare Pages: `_headers`, `_redirects`, `wrangler.toml`

## โครงสร้าง

```
.
├── eleventy.config.js          ตั้งค่า 11ty (passthrough, collections, filters)
├── package.json                สคริปต์ build/dev/humanize:check
├── src/
│   ├── _data/site.js           ข้อมูลแบรนด์ + เมนู (single source of truth)
│   ├── _includes/
│   │   ├── base.njk            โครง HTML + <head> SEO + JSON-LD
│   │   ├── layouts/page.njk    เลย์เอาต์หน้าทั่วไป (+ breadcrumb + CTA)
│   │   ├── layouts/post.njk    เลย์เอาต์บทความ (+ cover, author, related, schema)
│   │   └── partials/           topbar, header, footer, fab, breadcrumbs, cta-band
│   ├── index.njk               หน้าแรก
│   ├── pages/                  หน้า keyword: vj, sangkat, ngan-tob-chat, live-bigo,
│   │                           ngan-online, idol-plus, faq, contact, privacy
│   ├── blog.njk                หน้า list บทความ  (/blog/)
│   ├── blog-category.njk       หน้า category (/blog/category/<slug>/)
│   ├── blog/*.md               บทความ (+ blog.11tydata.js = layout/tags/computed)
│   ├── sitemap.njk             → /sitemap.xml
│   ├── feed.njk                → /feed.xml (RSS)
│   └── 404.njk
├── assets/                     css (style.css + pages.css), js, img (+ img/blog covers), icons
├── _headers _redirects robots.txt manifest.webmanifest sw.js browserconfig.xml .well-known/
├── docs/CONTENT-GUIDE.md       วิธีเขียนบทความ + humanize + เพิ่มโพสต์
└── scripts/                    og-gallery.html (สร้าง cover), humanize-check.mjs
```

ไฟล์ static (assets, _headers, _redirects, robots.txt, manifest, sw.js ฯลฯ) ถูก **passthrough-copy** ลง `dist/`

## รันในเครื่อง

```bash
npm install        # ครั้งแรก
npm run dev        # eleventy --serve ที่ http://localhost:8088
npm run build      # สร้างไฟล์ลง ./dist
npm run humanize:check   # สแกนกลิ่น AI / over-claim ในบทความ
```

## Deploy — Cloudflare Pages

> ⚠️ โปรเจกต์นี้ **มี build step แล้ว** (เดิมไม่มี) — ต้องตั้งค่า CF Pages ใหม่ครั้งเดียว

ใน Cloudflare dashboard → **Workers & Pages → tomato-agency → Settings → Build**:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

จากนั้น `git push` แล้ว CF Pages จะ build + deploy ให้เอง
หรือ deploy ตรง: `npm run deploy` (= build + `wrangler pages deploy dist`)

custom domain `tomato.in.th` ตั้งใน **Custom domains** ตามเดิม

## เพิ่มบทความใหม่

ดู [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md) — สรุป: วางไฟล์ `src/blog/<slug>.md` + cover 1200×630 แล้ว `npm run build`
sitemap / RSS / หน้า category / "บทความล่าสุด" หน้าแรก อัปเดตให้เองทั้งหมด

## OG covers (รูปปกบทความ — original ไม่ใช่ AI)

cover ทุกใบสร้างจาก `scripts/og-gallery.html` (กราฟิกแบรนด์ + motif SVG วาดเอง ไม่ขโมย ไม่ AI):
เปิดไฟล์นี้ในเบราว์เซอร์ที่ viewport กว้าง ≥ 1240px → screenshot แต่ละการ์ด (1200×630) → เซฟลง
`assets/img/blog/<slug>.png` ใช้เป็นทั้งรูป hero ในบทความและ OG image

## เปลี่ยนโดเมน canonical

โดเมนหลักอยู่ที่ `src/_data/site.js` (`url`) — แก้ที่เดียวกระจายทั้งเว็บ
ส่วนที่ยัง hardcode: `sw.js`, `_redirects`, `robots.txt`, `.well-known/security.txt` (grep `tomato.in.th`)

## กฎเนื้อหา / แบรนด์

อ่าน [`CLAUDE.md`](CLAUDE.md) — Live VJ เป็นบริการหลัก, ไม่กุตัวเลข/รายได้, "พี่ ๆ ทีมงาน"/"น้อง ๆ",
หน้าหลักพูดถึง Bigo Live + ไลฟ์สดทั่วไปเท่านั้น (บทความเอ่ยแอพอื่นได้เพื่อ SEO)
