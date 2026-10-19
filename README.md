# Impacts Digital — impacts.digital

Marketing site for Impacts Digital, Indonesia's creative social agency.
Rebuilt from the original Wix site (https://creative1395.wixsite.com/impactsdigital)
as a dependency-free static page.

- **Live:** https://impacts.digital
- **Repo:** https://github.com/impactstack/impacts.digital (`main`)
- **Deploy:** Cloudflare Workers static assets — `npx wrangler deploy`
- **Stack:** plain HTML + CSS + ~30 lines of JS (Poppins via Google Fonts)

```
site/
  index.html   # single landing page
  style.css    # design system + layout + clip-path section tilts
  script.js    # scroll-reveal + count-up stats (IntersectionObserver)
  img/         # 57 WebP assets, ~1.9 MB total
wrangler.jsonc # name: impacts-digital, assets.directory: site
```

## Design system

| Token | Value | Use |
|---|---|---|
| `--orange` | `#F19A4D` | brand accent, CTAs, stats band |
| `--navy` | `#0F1327` | dark panel, footer |
| `--ink` | `#1B1B1E` | body text (sampled from source site) |
| `--grey-bg` | `#F4F4F4` | partners section |
| Font | Poppins 400–800 | headings + body |

Section rhythm: white hero → orange stats → white about → navy tilted panel
(Amplifying Brand) → white panel (Amplifying NGO) → grey partners → orange
CTA → navy footer. Tilts are `clip-path: polygon(...)` — never background
images (see findings #9/#10).

## Findings & fixes (full log)

### Audit of the original Wix site

1. **No navigation** — only a floating logo, no anchors. → sticky pill nav
   (About / Work / Partners / Contact) + "Start a project" CTA.
2. **No CTA or contact path anywhere.** → nav CTA + closing orange band with
   email button. `support@impacts.digital` is a **placeholder** — swap in the
   real inbox (3 occurrences in `index.html`).
3. **Content bug:** both stats (90 and 170+) were labeled "Brands and NGOs
   Amplified". → 90 = *social campaigns*, 170+ = *brands & NGOs*. No numbers
   were invented.
4. **Invisible headings** — "Amplifying Brand/NGO" were dark-on-dark and
   off-white-on-white. → proper contrast + orange accent.
5. **Duplicate copy** — Brand and NGO sections had identical paragraphs.
   → NGO variant ends "...together with your cause."
6. **Washed-out logo wall** — grey-on-grey, unaligned, logos with huge
   transparent canvases rendered tiny. → uniform 150×52 boxes
   (`object-fit: contain`), alpha-bounds trimmed (Pillow, verified with
   `ffmpeg cropdetect`), aligned rows, hover full-opacity.
7. **Wix free-hosting banner** — gone with own hosting/domain.
8. **Kept from the source:** orange/navy palette, playful flat-vector
   illustration style, angled section transitions, Kitabisa-heritage story.

### Iteration fixes (post-rebuild review)

9. **Horizontal line above "Amplifying Brand"** — the source's pre-composed
   collage PNG, stretched by `background-size: cover`, exposed its baked top
   edge. → panels are now solid colors with CSS `clip-path` tilts; the
   collage PNGs were removed entirely.
10. **"Improper white" on Amplifying NGO** — same PNG artifact class.
    → panel-light is flat `var(--white)`; its bottom edge is straight so it
    meets the grey partners section without a white wedge.
11. **Stats band not centered.** → lede centered on top, stats side by side
    below (`.stats-row`); stack vertically on mobile.
12. **Kitabisa removed** from all copy per owner request.
13. **NGO→Brands "bridge"** — tilted NGO bottom left a white triangle
    between two grey sections. → straight bottom edge, seamless flow.
14. **Top gap above NGOs logos** — partners h2 margin 2.5rem → 4.5rem.

### Hero illustrations (Nano Banana)

Original Wix illustrations felt outdated. Replaced with 3 generated scenes
(prompts pinned the palette hexes, Indonesian characters, named props, and a
hard "no text" rule to avoid AI lettering):

| File | Scene | Position |
|---|---|---|
| `hero-amplify.webp` | hijabi woman + orange megaphone emitting hearts | top-center |
| `hero-giving.webp` | man on beanbag, donation UI + coins + cat | left |
| `hero-duo.webp` | two women, handshake bubble + rising chart | right |

White backgrounds were knocked out with an edge-connected flood fill
(borders-inward BFS at ≥240 RGB — keeps white clothing inside closed
outlines), trimmed, downscaled to 700px, saved as WebP q90.

Layout bug found while testing: on mobile `.hero-art { margin: 0 auto }`
disabled grid stretch and the box collapsed to **0 width** (all children are
absolutely positioned). → explicit `width: 100%` + compact mobile positions
inside the `max-width: 900px` media query.

### Image pipeline

- **Everything is WebP.** Photos q80 (≤1400px), logos/illustrations q90 with
  alpha (`exact=True`). PNG kept only for `logo.png` (favicon + og:image).
- 5.7 MB → **1.9 MB** total; unused sources (old illustrations, collage
  PNGs) deleted — recoverable from git history.
- **Cache busting:** bump `?v=N` on the `style.css` link and image `src`s
  when changing assets (`sed -i '' 's/?v=N/?v=N+1/' index.html`). Static
  hosts ignore the query; it forces browsers to refetch.

### Mobbin references applied (mobbin.com/discover/sites)

- **Family** (Technology) — hero: bold claim + playful illustration cluster
  + dual CTA.
- **Instrument** (Portfolio) — oversized type, orange blocks, pill nav.
- **Basedash** (Business) — immediate stats, high-contrast partner strip.

## Deployment & domain

- **Hosting:** Cloudflare Worker `impacts-digital` serving `site/` as static
  assets. Deploy with `npx wrangler deploy` (wrangler OAuth must be logged
  in). Live check: `curl -s https://impacts.digital/ | grep style.css`.
- **Custom domain:** `impacts.digital` attached via
  `PUT /accounts/{id}/workers/domains` (Workers custom domain, cert auto-
  issued). The zone was already active on the same CF account; attaching it
  replaced the old Wix DNS record.
- **Known gap:** `www.impacts.digital` has no DNS record — the wrangler
  OAuth token lacks `dns_records:write`. Add a proxied `www` CNAME →
  `impacts.digital` in the CF dashboard if wanted.

## TODO for the owner

- Replace placeholder `support@impacts.digital` (search in `index.html`).
- Decide on `www.` redirect.
- `og:image` currently uses the logo — a dedicated 1200×630 social card
  would look better in link previews.
