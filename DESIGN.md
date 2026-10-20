# Design — "sweet refresh" of the original site

Recorded 2026-10-21. Product truth lives in `PRODUCT.md`.

## Direction

Keep the original light, cute, feminine Tomato site with the same sections, copy and layout, and make it prettier.
The owner's reference is **vibie.live**: a bold pink hero with a slanted bottom edge, a white pill next to a sunny
pill, pastel tiles, pink category chips and clean light sections. An earlier dark "ON AIR" studio concept was rejected
as "ai slop". Don't swap this look for a new themed world. Refine it.

## Tokens (`assets/css/style.css` `:root`)

| Role | Token | Value |
|---|---|---|
| UI accent (rose) | `--red` `--red-deep` `--red-soft` `--rose-light` | `#D6345C` `#A8173F` `#EC5F83` `#F27B98` |
| Pinks | `--pink` `--pink-soft` `--pink-cream` | `#FFB5CD` `#FFE5EE` `#FFF5F8` |
| Pastel tiles | `--peach` `--butter` `--blue-soft` `--lilac` | `#FFEBDD` `#FFF3D4` `#E4F1FB` `#F1E8FF` |
| Sunny pill | `--sun` → `--sun-deep` | `#FFC768` → `#FFA25E`, text `#5A1F0E` |
| Text | `--ink` `--ink-mid` `--ink-soft` `--ink-line` | `#2A1620` `#6A4E5A` `#85707A` (4.5:1) `#F3E1E7` |
| Page | `--cream` | `#FFFAFB` |
| Radii | `--r-md` `--r-lg` `--r-xl` | 18 / 26 / 34px |

White text on `--red` measures 4.7:1. Rose blocks use `linear-gradient(115deg, #CC2C55, #D6345C 50%, #EE6C8C)`, and
text always sits on the darker left half. The logo artwork keeps its own tomato red.

## Type

- English display: DM Serif Display italic (`.display-serif`) + Italiana (`.display-sans`), as in the original.
- Thai headings, buttons and nav: **Mitr** 500 (`--font-head`). Only 400/500 are loaded, so never request 600/700
  (Chrome would fake-bold it).
- Body: IBM Plex Sans Thai Looped (`--font-thai`).
- Never set Thai in the serif italic.

## Signature pieces

- **Hero (home):** a full-bleed rose block clipped to a slanted bottom edge (`.hero__bg` clip-path). The header floats
  over it with a white wordmark and links, then turns white on scroll or while the mobile nav is open (`:has()`).
  The block holds a white pill and a sunny pill, glassy white chips, the orbit logo on white rings, and floating hearts.
- **Slanted rose bands:** the manifesto has slants top and bottom, and the CTA has a slanted top.
- **Pastel tiles:** the about cards cycle pink, peach, sky and butter. Work types form a bento with the VJ card as the
  big rose tile spanning 2 rows and สังกัด spanning 2 columns.
- **Chips:** `.pcard__cat` and `.wtcard__kicker` are small pink chips (vibie's category tags).
- **Footer:** light blush, not dark.

## Where it lives

The refresh is the "Sweet refresh" block at the end of `assets/css/pages.css`. It loads last and overrides the base
rules in `style.css` and earlier in `pages.css`. Tokens live in `style.css` `:root`.

## Rules

- No splash or preloader. No IDOL+.
- Buttons press with `scale(.97)`. Motion stays gentle: floating hearts and the orbit, all off under reduced motion.
