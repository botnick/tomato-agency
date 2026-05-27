# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Landing page for **Tomato Agency** — ค่าย Live VJ ของไทย. Plain HTML/CSS/JS, no build, no framework. Lives on Cloudflare Pages, auto-deploys when `main` gets pushed.

Domain: `tomato.in.th`. If it ever changes, the hostname is hardcoded in `index.html`, `sitemap.xml`, `robots.txt`, `_redirects`, and the JSON-LD block — grep for it.

There's a `mcp-chrome/` folder next to this one on disk that's a totally different project. It's gitignored, leave it alone.

## Running it

```bash
python -m http.server 8088               # easiest
npx wrangler pages dev . --port 8788     # matches CF Pages behavior closer
```

Deploy = `git push`. CF Pages picks it up. Or `npx wrangler pages deploy . --project-name=tomato-agency` if you want to push without commits.

No tests, no linter. You verify by opening the page.

## How it's put together

It's a single page. Everything is in `index.html`. Sections show up in this order:

`splash → topbar → header → hero → about → manifesto → services → process → talent → voices → faq → cta → footer`

The nav (and footer nav, and `_redirects` vanity URLs) point to those section IDs. Rename a section, update those too.

Brand colors and fonts are CSS variables at the top of `style.css` — `--red`, `--pink`, `--blue`, `--cream`, `--font-serif`, `--font-display`. Use those, not raw hex.

Section titles are bilingual: `<span class="display-serif">italic english</span>` + `<span class="display-sans">lowercase english</span>`. **Don't put Thai inside `.display-serif`** — italic serif fonts (DM Serif Display, Italiana) butcher Thai glyphs. Thai goes in `.section-lead` or body text where it uses IBM Plex Sans Thai.

Service worker is stale-while-revalidate for assets, network-first for HTML. Bump `VERSION` in `sw.js` when you change cached files or old visitors will see stale stuff.

PWA manifest declares three shortcuts. The maskable icons reuse the regular icons — they already have enough padding.

## Logo files — don't mix these up

There are two logos. They look different and they're for different things:

- **`assets/img/wordmark.png`** — the wide italic `tomato agency` text. Goes in the header and footer (`.brand__logo`). That's it.
- **`assets/img/logo.png`** — the round red tomato fruit with `to/ma/to` stacked inside. Used in the splash, the hero orbit, and every icon under `assets/icons/` (favicons, apple-touch, PWA 192/512).
- **`assets/img/og-image.png`** — 1200×630 social card with both logos and a thin divider. Generated with PowerShell `System.Drawing` — the script is in git history if you need to regenerate.

If a task says "use the logo" without saying which, ask. I burned a whole session on this once.

## Content rules — read before editing copy

The user pushed back on every one of these. Don't undo them:

- **Live VJ is the core service.** Don't position the agency as anything else. No "ศิลปิน" or "ไอดอล" — those framings stay out. "Influencer" and "content creator" are allowed only as *optional growth paths* the team can support if a streamer asks, never as the agency's own offering.
- **No money in the pitch.** No "1,000 บาท/Post", no follower counts, no income claims. Don't invent stats.
- **"พี่ ๆ ทีมงาน"** for the team, never "ทีมโค้ช". The tone is friendly and a bit cute — `น้อง ๆ`, soft particles like `นะ` / `จ้า` are fine.
- **"Tomato Agency"** with a capital T when written out. Lowercase `tomato agency` only inside the wordmark image and the bilingual display titles.
- LINE handle is `@tomatoagency` (URL `https://lin.ee/WSxsQuG`). Instagram is `@tomatoagency.th`. The domain is `tomato.in.th`. Three different things, easy to mix up. The IG handle and the domain are **not** the same string — don't blanket replace.

## CF Pages stuff

`_headers` is short on purpose. HSTS, nosniff, Referrer-Policy, cache rules. That's it.

There used to be COOP/CORP/CSP/Permissions-Policy in there. The CORP `same-origin` blocked Facebook/Twitter/LINE/metatags.io from grabbing the OG image. Don't add them back without a reason. `/assets/*` has `Access-Control-Allow-Origin: *` so social scrapers work.

`_redirects` has vanity URLs (`/audition`, `/line`, `/ig`) and `www → apex`.

After deploying, social platforms cache the old preview. To force refresh: Facebook Sharing Debugger and Twitter Card Validator both have a re-scrape button.
