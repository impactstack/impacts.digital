# Impacts Digital — impacts.digital

Rebuild of https://creative1395.wixsite.com/impactsdigital as a static site,
deployed on Cloudflare (Workers static assets) at **https://impacts.digital**.

## Structure

```
site/
  index.html   # single landing page
  style.css    # design system: orange #F19A4D / navy #0F1327 / ink #1B1B1E, Poppins
  script.js    # scroll-reveal + animated counters (IntersectionObserver)
  img/         # all 61 images from the source site (trimmed, optimized)
wrangler.jsonc # Cloudflare config (assets: site/)
```

Deploy: `npx wrangler deploy`

## UI audit of the source site (fixed in this rebuild)

1. **No navigation** — only a floating logo; no way to jump between sections.
   → sticky pill nav with anchor links + CTA.
2. **No call-to-action anywhere** — an agency site with zero contact path.
   → "Start a project" nav CTA + closing "Let's amplify your kindness" band
   with email button.
3. **Content bug:** both stats (90 and 170+) were labeled "Brands and NGOs
   Amplified". → 90 = social campaigns, 170+ = brands & NGOs (no numbers
   invented, labels split).
4. **Invisible headings** — "Amplifying Brand"/"Amplifying NGO" were dark-on-dark
   / off-white-on-white. → proper contrast, orange accent kept.
5. **Duplicate copy** — Brand and NGO sections had identical body text.
   → NGO paragraph ends "...together with your cause."
6. **Washed-out logo wall** — grey on grey, no alignment. → uniform 150×52
   boxes, rows aligned, whitespace trimmed from logo canvases, opacity +
   hover treatment.
7. **Wix banner / free-hosting chrome** — gone (own domain).
8. Kept what works: warm orange + navy palette, playful illustrations,
   angled collage panels (source's own collage PNGs used as section
   backgrounds), Kitabisa heritage copy.

## Mobbin references applied (mobbin.com/discover/sites)

- **Family** (Technology): hero pattern — bold centered claim flanked by
  playful illustrations + dual CTA. Used for the hero actions row.
- **Instrument** (Portfolio): oversized display type + big orange blocks +
  pill nav. Used for nav, section headings, CTA band.
- **Basedash** (Business): stats visible immediately + high-contrast
  "trusted by" logo strip. Used for the stats band and partners section.

## Notes / TODO for the owner

- `hello@impacts.digital` is a placeholder — replace with the real inbox
  (search `hello@impacts.digital` in `site/index.html`).
- `www.impacts.digital` has no DNS record (API token lacked DNS scope).
  Add a proxied `www` CNAME → `impacts.digital` in the CF dashboard if wanted.
- All 61 source images are included; heavy photos were downscaled to
  ≤1400px and converted to JPEG where transparency wasn't needed.
