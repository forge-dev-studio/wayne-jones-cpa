# Wayne Jones CPA — Full SEO Review (2026-06-05)

Audit of the live 40-page Astro site (forge-dev-studio.github.io/wayne-jones-cpa). **Domain/hosting excluded** per request (the custom-domain move is the known separate #1 lever). Findings synthesized from 5 parallel audits (technical, on-page, schema, local/E-E-A-T, architecture/a11y/social) and **verified against the build**.

Severity: 🔴 Critical (broken/blocking) · 🟠 High-impact · 🟡 Medium · ⚪ Low/polish.

---

## TIER 1 — 🔴 Critical bugs (broken links; fix first) — VERIFIED

1. **Breadcrumb links 404 on every inner page.** `src/components/Breadcrumbs.astro:27` renders `<a href={item.href}>` (raw) instead of the base-aware `href()`. On GitHub Pages all breadcrumb links drop the `/wayne-jones-cpa/` base → 404. *Fix: import `href` from `../lib/seo`, render `href={href(item.href)}`.* (Breadcrumb JSON-LD is fine — uses `absoluteUrl()`.)
2. **Base-less internal links in body content → 404s.** Many location/service markdown bodies link to `/services/bookkeeping` (and some without trailing slash) instead of base-prefixed/trailing-slash URLs. Confirmed dozens across `dist`. *Fix: normalize all in-content links to the base-aware, trailing-slash form (sweep `src/content/**` + ensure markdown links route through base). Add a build-time link check that catches base-less internal links (my current audit missed them).*
3. **Homepage "Schedule of Services" cards link to `#contact`** (all 6), not the service pages. Home passes no link equity to the money pages and users land on the form instead of the service. *Fix: link each card to `/services/<slug>/`.*

## TIER 2 — 🟠 High-impact SEO wins

4. **Real OG/social image.** `public/og/og-default.png` is a placeholder; every share (esp. blog posts) shows a blank/broken preview. *Fix: a real 1200×630 branded image; ideally per-page for the 6 services + 5 posts (build-time generation via Satori later).*
5. **Render-blocking Google Fonts.** The `<link rel="stylesheet">` for Fraunces+Spectral blocks first paint (LCP). *Fix: self-host via `@fontsource` (also trims the oversized 13-weight request) or use the `media=print`/onload swap + `preload` the LCP font.*
6. **BlogPosting schema misses rich-result requirements** (all 5 posts): no `image` (required for article rich result), `publisher` is `AccountingService` not `Organization`+`logo`, no `dateModified`, `author` Person has no `url`/`sameAs`. *Fix: add `image` (1200px), `publisher` Organization+logo, `dateModified`, `author.url=/about/` + `sameAs`.*
7. **Location schema `@id` collision.** Each location page's thin `LocalBusiness` reuses the sitewide `#business` `@id`, so Google may merge/overwrite the rich business node with the sparse one. *Fix: give per-location `LocalBusiness` its own `@id` (e.g. `…/locations/rome-ga/#location`) + `parentOrganization`, and add the city/county to its `areaServed` (currently identical on all 21).* 
8. **Location page `<title>`s exceed ~60 chars** (62–73), truncating in SERPs. *Fix: trim pattern to `CPA in <City>, GA — Tax & Accounting | Wayne Jones` (~49–53).*
9. **Real headshot of Wayne (trust/E-E-A-T).** Every "portrait" is a `WJ` monogram placeholder. For YMYL (tax/finance), a real face is the single highest-ROI trust improvement; raters weight a demonstrable human expert. *Fix: add a real photo at the hero + About + blog author box. (Eric's requested placeholder addressed in this pass.)*
10. **Gold text fails WCAG AA contrast.** `var(--gold)` (#B6924A, ~2.6:1 on ivory) is used as foreground text (list bullets/separators) in `services/[slug]`, `locations/[city]`, `blog/[slug]`. *Fix: switch those to the existing AA-safe `var(--gold-text)` (#856626).*

## TIER 3 — 🟡 On-page & content

11. **Keyword-poor H1s.** Home (`Rome's most trusted name…`), Services hub (`Our Services`), Locations hub (geo label), About (`A CPA who actually answers the phone.`) — H1s are tagline-first. *Fix: front-load the keyword in each H1 (keep the tagline as a deck/H2). e.g. Home → `Rome, GA CPA — Tax Preparation, Bookkeeping & Payroll`.*
12. **Blog E-E-A-T gaps:** 4 of 5 posts lack a YMYL disclaimer (only `how-to-choose-a-cpa` has one); no author bio box; no inline cross-links to service/location pages; `og:type` is `website` not `article`. *Fix: standard disclaimer block on every post; author bio card (headshot + license + link to /about/); 2–3 contextual inline links per post; pass `type="article"` from the blog template + add `article:published_time/author`.*
13. **Location internal-linking:** `nearbyAreas` are plain text (should link to sibling location pages where one exists); no location→location cross-links; service pages don't cross-link to location pages. *Fix: linkify nearbyAreas to matching slugs; add "Nearby communities" links; add a "Serving Rome, Cartersville, …" block to service pages.*
14. **NAP normalization.** Address appears long-form (`101 East 2nd Avenue, Suite 330`) and abbreviated (`101 E 2nd Ave Suite 330`, incl. the Maps iframe). *Fix: one canonical string everywhere incl. the map `q=` param; match GBP verbatim.*
15. **Acworth/Kennesaw keyword cannibalization** — both target "tax preparation cobb county." *Fix: differentiate (Acworth→lake/Allatoona; Kennesaw→KSU/university), drop the shared term from one.*
16. **Hub pages thin/weak intros & meta CTAs** (`/blog/`, `/locations/`, `/services/`): add unique optimized intro copy + a CTA in meta descriptions.
17. **Brand-suffix + title-format inconsistency:** mix of `| Wayne Jones` vs `| Wayne Jones, CPA`; FAQ title format. *Fix: standardize to `| Wayne Jones, CPA`.*
18. **IRS service title/H1 mismatch** ("IRS & Tax Help" vs "IRS & Tax-Problem Help") — align phrasing.

## TIER 4 — ⚪ Polish / nice-to-have

19. **Favicon:** add PNG + `apple-touch-icon` (SVG-only today; iOS/older browsers).
20. **Sitemap:** add `lastmod` (+ optional priority) via `@astrojs/sitemap` serialize.
21. **Business schema:** add `image`/`logo`/`hasMap`; structured `openingHoursSpecification` (vs the string); a homepage `Organization`+`logo` block (knowledge-panel logo); `email` if public; 4–5-decimal `geo`.
22. **Person (Wayne) schema:** add `image`, `url`, `sameAs`; surface the license # in `hasCredential`.
23. **`sameAs` expansion:** add Google Business Profile + LinkedIn URLs once they exist.
24. **Service schema:** add `offers` (no fixed price → `PriceSpecification` USD); `hasOfferCatalog` on the services hub.
25. **`tel:` in the contact office block** (currently plain text); `:focus-visible` on skip link; optional HTML sitemap page.
26. **Strip shipped PLACEHOLDER comments** (legal name, AICPA/GSCPA, headshot) from rendered HTML once resolved.

## Excluded / needs Wayne's input (not site bugs)
- **Domain** (`waynejonescpa.com`) — excluded per request; remains the biggest single ranking lever.
- **Formspree ID** — contact form is intentional demo-mode until the real ID is added (go-live item).
- **AICPA/GSCPA membership** & **legal name** ("HW Jones LLC" is the registered entity; site shows "Wayne Jones Accounting Services") — confirm with Wayne; `legalName` schema could use "HW Jones LLC."
- **Reviews/AggregateRating** — correctly NOT shown (real reviews are thin/poor). Best path: earn fresh Google Business Profile reviews.

## What's already strong (don't touch)
One H1/page; unique titles+descriptions; canonicals everywhere; valid JSON-LD with `BreadcrumbList` sitewide, `FAQPage`, `Service`, `Person`+`hasCredential` (dual-state boards — excellent); genuinely unique location content (no doorway pages); near-zero-JS static = fast; solid a11y baseline (skip link, focus-visible, aria-expanded nav, reduced-motion, labeled forms); clean sitemap+robots; consistent phone format.

---

### Recommended "fix now" batch
Tier 1 (all 3 bugs) + Tier 2 #5,6,7,8,9,10 + the hero/About **headshot placeholder** + Tier 3 #11,12,14 — highest impact, all implementable without Wayne's input. The rest (domain, Formspree, AICPA, per-page OG generation, reviews) are owner/launch items.
