# Wayne Jones CPA — "Engraved" Elevation Design Spec

**Date:** 2026-06-05 · **Status:** Approved (direction A — Engraved) · **Supersedes the visual layer of** `2026-06-05-wayne-jones-site-design.md` (content/facts unchanged).

**Goal:** Rebuild the site's visual + interaction layer from "clean template" to ultra-premium "engraved certificate" luxury that wows a CPA. Same content, facts, trust-forward lead-gen goal, and static stack. Hero seed already built: `mockups/a-engraved/index.html`.

## Stack (unchanged)
Hand-crafted static `site/index.html` + `site/assets/styles.css` + `site/assets/script.js` + favicon. No framework. Google Fonts. GitHub Pages.

## Design system — "Engraved"
- **Palette (CSS vars):** `--ivory #F7F4EC` canvas · `--ivory-panel #F1ECE0` · `--ink #122036` · `--oxblood #6E2B2B` (primary accent: CTAs, key italics) · `--gold #B6924A` (hairlines, filigree, seals, labels) · `--muted #5A6473` body-secondary · ink sections use ivory/gold text.
- **Type (Google Fonts):** Display = **Fraunces** (heavy optical sizes; oxblood *italics* on key words). Body/labels = **Spectral**. Dramatic scale (hero H1 clamp ~3.5→7rem, leading ~0.95, tracking -0.02em). Strict baseline rhythm. Letterspaced Spectral caps for eyebrows/labels.
- **Signature motifs (reused throughout — this IS the brand language):**
  1. **Guilloché** security-engraving (inline SVG rose/spirograph) as faint section accents/watermarks (4–8% gold).
  2. **Hairline gold ledger rules** (1px) as dividers and frames.
  3. **WJ wax-seal monogram** (concentric fine rings + serif initials) in hero + footer.
  4. **Certificate framing** — fine ruled borders with registration-mark corners on key panels (portrait, form).
  5. **Roman-numeral / folio indices** (I–VI) for sections and the services schedule.
- **Depth/texture:** subtle paper grain (SVG noise ~3%), layered ivory panels with soft long shadows, hairline borders. Light, refined — never heavy.

## Anti-vanilla strategy: RHYTHM
Alternate **ivory editorial** sections with **two deep ink-navy feature bands** (About "Meet Wayne" + Why "manifesto") so the page builds drama instead of flat cream/navy alternation. Dark bands carry guilloché watermark + gold/ivory type.

## Motion (choreographed; respect `prefers-reduced-motion`)
- On-load: headline **mask/clip reveals** (text wipes up), staggered.
- Scroll-in: hairline rules **draw in** (`scaleX`), service rows stagger, seal/guilloché subtle parallax.
- **Number count-ups** in the ledger bar (2008, 35+).
- Hover: oxblood **fill-slide** on buttons; ledger-row gold rule + numeral emphasis; subtle lift.
- IntersectionObserver-driven; reduced-motion shows all final states instantly.

## Section-by-section treatment
1. **Header** — ivory; serif wordmark "Wayne H. Jones, CPA" + hairline; letterspaced Spectral nav; outlined gold "Request a Consultation" pill. Condenses + gains gold hairline on scroll. Mobile: refined drawer.
2. **Hero** — per `mockups/a-engraved`: eyebrow, oversized Fraunces H1 ("Rome's most trusted name in tax & accounting." with *name* in oxblood italic), Spectral sub, oxblood + ghost CTAs, right **ledger/certificate column** (License No / Jurisdiction / Experience / Specialties / Location rows + WJ seal + large "2008 ESTABLISHED"), guilloché backdrop, grain.
3. **Ledger bar** — hairline-bordered band; **count-up** figures: Since 2008 · 35+ years · Licensed GA & AL · GA CPA #026715. Ledger-line top/bottom rules.
4. **Services → "Schedule of Services"** — NOT cards. Engraved **ledger index**: each of the 6 services = a row [Roman numeral · Fraunces title · Spectral note · hairline divider · gold folio "→"]. Hover: row tint + rule draw + numeral fill. Verbatim service copy from prior spec (Tax Prep & Planning; Bookkeeping & Monthly Write-Up; Payroll & HR; IRS & Tax-Problem Resolution; Business Consulting; Individual Tax Returns).
5. **Who we serve → "Client Register"** — editorial Fraunces statement + ledger rows w/ engraved check-marks (Small businesses & LLCs · Sole proprietors & contractors · Professional practices · Startups · Individuals & families). `<!-- PLACEHOLDER: industry specialties -->`.
6. **About Wayne → DARK feature band** (ink-navy) — certificate-framed **portrait placeholder** (registration corners) with overlapping WJ wax seal; bio in editorial columns; giant Fraunces-italic oxblood-on-ink **pull-quote**: *"Every client works directly with me."* Credentials as engraved ledger. `<!-- PLACEHOLDER: headshot --> <!-- PLACEHOLDER: legal name Harold Wayne Jones? --> <!-- PLACEHOLDER: AICPA/GSCPA -->`.
7. **Why → DARK "manifesto" band** — guilloché watermark; 4 tenets as Roman-numeral entries (You work directly with Wayne · Local & accessible · Decades of experience · One firm, start to finish) with exact prior copy.
8. **Contact → "Request a Consultation"** — **certificate-style framed form** (ledger-lined fields: name, email, phone, interest select w/ "Select a service…" default, message) beside engraved office register (NAP, hours) + Google map. Form action literal `https://formspree.io/f/FORMSPREE_ID` + JS demo-success. `<!-- PLACEHOLDER: Formspree ID -->`.
9. **Footer** — ink-navy engraved register: WJ seal, wordmark, NAP, GA CPA #026715, hours, Facebook (rel=noopener), gold hairlines, "Website by Synergy" `<!-- PLACEHOLDER -->`.

## Content & integrity rules (unchanged)
Verified facts only (101 E 2nd Ave Ste 330, Rome GA 30161 · (706) 232-8565 · Mon–Fri 9–4 · GA CPA #026715 · GA & AL · founded 2008 · 35+ yrs). **No star ratings / review counts.** All unknowns marked `<!-- PLACEHOLDER -->` and tracked in `site/README.md` register.

## Accessibility / SEO (carry over + verify)
Single `<h1>`; JSON-LD AccountingService; labels on all inputs; skip link; map iframe `title`; focus-visible; reduced-motion; WCAG AA contrast (verify oxblood/gold on ivory and gold/ivory on ink).

## Out of scope (YAGNI)
Blog, portal, payments, booking, multi-page. Real photography swaps in later for the About placeholder.

## File plan
Rebuild `site/index.html`, `site/assets/styles.css`, `site/assets/script.js`; keep favicon (or refine to seal); update `site/README.md` placeholder register if needed. Reuse `mockups/a-engraved/index.html` as the hero/source-of-truth for the engraved system.
