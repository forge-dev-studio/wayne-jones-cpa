# Wayne Jones CPA — SEO Re-platform (Astro) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-platform the single-page Engraved site into a ~22-page Astro static site engineered for local CPA SEO (Rome/Floyd County GA + nearby AL), preserving the Engraved design pixel-for-pixel.

**Architecture:** Astro static output. `src/styles/global.css` = the Engraved system unchanged. `BaseLayout` injects per-page `<Seo>` + sitewide JSON-LD + shared `Header`/`Footer`. Content collections (`services`, `locations`, `posts`) drive templated pages. `@astrojs/sitemap` + `robots.txt`. GitHub Pages via Actions (`astro build` → `dist/`). One-line domain cutover.

**Tech Stack:** Astro 4, `@astrojs/sitemap`, TypeScript content collections (zod), vanilla JS island for interactions, Node 20 build in GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-06-05-wayne-jones-seo-astro-design.md`. **Branch:** `feat/seo-astro`.

**Design fidelity rule:** Home must render identically to current production (`site/index.html`). Port section HTML verbatim into components; reuse `global.css` unchanged.

**Content rule:** All service/location/blog prose is **DRAFT**, front-matter `draft: true` or a visible "Draft — pending review" note in `src/config.ts`-gated banner OFF by default; verified facts only; **no star ratings, no fabricated testimonials/stats**. Mark unknowns `<!-- PLACEHOLDER -->`.

---

## Conventions
- **Verification for static site:** `npm run build` must succeed; `npx astro check` (types) clean; targeted `grep` on `dist/`; JSON-LD validated with a Node script; visuals via Playwright; Lighthouse where noted.
- **Commit** after each task. Identity: `git -c user.name="Claude (Synergy)" -c user.email="service@synergytelecom.org" commit`. Append `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Base-aware links:** always build internal hrefs with the `href()` helper (Task 0.3) so `base:'/wayne-jones-cpa'` is respected. Never hardcode a leading-slash path.

---

## File Structure
```
package.json, package-lock.json, astro.config.mjs, tsconfig.json
src/config.ts                         business facts + nav (single source of truth)
src/lib/seo.ts                        href() + absoluteUrl() helpers
src/styles/global.css                 Engraved system (copied from site/assets/styles.css, unchanged)
src/scripts/engraved.js               interactions (ported from site/assets/script.js)
src/components/Seo.astro              <head> SEO tags
src/components/SchemaOrg.astro        emits one JSON-LD block
src/components/Header.astro Footer.astro Breadcrumbs.astro CTASection.astro
src/components/sections/*.astro       Hero, LedgerBar, ServiceSchedule, ClientRegister, AboutBand, WhyBand, ContactForm, SectionDivider
src/components/ServiceCard.astro LocationCard.astro PostCard.astro FaqList.astro
src/content/config.ts                 zod schemas: services, locations, posts
src/content/{services,locations,posts}/*.md
src/layouts/BaseLayout.astro
src/pages/index.astro services/index.astro services/[slug].astro
src/pages/locations/index.astro locations/[city].astro
src/pages/blog/index.astro blog/[slug].astro
src/pages/about.astro contact.astro faq.astro 404.astro
public/robots.txt favicon.svg og/og-default.png(placeholder)
.github/workflows/pages.yml           node build → dist
```

---

# PHASE 0 — Infrastructure & foundation

### Task 0.1: Scaffold Astro project
**Files:** Create `package.json`, `astro.config.mjs`, `tsconfig.json`; Modify `.gitignore`.

- [ ] **Step 1: Un-ignore package files.** In `.gitignore` remove the line `package-lock.json` and `package.json` (keep `node_modules/`). Confirm: `grep -c 'package' .gitignore` → only matches inside `node_modules` line if any; `package.json` must NOT be ignored.
- [ ] **Step 2: Create `package.json`**
```json
{
  "name": "wayne-jones-cpa",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^4.15.0",
    "@astrojs/sitemap": "^3.2.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0",
    "playwright": "^1.60.0"
  }
}
```
- [ ] **Step 3: Create `astro.config.mjs`**
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// DOMAIN CUTOVER: when waynejonescpa.com is live, set site:'https://waynejonescpa.com',
// base:'/', add public/CNAME with the domain, and set the Pages custom domain.
export default defineConfig({
  site: 'https://forge-dev-studio.github.io',
  base: '/wayne-jones-cpa',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
```
- [ ] **Step 4: Create `tsconfig.json`**
```json
{ "extends": "astro/tsconfigs/strict", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"] }
```
- [ ] **Step 5: Install + build smoke test.** Create a temporary `src/pages/index.astro` with `<h1>ok</h1>`. Run `npm install` then `npm run build`. Expected: `dist/wayne-jones-cpa/index.html` exists. (Will be replaced in Phase 1.)
- [ ] **Step 6: Commit** `feat(astro): scaffold project + config`.

### Task 0.2: Business facts config + SEO helpers
**Files:** Create `src/config.ts`, `src/lib/seo.ts`.

- [ ] **Step 1: `src/config.ts`** — single source of truth (verified facts only):
```ts
export const SITE = {
  name: 'Wayne Jones, CPA',
  legalName: 'Wayne Jones Accounting Services',
  tagline: "Rome's trusted name in tax & accounting since 2008.",
  phone: '(706) 232-8565',
  phoneHref: 'tel:+17062328565',
  email: '', // PLACEHOLDER: branded email not yet set; contact via form
  street: '101 East 2nd Avenue, Suite 330',
  city: 'Rome', state: 'GA', zip: '30161',
  lat: 34.2570, lng: -85.1647, // approx downtown Rome; PLACEHOLDER: refine
  hours: 'Mon–Fri 9:00 AM – 4:00 PM',
  openingHoursSpec: 'Mo-Fr 09:00-16:00',
  licensedStates: ['Georgia', 'Alabama'],
  cpaLicense: 'CPA026715',
  founded: '2008',
  facebook: 'https://www.facebook.com/p/Wayne-Jones-Accounting-Services-100063056748027/',
  areaServed: ['Rome GA', 'Floyd County GA', 'Cartersville GA', 'Calhoun GA', 'Cedartown GA', 'Northwest Georgia', 'Northeast Alabama'],
};
export const NAV = [
  { label: 'Services', href: '/services/' },
  { label: 'Locations', href: '/locations/' },
  { label: 'About', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
];
```
- [ ] **Step 2: `src/lib/seo.ts`**
```ts
const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // '/wayne-jones-cpa'
const SITE_URL = import.meta.env.SITE; // 'https://forge-dev-studio.github.io'
export const href = (path: string) => `${BASE}/${path.replace(/^\//, '')}`.replace(/\/{2,}/g, '/');
export const absoluteUrl = (path: string) => `${SITE_URL}${href(path)}`;
```
- [ ] **Step 3: Verify** `npx astro check` has no type errors referencing these. Commit `feat(astro): site config + seo helpers`.

### Task 0.3: Port the Engraved CSS + interactions
**Files:** Create `src/styles/global.css` (copy of `site/assets/styles.css`), `src/scripts/engraved.js` (copy of `site/assets/script.js`).
- [ ] **Step 1:** Copy `site/assets/styles.css` → `src/styles/global.css` **unchanged**. Confirm byte-identical: `diff site/assets/styles.css src/styles/global.css` → no output.
- [ ] **Step 2:** Copy `site/assets/script.js` → `src/scripts/engraved.js` unchanged. `node --check src/scripts/engraved.js` clean.
- [ ] **Step 3: Commit** `feat(astro): port engraved css + interactions`.

### Task 0.4: `SchemaOrg` + `Seo` components
**Files:** Create `src/components/SchemaOrg.astro`, `src/components/Seo.astro`.
- [ ] **Step 1: `SchemaOrg.astro`**
```astro
---
const { schema } = Astro.props as { schema: object };
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```
- [ ] **Step 2: `Seo.astro`**
```astro
---
import { absoluteUrl } from '../lib/seo';
const { title, description, canonical, ogImage = '/og/og-default.png', noindex = false } = Astro.props;
const canonicalURL = absoluteUrl(canonical ?? Astro.url.pathname.replace(import.meta.env.BASE_URL, '/'));
const img = absoluteUrl(ogImage);
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />
{noindex && <meta name="robots" content="noindex, nofollow" />}
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:image" content={img} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={img} />
```
- [ ] **Step 3: Commit** `feat(astro): Seo + SchemaOrg components`.

### Task 0.5: `BaseLayout` with sitewide schema
**Files:** Create `src/layouts/BaseLayout.astro`.
- [ ] **Step 1:** Build the layout: `<!doctype html>`, `<html lang="en" class="">` with an inline head script `document.documentElement.classList.add('js')` (progressive-enhancement guard — content visible without JS), Google Fonts (Fraunces + Spectral, the exact link from `site/index.html`), `import '../styles/global.css'`, `<Seo {...Astro.props.seo} />`, the sitewide `AccountingService` JSON-LD via `<SchemaOrg>`, skip link, `<Header/>`, `<main id="main-content"><slot/></main>`, `<Footer/>`, and `<script>` importing `../scripts/engraved.js`.
- [ ] **Step 2:** Sitewide schema object (build from `SITE`):
```ts
const orgSchema = {
  '@context': 'https://schema.org', '@type': 'AccountingService',
  name: SITE.name, legalName: SITE.legalName, '@id': absoluteUrl('/') + '#business',
  url: absoluteUrl('/'), telephone: SITE.phone, priceRange: '$$',
  address: { '@type': 'PostalAddress', streetAddress: SITE.street, addressLocality: SITE.city, addressRegion: SITE.state, postalCode: SITE.zip, addressCountry: 'US' },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.lat, longitude: SITE.lng },
  openingHours: SITE.openingHoursSpec, areaServed: SITE.areaServed,
  founder: { '@type': 'Person', name: 'Wayne Jones', jobTitle: 'Certified Public Accountant' },
  sameAs: [SITE.facebook],
};
```
- [ ] **Step 3: Verify** with a throwaway page using BaseLayout: `npm run build`, then `grep -c 'application/ld+json' dist/wayne-jones-cpa/index.html` ≥1 and `grep -c 'classList.add' dist/.../index.html` =1. Commit `feat(astro): BaseLayout + sitewide schema`.

### Task 0.6: `Header` + `Footer`
**Files:** Create `src/components/Header.astro`, `src/components/Footer.astro`.
- [ ] **Step 1:** Port the Engraved header markup/classes from `site/index.html` (sticky topbar, WJ seal SVG, wordmark "Wayne Jones · CPA", `nav-toggle`), but render nav from `NAV` (Task 0.2) with `href()`; keep the gold "Request a Consultation" CTA → `/contact/`. Active-link: add `aria-current="page"` when `Astro.url.pathname` matches.
- [ ] **Step 2:** Port the Engraved footer (ink-navy register, WJ seal, NAP from `SITE`, "GA CPA #CPA026715 · Licensed in Georgia & Alabama", hours, Facebook `rel="noopener noreferrer"`, "Website by Synergy" PLACEHOLDER), nav from `NAV`.
- [ ] **Step 3: Verify** build; `grep` footer contains the phone and license. Commit `feat(astro): Header + Footer`.

### Task 0.7: `Breadcrumbs` + `CTASection`
**Files:** Create `src/components/Breadcrumbs.astro`, `src/components/CTASection.astro`.
- [ ] **Step 1: `Breadcrumbs.astro`** — props `items: {label,href}[]`. Render a `<nav aria-label="Breadcrumb">` ordered list (engraved hairline style) AND a `BreadcrumbList` JSON-LD via `SchemaOrg` (positions 1..n, `item` = `absoluteUrl(href)`).
- [ ] **Step 2: `CTASection.astro`** — reusable ink-navy band (guilloché watermark optional) with H2 "Ready to talk to a CPA who answers the phone?", a gold CTA → `/contact/`, and the `tel:` link. Used at the bottom of service/location/blog/about pages.
- [ ] **Step 3: Commit** `feat(astro): Breadcrumbs + CTASection`.

### Task 0.8: `robots.txt` + sitemap verify
**Files:** Create `public/robots.txt`; copy `site/assets/favicon.svg` → `public/favicon.svg`; create placeholder `public/og/og-default.png` (a 1200×630 export of the engraved hero — or a solid navy PNG with wordmark; mark PLACEHOLDER).
- [ ] **Step 1: `public/robots.txt`**
```
User-agent: *
Allow: /
Sitemap: https://forge-dev-studio.github.io/wayne-jones-cpa/sitemap-index.xml
```
(CUTOVER comment: update the Sitemap URL at domain switch.)
- [ ] **Step 2: Verify** `npm run build` then confirm `dist/wayne-jones-cpa/sitemap-index.xml` exists and `dist/wayne-jones-cpa/robots.txt` present. Commit `feat(astro): robots + sitemap + favicon`.

### Task 0.9: Deploy workflow → Astro build
**Files:** Modify `.github/workflows/pages.yml`.
- [ ] **Step 1:** Replace the publish job so it builds Astro and uploads `dist/`:
```yaml
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
        with: { enablement: true }
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
      - id: deployment
        uses: actions/deploy-pages@v4
```
Keep the `on.push.branches:[master]` trigger, `paths` filter REMOVED (build on any source change) or broadened to `['src/**','public/**','astro.config.mjs','package.json','.github/workflows/pages.yml']`. Keep `permissions` + `concurrency`.
- [ ] **Step 2: Verify** `npx yaml` not needed; just confirm valid by `node -e "require('js-yaml')" ` is NOT available — instead visually confirm indentation. Commit `ci(astro): build dist and deploy to Pages`. (Do NOT push to master here — Phase 1 must produce a real Home first; deploy happens at cutover.)

---

# PHASE 1 — Home (design parity)

### Task 1.1: Section components (port from `site/index.html`)
**Files:** Create `src/components/sections/{Hero,LedgerBar,ServiceSchedule,ClientRegister,AboutBand,WhyBand,ContactForm,SectionDivider}.astro`.
- [ ] **Step 1:** For each homepage section in `site/index.html`, create a component with the **exact same markup + classes** (so `global.css` styles it identically). `ServiceSchedule` reads the 6 services from the `services` collection (Phase 2) — for now hardcode the 6 rows by porting current markup; refactor to collection in Task 2.4. `ContactForm` keeps `action="https://formspree.io/f/FORMSPREE_ID"` + the demo-success script behavior.
- [ ] **Step 2:** Each component is a faithful copy — verify class names match `global.css` selectors (`grep` a few signature classes like `schedule__link`, `band-dark`, `ledgerbar__panel` exist in both).
- [ ] **Step 3: Commit** `feat(astro): home section components`.

### Task 1.2: Compose `index.astro` + parity check
**Files:** Create `src/pages/index.astro`.
- [ ] **Step 1:** Compose the sections inside `BaseLayout` with Home SEO: title `Wayne Jones, CPA — Tax & Accounting in Rome, GA`, description (port from current), canonical `/`. Add Home-specific `WebSite` + `BreadcrumbList`(home only) optional.
- [ ] **Step 2: Build** `npm run build`.
- [ ] **Step 3: Visual parity check.** Serve `dist/` and screenshot Home at 1440 + 390; compare against the current production renders in `previews/eng-desktop.png`/`eng-mobile.png`. They must match (same design). Use `previews/site-shoot.js` adapted to `dist/wayne-jones-cpa/`. Note any diffs and fix the offending component.
- [ ] **Step 4: Commit** `feat(astro): home page at design parity`.

---

# PHASE 2 — Services (hub + 6 pages)  *(content pages → parallel agents)*

### Task 2.1: Content collection config
**Files:** Create `src/content/config.ts`.
- [ ] **Step 1:** Define zod schemas for `services`, `locations`, `posts` per the spec data model. Example (services):
```ts
import { defineCollection, z } from 'astro:content';
const faq = z.array(z.object({ q: z.string(), a: z.string() })).default([]);
const services = defineCollection({ type: 'content', schema: z.object({
  title: z.string(), h1: z.string(), metaTitle: z.string(), metaDescription: z.string(),
  keywords: z.array(z.string()), order: z.number(),
  summary: z.string(), serviceType: z.string(), relatedServices: z.array(z.string()).default([]),
  whatsIncluded: z.array(z.string()), whoItsFor: z.string(), faq,
})});
const locations = defineCollection({ type: 'content', schema: z.object({
  city: z.string(), state: z.string(), metaTitle: z.string(), metaDescription: z.string(),
  keywords: z.array(z.string()), order: z.number(), intro: z.string(),
  servicesOffered: z.array(z.string()), nearbyAreas: z.array(z.string()).default([]), faq,
})});
const posts = defineCollection({ type: 'content', schema: z.object({
  title: z.string(), metaTitle: z.string(), metaDescription: z.string(), excerpt: z.string(),
  datePublished: z.string(), author: z.string().default('Wayne Jones'),
  category: z.string(), keywords: z.array(z.string()), draft: z.boolean().default(true),
})});
export const collections = { services, locations, posts };
```
- [ ] **Step 2: Commit** `feat(astro): content collection schemas`.

### Task 2.2: `FaqList` + `ServiceCard` components
**Files:** Create `src/components/FaqList.astro`, `src/components/ServiceCard.astro`.
- [ ] **Step 1: `FaqList.astro`** — props `items:{q,a}[]`, renders engraved accordion/list + emits `FAQPage` JSON-LD via `SchemaOrg`.
- [ ] **Step 2: `ServiceCard.astro`** — engraved schedule-row style link for hub listings.
- [ ] **Step 3: Commit** `feat(astro): FaqList + ServiceCard`.

### Task 2.3: Services hub `services/index.astro`
- [ ] **Step 1:** List all `services` (sorted by `order`) as engraved schedule rows linking to `/services/<slug>/`; Breadcrumbs Home→Services; CTASection; SEO (title "Accounting & Tax Services in Rome, GA | Wayne Jones, CPA"). Build passes.
- [ ] **Step 2: Commit** `feat(astro): services hub`.

### Task 2.4: Service detail template `services/[slug].astro`
- [ ] **Step 1:** `getStaticPaths` over `services`; render h1, intro, "What's included" list, "Who it's for", per-service `FaqList`, related-service links, CTASection, Breadcrumbs; `Seo` from frontmatter; `Service` JSON-LD (serviceType, provider `@id` = business, areaServed). Refactor Home `ServiceSchedule` to read the collection.
- [ ] **Step 2: Verify** build emits `dist/.../services/tax-preparation/index.html` etc.; each has a `Service` + `FAQPage` JSON-LD (`grep`). Commit `feat(astro): service detail template`.

### Task 2.5: Author the 6 service entries  *(parallel agents — 1 per service)*
**Files:** Create `src/content/services/{tax-preparation,bookkeeping,payroll,irs-tax-resolution,business-consulting,individual-tax-returns}.md`.
- [ ] **Step 1:** Each agent writes ONE `.md` to the **worked example** shape below, using the SEO appendix row for that service. ~600–900 words DRAFT prose, verified facts only, local Rome/GA framing, 3–5 FAQ. Worked example (`tax-preparation.md`):
```md
---
title: "Tax Preparation"
h1: "Tax Preparation in Rome, GA"
metaTitle: "Tax Preparation in Rome, GA | Wayne Jones, CPA"
metaDescription: "Accurate federal & state tax preparation for businesses and individuals in Rome, GA. A CPA who plans year-round to keep your tax bill low. Request a consultation."
keywords: ["tax preparation rome ga","tax preparer rome georgia","cpa tax filing rome ga"]
order: 1
serviceType: "Tax preparation"
summary: "Accurate federal and state returns for businesses and individuals, with year-round planning."
whatsIncluded: ["Federal & Georgia state returns","Multi-state & Alabama filings","Year-round tax planning","Audit-ready documentation","E-file with direct deposit"]
whoItsFor: "Small-business owners, contractors, and individuals across Rome and Northwest Georgia who want a CPA—not seasonal software—on their return."
relatedServices: ["bookkeeping","individual-tax-returns","business-consulting"]
faq:
  - q: "When should I bring in my tax documents?"
    a: "As early as you have them—January through April for individual returns. Early filers get more planning options and faster refunds."
  - q: "Do you file Alabama returns?"
    a: "Yes. Wayne is licensed in both Georgia and Alabama and regularly files multi-state returns for clients near the state line."
  - q: "Can you help if I'm behind on past returns?"
    a: "Yes—see IRS & tax-problem resolution. We can prepare prior-year returns and get you current."
---
[Body: 3–5 short sections of draft prose — intro w/ keyword+locale, what's included expanded, the process, why a local CPA. End with a line pointing to the consultation CTA. NO fabricated stats.]
```
- [ ] **Step 2: Verify** all 6 build; `npx astro check` clean; each page has unique title/description. Commit (one commit) `content(astro): 6 service pages (draft)`.

---

# PHASE 3 — About, Contact, FAQ

### Task 3.1: `about.astro`
- [ ] Port the Engraved AboutBand (certificate portrait placeholder + oxblood pull-quote + creds), add fuller bio prose (draft), `Person` JSON-LD (Wayne Jones, CPA, worksFor business), Breadcrumbs, CTASection. SEO title "About Wayne Jones, CPA — Rome, GA". Build + commit `feat(astro): about page`.

### Task 3.2: `contact.astro`
- [ ] Port the certificate ContactForm + office register + map; `LocalBusiness` JSON-LD; Breadcrumbs; SEO "Contact Wayne Jones, CPA — Rome, GA | (706) 232-8565". Keep `FORMSPREE_ID` placeholder + demo-success. Build + commit `feat(astro): contact page`.

### Task 3.3: `faq.astro`
- [ ] 12–15 Q&As (draft, verified facts) via `FaqList` → `FAQPage` schema; Breadcrumbs; CTASection; SEO "Frequently Asked Questions | Wayne Jones, CPA, Rome GA". Build; `grep` one `FAQPage` block. Commit `content(astro): FAQ page`.

---

# PHASE 4 — Locations (hub + 5 pages)  *(parallel agents — 1 per city)*

### Task 4.1: `LocationCard` + locations hub `locations/index.astro`
- [ ] `LocationCard.astro` (engraved row) + hub listing all `locations` with intro about serving NW Georgia & NE Alabama; Breadcrumbs; CTASection; SEO "Serving Northwest Georgia & Northeast Alabama | Wayne Jones, CPA". Commit `feat(astro): locations hub`.

### Task 4.2: Location detail `locations/[city].astro`
- [ ] `getStaticPaths` over `locations`; render unique `intro`, services-offered links (cross-link to `/services/*`), nearby areas, per-location FAQ, CTASection, Breadcrumbs; `LocalBusiness` JSON-LD with `areaServed` = the city + `BreadcrumbList`. Build emits each city route. Commit `feat(astro): location detail template`.

### Task 4.3: Author the 5 location entries  *(parallel agents)*
**Files:** `src/content/locations/{rome-ga,cartersville-ga,calhoun-ga,cedartown-ga,cherokee-county-al}.md`.
- [ ] Each agent writes ONE `.md`, **uniquely** (real local context — county, landmarks, the drive/relationship to Rome; NOT a templated swap) per the SEO appendix. ~500–700 words DRAFT. Worked example (`cartersville-ga.md`):
```md
---
city: "Cartersville"
state: "GA"
metaTitle: "CPA in Cartersville, GA — Tax, Bookkeeping & Payroll | Wayne Jones"
metaDescription: "A trusted CPA serving Cartersville, GA and Bartow County—tax prep, bookkeeping, and payroll for local businesses and families. Request a consultation."
keywords: ["cpa cartersville ga","accountant cartersville georgia","tax preparation bartow county"]
order: 2
intro: "[Unique 2–3 sentence local intro: Bartow County seat, ~30 min from the Rome office, the kinds of local businesses served.]"
servicesOffered: ["tax-preparation","bookkeeping","payroll","business-consulting"]
nearbyAreas: ["Emerson","White","Adairsville","Euharlee"]
faq:
  - q: "Do I need to drive to Rome?"
    a: "[Draft answer: remote-friendly + in-person options.]"
---
[Body: unique local prose — who we help in Cartersville/Bartow County, services, why a nearby CPA, CTA. Distinct from other location pages.]
```
- [ ] Verify all 5 build; each has unique meta + `LocalBusiness` schema; intros are NOT duplicates (`grep`/diff a sentence). Commit `content(astro): 5 location pages (draft)`.

---

# PHASE 5 — Blog (index + ~5 posts)  *(parallel agents — 1 per post)*

### Task 5.1: `PostCard` + `blog/index.astro` + `blog/[slug].astro`
- [ ] `PostCard.astro` (engraved list item: title, date, excerpt). `blog/index.astro` lists non-draft? — list ALL (draft-marked) sorted by `datePublished` desc; SEO "CPA Insights & Tax Tips — Rome, GA | Wayne Jones". `blog/[slug].astro`: `getStaticPaths` over `posts`; render article, `BlogPosting` + `BreadcrumbList` JSON-LD (author Person Wayne Jones), CTASection, Breadcrumbs. Build. Commit `feat(astro): blog index + post template`.

### Task 5.2: Author ~5 seed posts  *(parallel agents)*
**Files:** `src/content/posts/{small-business-when-to-hire-cpa,georgia-small-business-tax-deadlines-2026,bookkeeping-vs-accounting,how-to-choose-a-cpa-in-rome-ga,what-to-bring-to-your-tax-appointment}.md`.
- [ ] Each agent writes ONE post (~800–1200 words DRAFT, locally framed, helpful, verified facts; no fabricated stats — if a stat is cited, mark `<!-- PLACEHOLDER: verify source -->`). Frontmatter per posts schema. `datePublished` values passed in by the controller (no Date.now in build). Commit `content(astro): 5 seed blog posts (draft)`.

---

# PHASE 6 — SEO validation, polish, cutover

### Task 6.1: `404.astro`
- [ ] Engraved 404 with helpful links (Home, Services, Contact), `noindex`. Commit `feat(astro): 404 page`.

### Task 6.2: JSON-LD validation
- [ ] **Step 1:** Write `previews/validate-schema.js` (Node): crawl every `dist/**/*.html`, extract each `application/ld+json`, `JSON.parse` it (fail on parse error), assert required `@context`/`@type`, and assert expected types are present per route (AccountingService on all; Service on /services/*; LocalBusiness on /locations/*; FAQPage on /faq/; BlogPosting on /blog/<slug>; BreadcrumbList on inner pages). Run it → 0 errors.
- [ ] **Step 2: Commit** `test(astro): JSON-LD validation script`.

### Task 6.3: Internal-link + meta audit
- [ ] **Step 1:** Write `previews/audit-seo.js` (Node): for every `dist/**/*.html` assert exactly one `<h1>`, a non-empty unique `<title>` and `<meta name=description>`, a `<link rel=canonical>`, and that every internal `href` resolves to an emitted file (no broken links). Run → 0 errors; fix any. 
- [ ] **Step 2: Commit** `test(astro): SEO/link audit script`.

### Task 6.4: Lighthouse + visual QA
- [ ] Serve `dist/`; run Lighthouse (or `npx lighthouse` if available; else manual) on Home + one service + one location + one post. Targets: SEO 100, Perf ≥95, A11y ≥95. Playwright render Home/desktop+mobile to confirm design parity and no-JS content visibility. Fix regressions. Commit any fixes.

### Task 6.5: Remove legacy + final build
- [ ] **Step 1:** Delete the legacy `site/` folder (its design now lives in components + `global.css`). Update `site/README.md` references (move the placeholder register to `docs/` or root `README.md`).
- [ ] **Step 2:** `npm run build` clean; `previews/validate-schema.js` + `previews/audit-seo.js` pass. Commit `chore(astro): remove legacy single-page site`.
- [ ] **Step 3:** (Deploy happens via PR→merge→Actions, handled by the finishing step — NOT a direct master push.)

---

## SEO Content Appendix (frontmatter targets for content agents)
**Services** (`/services/<slug>/`): tax-preparation (kw "tax preparation rome ga"), bookkeeping ("bookkeeping services rome ga"), payroll ("payroll services rome ga"), irs-tax-resolution ("irs tax help rome ga","back taxes rome ga"), business-consulting ("small business cpa rome ga"), individual-tax-returns ("individual tax return preparation rome ga"). metaTitle pattern: `"<Service> in Rome, GA | Wayne Jones, CPA"`.
**Locations** (`/locations/<city>/`): rome-ga ("cpa rome ga"), cartersville-ga ("cpa cartersville ga"), calhoun-ga ("cpa calhoun ga"), cedartown-ga ("cpa cedartown ga"), cherokee-county-al ("cpa cherokee county al","accountant centre al"). Each intro UNIQUE (county, distance to Rome office, local business mix).
**Posts:** titles per Task 5.2 filenames; categories: "Small Business", "Taxes", "Bookkeeping", "Choosing a CPA", "Tax Prep". datePublished supplied by controller at build time.

---

## Self-Review
**Spec coverage:** Astro arch ✓(0.1–0.5) · global.css verbatim ✓(0.3) · Seo/canonical/OG ✓(0.4) · sitewide+per-type schema ✓(0.5,2.4,3.x,4.2,5.1,0.7 breadcrumbs) · sitemap/robots ✓(0.8) · domain-cutover config ✓(0.1,0.8) · IA/URLs ✓(phases 2–5) · content collections ✓(2.1) · service/location/blog pages ✓(2.5,4.3,5.2) · FAQ ✓(3.3) · internal linking ✓(templates+CTASection 0.7) · deploy ✓(0.9) · validation/Lighthouse ✓(6.2–6.4) · design parity ✓(1.2) · remove legacy ✓(6.5) · no-JS guard ✓(0.5) · drafts/no-fabrication ✓(content tasks). All spec sections mapped.
**Placeholder scan:** Content-generation tasks intentionally delegate prose to a worked-example shape + appendix (this is a content build, not undefined code); all code machinery is fully specified. Site placeholders (og image, Formspree, email, geo) are flagged and centralized.
**Type consistency:** `href()`/`absoluteUrl()` (0.2) used everywhere; `SITE`/`NAV` (0.2) referenced consistently; collection field names in `config.ts` (2.1) match the templates (2.4,4.2,5.1) and worked examples (2.5,4.3); `seo` prop shape consistent (0.4 Seo ↔ BaseLayout 0.5 ↔ pages).
**Ambiguity:** URL scheme, base-awareness, schema-per-route, and deploy are explicit. Content prose is generated to the example; structure is deterministic.
