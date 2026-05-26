# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Public landing page for **Tomato Agency** — a Live VJ agency in Thailand. Static HTML/CSS/JS (no build step), PWA-enabled, designed to deploy to Cloudflare Pages from this repo's `main` branch.

Production domain: **`tomato.in.th`** (search-and-replace in `index.html`, `sitemap.xml`, `robots.txt`, `_redirects`, JSON-LD if it changes).

The sibling `mcp-chrome/` folder on disk is a separate unrelated project and is gitignored — do not commit it.

## Commands

```bash
# Local preview — pick one
python -m http.server 8088               # simplest
npx wrangler pages dev . --port 8788     # closest to Cloudflare Pages runtime
npx serve .

# Deploy
git push origin main                                                    # auto-deploys via CF Pages GitHub integration
npx wrangler pages deploy . --project-name=tomato-agency                # manual deploy alternative
```

There are no tests and no lint config. Validate by visiting the local URL and looking at the page — there is no headless verification step.

## Architecture (the bits that span files)

**One-page site**, everything lives in `index.html`. Sections render in this order and the nav + footer links target their `id`s — when you rename a section, update both nav lists and the `_redirects` vanity URLs:

```
splash → topbar → header → hero → about → manifesto → services
       → process → talent (eligibility cards) → voices → faq → cta → footer
```

The hero's `#audition` anchor and the LINE button both link to `https://lin.ee/WSxsQuG` (the live LINE OA `@tomatoagency`). The agency does not have its own audition form on this site — the actual application happens inside the LIFF flow in the separate `botnick/idol-audition` repo.

**Brand tokens** live as CSS custom properties at the top of `assets/css/style.css` (`--red`, `--pink`, `--blue`, `--cream`, font families). Anything brand-colored should reference these, not hardcoded hex.

**Bilingual display titles** use a two-span pattern: `<span class="display-serif">italic english</span><span class="display-sans">lowercase english</span>`. The serif half uses DM Serif Display italic; the sans half uses Italiana. Thai text never goes inside `.display-serif` — italic serif fonts mangle Thai glyphs.

**Service worker** (`sw.js`) uses stale-while-revalidate for assets and network-first for HTML, with an offline fallback to `/`. Bump `VERSION` when shipping breaking asset changes so old clients re-fetch.

**PWA manifest** declares three home-screen shortcuts (Apply / Services / Contact). The maskable icons are the same files as the regular icons — they were designed with safe-zone padding already baked in.

## Assets — which logo goes where

The repo carries **two** brand image files. Mixing them up has burned past sessions, so:

- `assets/img/wordmark.png` — the horizontal `tomato agency` italic wordmark. Used for `.brand__logo` in **header** and **footer** only.
- `assets/img/logo.png` — the round tomato-fruit mark with `to/ma/to` stacked inside. Used for the **splash**, the **hero orbit center**, and as the source for every file under `assets/icons/` (favicons, apple-touch, PWA 192/512).
- `assets/img/og-image.png` — generated 1200×630 social card combining the fruit mark + wordmark + thin divider with a red dot. Regenerate it with PowerShell + `System.Drawing` if the layout needs to change; the older script lives in git history.

If a future task says "use the logo" without specifying, ask which one. The fruit mark and the wordmark are not interchangeable.

## Brand voice — content rules the user has insisted on

These are baked into the live copy and should be preserved when editing:

- The agency does **Live VJ only**. Do not introduce K-pop idol, "ศิลปิน", "ไอดอล", "Influencer", "content creator" framing — they were all removed deliberately.
- No money-as-bait claims. The "ค่าโปรโมท 1,000 บาท/Post" line and any specific income/follower numbers were explicitly cut. No fabricated stats.
- No "ทีมโค้ช" wording. Use **"พี่ ๆ ทีมงาน"** for the team. Tone is warm, slightly casual ("น้อง ๆ", soft ending particles like "นะ" / "จ้า") — not corporate.
- Brand name in prose is **"Tomato Agency"** (capital T). The lowercase italic `tomato agency` only appears as the wordmark in the logo file and in display elements that use the bilingual pattern.
- LINE handle `@tomatoagency` (URL `https://lin.ee/WSxsQuG`), Instagram `@tomatoagency.th`. These two have different handles — do not search-and-replace one into the other. The domain is `tomato.in.th`; the Instagram handle is `tomatoagency.th` (different thing).

## Cloudflare Pages deployment shape

`_headers` is intentionally minimal — HSTS + nosniff + Referrer-Policy + cache rules. A previous pass had COOP/CORP/CSP/Permissions-Policy and the COR-P `same-origin` was blocking Facebook/Twitter/LINE/metatags.io from fetching the OG image. Don't reintroduce those without a reason. The `/assets/*` rule explicitly sends `Access-Control-Allow-Origin: *` so social previews work.

`_redirects` provides vanity URLs (`/audition`, `/ig`, `/line`) and the `www.` → apex redirect.

After pushing changes, social caches will hold the old OG image — use Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) and Twitter's [Card Validator](https://cards-dev.twitter.com/validator) to force a re-scrape.
