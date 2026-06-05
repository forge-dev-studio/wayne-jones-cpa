# Wayne Jones, CPA — Website

Astro static site for Wayne Jones Accounting Services (HW Jones LLC), Rome, GA CPA (license CPA026715). The **"Engraved"** design theme renders the firm as an ultra-premium engraved certificate: ivory paper, ink-navy feature bands, oxblood accents, and gold filigree — guilloché security-engraving, hairline ledger rules, a WJ wax-seal monogram, and Roman-numeral indices, set in Fraunces (display) + Spectral (body).

**Live URL (staging):** `https://forge-dev-studio.github.io/wayne-jones-cpa/`  
**Branch:** `feat/seo-astro`  
**Stack:** Astro 5 · TypeScript · CSS custom properties · Vanilla JS · GitHub Pages

---

## Project Overview

| Layer | Details |
|---|---|
| Framework | Astro 5, static output, `base: '/wayne-jones-cpa'` |
| Content | Astro content collections (`src/content/services/`, `locations/`, `posts/`) |
| SEO | Per-page JSON-LD (AccountingService, Service, LocalBusiness, FAQPage, BlogPosting, BreadcrumbList), canonical URLs, sitemap |
| Styling | `src/styles/global.css` — full Engraved theme, no external UI framework |
| Validation | `previews/validate-schema.cjs` (JSON-LD), `previews/audit-seo.cjs` (meta + links) |

---

## Local Development

```bash
npm install
npm run dev          # http://localhost:4321/wayne-jones-cpa/
npm run build        # outputs to dist/
npm run preview      # preview dist/ locally
node previews/validate-schema.cjs   # JSON-LD audit
node previews/audit-seo.cjs         # SEO + link audit
```

---

## Placeholder Register

Confirm each item with Wayne before go-live.

| # | Placeholder | Location | What to supply |
|---|---|---|---|
| 1 | Headshot / office photo | `src/components/sections/AboutBand.astro` — `.portrait` div | Replace monogram with a real `<img>` of Wayne or the office. Use `aspect-ratio:4/5`. |
| 2 | Legal name | `src/content/` bio copy | Confirm whether legal entity is "Harold Wayne Jones" or "Wayne Jones" — update bio if needed. |
| 3 | AICPA / GSCPA membership | `src/components/sections/AboutBand.astro` — `.creds` list | If Wayne holds AICPA or Georgia Society of CPAs membership, add as a credential list item. |
| 4 | Industry specialties | `src/components/sections/ClientRegister.astro` — who-list | Confirm any specific industry niches (e.g., restaurants, healthcare, real estate). |
| 5 | Formspree ID | `src/components/sections/ContactForm.astro` — form action | Replace `FORMSPREE_ID` with the real Formspree form ID (e.g., `xrgvabcd`). |
| 6 | og:image | `public/og/og-default.png` | Provide a 1200×630 JPG/PNG social share image. |
| 7 | Branded email | `src/config.ts` — `SITE.email` | Currently blank; set once the waynejonescpa.com email is live. |
| 8 | Geo coordinates | `src/config.ts` — `SITE.lat/lng` | Approximate downtown Rome coords set; refine to the exact suite address. |
| 9 | "Website by" credit | `src/components/Footer.astro` — footer-base | Currently reads "Website by Synergy." Confirm or replace before publishing. |

---

## Go-live Checklist

- [ ] **Formspree ID** — create a form at formspree.io; replace `FORMSPREE_ID` in `ContactForm.astro`.
- [ ] **Domain cutover** — see "Domain Cutover" section below.
- [ ] **Headshot** — obtain a photo of Wayne or the office; swap in the `AboutBand` portrait.
- [ ] **Confirm NAP** — verify phone `(706) 232-8565` and office hours with Wayne before launch.
- [ ] **GA CPA license** — verify license CPA026715 is active at [gsba.georgia.gov](https://gsba.georgia.gov).
- [ ] **AICPA / GSCPA** — ask Wayne about professional memberships; add to credentials if applicable.
- [ ] **og:image** — create and upload `public/og/og-default.png` (1200×630).
- [ ] **Google Analytics** (optional) — add GA4 `<script>` snippet to `BaseLayout.astro` `<head>`.
- [ ] **Google Search Console** — submit sitemap after DNS propagates.
- [ ] **Industry specialties** — confirm any specific niches; update `ClientRegister.astro`.
- [ ] **"Website by" credit** — confirm footer attribution with Wayne.
- [ ] **Browser/device check** — test 360px, 768px, 1024px, 1280px; check nav, form, schema.

---

## Domain Cutover

When `waynejonescpa.com` (or the confirmed domain) is ready:

1. **`astro.config.mjs`** — change `site` to `'https://waynejonescpa.com'` and `base` to `'/'`.
2. **`public/CNAME`** — create with content `waynejonescpa.com`.
3. **GitHub Pages** — set the custom domain in repo Settings → Pages.
4. **Cloudflare DNS** — add a `CNAME` record: `waynejonescpa.com → <github-pages-domain>`.
5. **Rebuild + deploy** — `npm run build`, push to the deploy branch (or let CI handle it).
6. **Verify** — run both validation scripts against the live domain; submit sitemap to GSC.

> The sitewide JSON-LD `@id` and canonical URLs automatically update when `site` and `base` change — no manual find/replace needed.
