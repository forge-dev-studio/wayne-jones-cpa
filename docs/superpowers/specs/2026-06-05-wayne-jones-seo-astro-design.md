# Wayne Jones CPA — SEO Re-platform (Astro) Design Spec

**Date:** 2026-06-05 · **Status:** Approved · **Builds on:** the Engraved design (`site/` → ported verbatim).

## Goal
Re-platform the single-page Engraved site into a multi-page **Astro** static site engineered to rank for local CPA/tax/bookkeeping/payroll search in Rome / Floyd County GA + nearby Alabama, and convert visitors into consultation leads. Preserve the Engraved visual design **pixel-for-pixel**.

## Decisions (locked)
- **Stack:** Astro SSG (static output) + `@astrojs/sitemap`. Zero client JS by default; the few Engraved interactions (sticky header, mobile nav, reveals, count-ups) ship as one small vanilla script.
- **Scope:** "Full monster," ~22 pages (see IA).
- **Hosting:** GitHub Pages project site for now (`forge-dev-studio.github.io/wayne-jones-cpa/`). Domain `waynejonescpa.com` deferred — design for a **one-line cutover**.
- **Content:** I generate polished **DRAFT** copy, clearly marked "review before publish," verified facts only (no fabricated stats/testimonials/reviews). **No star ratings** anywhere (carryover rule).

## Architecture
```
package.json / package-lock.json   ← committed (un-ignore in .gitignore)
astro.config.mjs                   ← site, base, trailingSlash:'always', sitemap()
tsconfig.json
src/
  styles/global.css                ← the Engraved design system, UNCHANGED (from site/assets/styles.css)
  layouts/BaseLayout.astro         ← <html><head> + <Seo/> + sitewide JSON-LD + <Header/> + <slot/> + <Footer/>
  components/
    Seo.astro                      ← title, description, canonical, OG/Twitter, optional <slot> JSON-LD
    SchemaOrg.astro                ← helper to emit a JSON-LD <script type="application/ld+json">
    Header.astro  Footer.astro     ← global nav (incl. new pages) + engraved wax-seal marks
    Breadcrumbs.astro              ← visual + BreadcrumbList schema
    CTASection.astro               ← reusable "Request a Consultation" band
    Hero.astro  LedgerBar.astro  ServiceSchedule.astro  AboutBand.astro
    WhyBand.astro  ClientRegister.astro  ContactForm.astro  SectionDivider.astro
    ServiceCard.astro  LocationCard.astro  PostCard.astro  FaqList.astro
  content/
    config.ts                      ← zod schemas for the 3 collections
    services/*.md                  ← 6 entries (frontmatter + body)
    locations/*.md                 ← 5 entries
    posts/*.md                     ← ~5 seed articles
  pages/
    index.astro                    ← Home (ported Engraved homepage via components)
    services/index.astro           ← Services hub
    services/[slug].astro          ← service detail (from collection)
    locations/index.astro          ← Locations hub
    locations/[city].astro         ← location detail (from collection)
    blog/index.astro               ← Blog index (paginated if needed)
    blog/[slug].astro              ← post detail
    about.astro  contact.astro  faq.astro  404.astro
public/
  robots.txt                       ← Allow: / + Sitemap: <site>/sitemap-index.xml
  favicon.svg                      ← existing WJ mark
  og/  (placeholder OG images)     ← <!-- PLACEHOLDER og images -->
.github/workflows/pages.yml        ← setup-node + npm ci + astro build → upload ./dist
```
`astro.config.mjs`: `site:'https://forge-dev-studio.github.io'`, `base:'/wayne-jones-cpa'`, `trailingSlash:'always'`, `integrations:[sitemap()]`. **Cutover note (in-file comment):** to go live on the domain, set `site:'https://waynejonescpa.com'`, `base:'/'`, add `public/CNAME`, and set the Pages custom domain.

## Information architecture (URLs)
| URL | Page | Primary keyword |
|---|---|---|
| `/` | Home | CPA Rome GA / Rome GA accountant |
| `/services/` | Services hub | accounting services Rome GA |
| `/services/tax-preparation/` | Service | tax preparation Rome GA |
| `/services/bookkeeping/` | Service | bookkeeping services Rome GA |
| `/services/payroll/` | Service | payroll services Rome GA |
| `/services/irs-tax-resolution/` | Service | IRS tax help Rome GA |
| `/services/business-consulting/` | Service | small business CPA Rome GA |
| `/services/individual-tax-returns/` | Service | individual tax return preparation Rome GA |
| `/locations/` | Locations hub | CPA serving Northwest Georgia |
| `/locations/rome-ga/` | Location | CPA in Rome GA |
| `/locations/cartersville-ga/` | Location | CPA in Cartersville GA |
| `/locations/calhoun-ga/` | Location | CPA in Calhoun GA |
| `/locations/cedartown-ga/` | Location | CPA in Cedartown GA |
| `/locations/cherokee-county-al/` | Location | CPA serving Cherokee County AL |
| `/about/` | About Wayne | Wayne Jones CPA Rome |
| `/contact/` | Contact | contact CPA Rome GA / consultation |
| `/faq/` | FAQ | CPA FAQ (FAQPage rich result) |
| `/blog/` | Blog index | — |
| `/blog/<slug>/` | ~5 posts | informational long-tail |
| `/404` | Not found (noindex) | — |

## Content-collection data model (`src/content/config.ts`)
- **services**: `title, h1, metaTitle, metaDescription, keywords[], order, summary, intro, whatsIncluded[], whoItsFor, processSteps[]?, faq[]{q,a}, serviceType (schema.org), relatedServices[]`.
- **locations**: `city, state, slug, metaTitle, metaDescription, intro (UNIQUE local prose), localContext (landmarks/areas), servicesOffered[], whyLocal, nearbyAreas[], faq[]{q,a}, order`.
- **posts**: `title, metaTitle, metaDescription, excerpt, datePublished, updatedDate?, author ("Wayne Jones"), category, keywords[], draft:true`.

## Per-page SEO (the `<Seo>` contract)
Every page passes: unique `title` (≤60 chars, keyword-led, "| Wayne Jones, CPA"), `description` (≤155 chars, benefit + locale + CTA), `canonical` (absolute, base-aware), `ogTitle/ogDescription/ogImage`, Twitter summary_large_image. `404` and any thin/utility page → `noindex`. One `<h1>` per page.

## Structured data (JSON-LD)
- **Sitewide (BaseLayout):** `AccountingService` (a `LocalBusiness`) — legalName "Wayne Jones Accounting Services", name "Wayne Jones, CPA", address (101 E 2nd Ave Ste 330, Rome GA 30161), telephone, geo, `openingHours` Mo–Fr 09:00–16:00, `areaServed` GA+AL, `priceRange`, `sameAs` [Facebook], `founder` Wayne Jones.
- **Service pages:** `Service` (serviceType, provider→the business, areaServed) + page `FAQPage` if faq present.
- **Location pages:** `LocalBusiness` scoped to `areaServed` city + `BreadcrumbList`.
- **FAQ page:** `FAQPage`.
- **Blog posts:** `BlogPosting` (headline, datePublished, author `Person` Wayne Jones, publisher, image) + `BreadcrumbList`.
- **About:** `Person` (Wayne Jones, jobTitle CPA, worksFor).
- **Breadcrumbs** on all non-home pages.

## Technical SEO
- `@astrojs/sitemap` → `sitemap-index.xml`; `robots.txt` references it; exclude `/404`.
- Canonicals on every page; `trailingSlash:'always'` consistent.
- Internal-link mesh: Home→hubs→spokes; service↔related services; service↔location cross-links; blog posts→relevant service/location; global header/footer nav; `CTASection` on every page.
- Semantic HTML5 (`header/main/nav/article/section/footer`), descriptive `alt`, lazy images/iframes, `display=swap` fonts, preconnect.
- Performance: Astro static, near-zero JS; inline critical SVG; target Lighthouse SEO 100 / Perf ≥95 / A11y ≥95.
- Accessibility carryover: skip link, focus-visible, AA contrast, reduced-motion, `.js` progressive-enhancement guard for reveals (content visible without JS).

## Content plan (DRAFT, marked for review)
- **Service pages** (~600–900 wds): intro (keyword + locale) · what's included · who it's for · process · 3–5 FAQ · CTA. Verified facts only.
- **Location pages** (~500–700 wds, **uniquely written** per city — real local context/areas, distinct intros; NOT templated duplicates → avoids doorway/thin-content penalties).
- **FAQ** (12–15 Q&As) sitewide + per-service mini-FAQs.
- **Blog seed (~5):** "When should a small business hire a CPA?", "Georgia small-business tax deadlines (2026)", "Bookkeeping vs. accounting — what's the difference?", "How to choose a CPA in Rome, GA", "What to bring to your tax appointment". ~800–1200 wds each, locally framed, draft-marked.

## Migration / design fidelity
Port the live Engraved homepage section-by-section into Astro components; reuse `global.css` unchanged so Home renders **identically** to current production. Header/Footer become shared components (now including the new nav links). The legacy `site/` folder is removed in the final cutover commit once Astro Home reaches visual parity (verified via Playwright diff).

## Deploy
Rewrite `.github/workflows/pages.yml`: `actions/setup-node@v4` (Node 20) → `npm ci` → `npm run build` (`astro build`) → `actions/upload-pages-artifact` with `path: ./dist` → `deploy-pages`. Triggers on push to `master`.

## Build phases (for the plan)
0. **Infra:** Astro scaffold, config, global.css, BaseLayout, Header/Footer/Seo/SchemaOrg/Breadcrumbs/CTASection, sitemap+robots, deploy workflow, un-ignore package files.
1. **Home:** port Engraved homepage → components; Playwright parity check vs current live.
2. **Services:** hub + collection schema + 6 service pages (content + Service/FAQ schema). *(parallel agents per page)*
3. **Trust/convert:** About, Contact, FAQ (FAQPage).
4. **Locations:** hub + 5 unique location pages + LocalBusiness/Breadcrumb schema. *(parallel agents per page)*
5. **Blog:** index + ~5 seed posts (BlogPosting schema). *(parallel agents per post)*
6. **SEO polish/validation:** sitemap/robots verify, schema validation, internal-link audit, Lighthouse, 404, OG placeholders, remove legacy `site/`.

## Acceptance criteria
- All ~22 routes build, each with unique title/description/canonical + valid JSON-LD (schema validates).
- `sitemap-index.xml` + `robots.txt` present and correct; no broken internal links.
- Home visually matches current production (Playwright diff). Responsive 390/768/1440; no-JS content visible.
- Lighthouse SEO 100, Perf ≥95, A11y ≥95 on Home + a service + a location + a post.
- One-line domain cutover documented; no fabricated facts; all drafts marked.

## Out of scope (YAGNI)
CMS/admin, e-commerce, client portal, paid-search landing pages, real photography (placeholder), live form backend (Formspree ID still placeholder), multi-language.
