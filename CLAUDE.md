# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Website for **Tomato Agency** — ค่าย Live VJ ของไทย. Built with **Eleventy (11ty)** — a static site
(no client framework). Multi-page + a Markdown blog. Lives on Cloudflare Pages.

Domain: `tomato.in.th`. Canonical hostname lives in `src/_data/site.js` (`url`). Still hardcoded in
`sw.js`, `_redirects`, `robots.txt`, `.well-known/security.txt` — grep `tomato.in.th` if it changes.

There's an `mcp-chrome/` folder next to this one on disk that's a different project. It's gitignored, leave it alone.

## Running it

```bash
npm install            # first time
npm run dev            # eleventy --serve → http://localhost:8088
npm run build          # → ./dist (this is what CF Pages runs)
npm run humanize:check # scan blog posts for AI clichés / over-claims
```

`dist/` is the build output (gitignored). `node_modules/` gitignored.

## Deploy = Cloudflare Pages (build step now required)

This repo used to be no-build (served root). It now builds with Eleventy. CF Pages project settings
must be: **Build command** `npm run build`, **Build output directory** `dist`. Then `git push` auto-deploys.
Or `npm run deploy` (build + `wrangler pages deploy dist`).

## How it's put together

- `eleventy.config.js` — passthrough copy (assets + CF config files), collections (`posts`, `categories`),
  filters (`thaiDate`, `isoDate`, `ymd`, `absUrl`, `readingTime`, `wordCount`, `limit`, `exclude`).
- `src/_data/site.js` — **single source of truth** for brand, URL, LINE/IG, header nav, footer nav.
- `src/_includes/base.njk` — the HTML shell + all `<head>` SEO + the global JSON-LD graph
  (Organization, WebSite+SearchAction, WebPage, BreadcrumbList). Layouts chain into it via `{{ content }}`.
- `src/_includes/layouts/page.njk` — generic page (breadcrumbs + content + CTA band).
- `src/_includes/layouts/post.njk` — blog article (cover, meta, author box, related, BlogPosting + FAQ schema).
- `src/index.njk` — homepage (splash + hero + sections + worktypes links + latest posts + FAQ + CTA).
- `src/pages/*.njk` — keyword landing pages: `vj`, `sangkat`, `ngan-tob-chat`, `live-bigo`, `ngan-online`,
  `idol-plus`, plus `faq`, `contact`, `privacy`. Each has its own permalink + FAQ JSON-LD.
- `src/blog/*.md` — posts. Shared front matter in `src/blog/blog.11tydata.js` (layout, `tags: post`,
  permalink, computed readingTime/wordCount/breadcrumbs/author/ogImage).
- `src/blog.njk` `/blog/`, `src/blog-category.njk` `/blog/category/<slug>/`, `src/sitemap.njk`,
  `src/feed.njk` (RSS), `src/404.njk`.

Brand colors and fonts are CSS variables at the top of `assets/css/style.css` — `--red`, `--pink`, `--blue`,
`--cream`, `--font-serif`, `--font-display`, `--font-thai`. New component styles live in `assets/css/pages.css`.

Section titles are bilingual: `<span class="display-serif">italic english</span>` +
`<span class="display-sans">lowercase english</span>`. **Don't put Thai inside `.display-serif`** — italic
serif fonts butcher Thai glyphs. Thai goes in `.section-lead`, `.lp-title`, prose, or body text (IBM Plex Sans Thai).

Service worker is network-first for HTML, stale-while-revalidate for assets. **Bump `VERSION` in `sw.js`** when
you change cached files (and update its `CORE_ASSETS` list).

## Content rules — read before editing copy

The user pushed back on every one of these. Don't undo them:

- **Live VJ is the core service.** Don't reposition the agency as anything else. **IDOL+** is the
  **live-streaming app** the agency currently promotes as its main platform (`/idol-plus/`) — full name
  *IDOL+ Global & Celeb Live* (by YOME Technology). Official IG `@idolplus.th`. App icon at
  `assets/img/idol-plus-logo.webp` (official current logo from idolplus.tv); App Store id `6673904841`,
  Google Play `com.xhxy.tala`. Promote it with the
  logo + download buttons. It is an **app**, NOT a "growth program" (older copy wrongly called it that).
- **No money in the pitch.** No income numbers, no follower counts, no "1,000 บาท/post", no guarantees. Don't
  invent stats. State platform-income honestly ("ไม่การันตีตัวเลข ขึ้นกับความสม่ำเสมอและนโยบายแพลตฟอร์ม").
- **"พี่ ๆ ทีมงาน"** for the team (never "ทีมโค้ช"); **"น้อง ๆ"** for applicants. Friendly, a bit cute —
  soft particles `นะ` / `จ้า` are fine.
- **"Tomato Agency"** with a capital T when written out. Lowercase `tomato agency` only in the wordmark image
  and bilingual display titles.
- LINE handle `@tomatoagency` (URL `https://lin.ee/WSxsQuG`). Instagram `@tomatoagency.th`. Domain `tomato.in.th`.
  Three different strings — don't blanket replace.

## Platform rule

**IDOL+ is the live app we feature on brand/main pages** (logo + download buttons). Do NOT over-emphasize
Bigo or any other specific live app on the homepage/brand — keep `/live-bigo/` and the other keyword pages
purely for **Google SEO indexing** (they still rank, just not headlined). **Blog articles MAY mention any app
including TikTok, Bigo, etc.** when it genuinely helps SEO (comparisons, catching search terms).

## Outbound links — always via shortlink

**Every link that leaves the site must go through a `go.tomato.in.th` shortlink first** (click tracking).
Don't hardcode raw external URLs in clickable `href`s. Current shortlinks:
`/tomato-line` (LINE), `/tomato-ig` (IG), `/idolplus` (App Store iOS), `/idolplus-android` (Google Play),
`/idolplus-ig` (IDOL+ IG), `/idolplus-web` (idolplus.tv). In `src/_data/site.js`, `line.short`/`ig.short`
hold the shortlinks (use these in links); `line.url`/`ig.url` keep the REAL profile URLs and are used ONLY
for JSON-LD `sameAs`/`contactPoint` (do NOT shorten structured-data URLs). `_redirects` social shortcuts
also route through the shortlinks. New external link → create a shortlink first via the shortlink service
(`POST https://go.tomato.in.th/api/v1/links`, Bearer key) then reference it.

## Trust / E-E-A-T

Keep the site credible: real LINE/IG, founding year, `/privacy/` (PDPA), author box on posts, honest copy.
Never fabricate numbers or testimonials with fake stats.

## Blog + covers

Adding a post = one `.md` in `src/blog/` + a 1200×630 cover in `assets/img/blog/`. See `docs/CONTENT-GUIDE.md`.
Covers are **original branded graphics** (no AI gen, no stock/stolen images) — generated from
`scripts/og-gallery.html` (brand gradient + hand-drawn SVG motif + existing logo) and screenshotted to PNG.
Build (`npm run build`) must stay pure Eleventy — covers are pre-generated & committed, NOT made during CF build.

**After a new post deploys to live, ping IndexNow** so Bing/Yandex/DuckDuckGo/Naver/Seznam recrawl instantly:
`npm run indexnow -- https://tomato.in.th/blog/<slug>/ / /blog/` (or `node scripts/indexnow-ping.mjs ...`).
Ownership key is the `{key}.txt` at repo root (passthrough → site root); the script auto-discovers it. Run
ONLY after the URL is live (IndexNow 403s if the key file/page isn't reachable yet). Google has no ping API —
rely on Search Console + the sitemap's `<lastmod>` for it.

## CF Pages stuff

`_headers` is short on purpose (HSTS-ish: CORP cross-origin + `Access-Control-Allow-Origin: *` so social
scrapers grab OG images; cache rules for index.html/sw.js). Don't add COOP/CSP/Permissions-Policy back without
a reason — CORP `same-origin` previously blocked FB/Twitter/LINE from fetching the OG image.

`_redirects` has vanity URLs (`/audition`,`/apply` → `/vj/`, `/line`, `/ig`) and `www → apex`. The old
SPA catch-all (`/* /index.html 200`) was removed — it's a real multi-page site now; CF serves `404.html`.

After deploying, social platforms cache old previews — re-scrape via Facebook Sharing Debugger / Twitter Card Validator.

## Logo files — don't mix these up

- **`assets/img/wordmark.png`** — wide italic `tomato agency` text. Header + footer (`.brand__logo`).
- **`assets/img/logo.png`** — round red tomato with `to/ma/to`. Splash, hero orbit, OG cover badge, all `assets/icons/`.
- **`assets/img/og-image.png`** — 1200×630 default social card (used when a page has no specific cover).
