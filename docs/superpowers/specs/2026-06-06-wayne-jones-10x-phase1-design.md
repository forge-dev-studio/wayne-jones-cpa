# Wayne Jones CPA — "10x" Phase 1 Design (2026-06-06)

**Goal:** Transform the site from a *brochure* into a *lead engine* — 10x more booked consultations + close the trust gap (2.3★ Google, solo CPA, dual GA/AL license, near-greenfield digital presence). Phase 1 ships only what needs **nothing from the client** (no scheduler account, no GHL, no photo, no analytics IDs). Those are deferred to Phase 2.

**Approved:** Eric approved "Full Phase 1" (tax tools + conversion + trust) after the decomposed design was presented.

**Non-negotiable:** This is a CPA's site. Every tax figure is **verified 2025 IRS/SSA data** (see Appendix A). Every calculator carries a prominent **estimate-only / YMYL disclaimer** and routes uncertainty to a consultation. Wrong tax math is a credibility disaster — the math lives in a **pure, unit-tested module** built test-first.

---

## Roadmap context (decomposition)

The full "10x" splits by dependency:

- **Phase 1 (this spec) — Brochure → Lead Engine.** Buildable now, zero client dependencies.
- **Phase 2 — Activation.** Needs client input: real scheduler (Calendly/Cal.com/GHL), GHL/Formspree lead routing + instant auto-response, GA4 + Microsoft Clarity, real photo/video, review-generation automation.
- **Phase 3 — Operational leap.** Secure client portal (doc upload, e-sign, invoice pay), AI receptionist/chatbot.

Phase 1 is designed so Phase 2 is a **config swap, not a rebuild** (e.g. one `BOOKING_URL` constant flips every CTA from the contact page to a real scheduler).

---

## Component A — Tax Tools Suite (the headline)

A hub + three client-side calculators, each its own SEO-optimized, indexable page. Nav gains a **"Tax Tools"** item.

### Pages / routes
- `/tax-tools/` — hub: cards for each tool, intro copy, schema, internal links to services.
- `/tax-tools/tax-refund-estimator/`
- `/tax-tools/self-employment-tax-calculator/`
- `/tax-tools/s-corp-vs-llc-calculator/`

### A1. Federal Refund Estimator (TY2025)
- **Inputs:** filing status (Single / MFJ / HoH), total income (wages), federal tax withheld, optional adjustments, optional itemized total (else standard deduction auto-applies), optional credits.
- **Output:** estimated federal tax, refund **or** balance due, effective rate, marginal bracket.
- **Excludes (disclaimed):** most credits (CTC/EITC), QBI, OBBBA add-on deductions (tips/overtime/senior). Positioned as a ballpark that ends in "book a consult for your exact number."

### A2. Self-Employment & Quarterly Estimated Tax Calculator (TY2025)
- **Inputs:** net self-employment profit, filing status, optional other household income, optional W-2 Social-Security wages already paid (to cap SS correctly).
- **Computes:** SE earnings = profit × 0.9235; SS = 12.4% × min(SE earnings, $176,100 − W-2 SS wages); Medicare = 2.9% × SE earnings; +0.9% additional Medicare over the filing-status threshold; half-SE-tax deduction; income tax on (profit − ½ SE tax + other income − standard deduction); **total estimated tax** and **quarterly payment** (÷4).
- **Output:** SE tax, income tax, total, per-quarter amount, **2026 due dates** (Apr 15 / Jun 15 / Sep 15, 2026; Jan 15, 2027).
- **Excludes (disclaimed):** QBI (optional simplified toggle, off by default), state tax, credits.

### A3. S-Corp vs. LLC Tax-Savings Calculator (TY2025) — the lead-magnet star
- **Inputs:** net business profit, proposed **reasonable salary** (S-corp), optional added S-corp cost (default $2,000 = payroll service + 1120-S prep).
- **Computes:**
  - *As LLC/sole-prop:* SE tax on full profit (0.9235 factor, SS capped at wage base, 2.9% Medicare).
  - *As S-corp:* FICA/payroll tax on **salary only** (12.4% SS to cap + 2.9% Medicare); distributions (profit − salary) escape SE/FICA.
  - *Net savings* = LLC SE tax − S-corp payroll tax − added S-corp cost.
- **Output:** side-by-side comparison, **net annual savings ($)**, plain-English explanation, and a strong CTA: "Reasonable salary is an IRS audit flashpoint — let Wayne set a defensible number." (Income-tax effects are roughly neutral between paths and are noted, not modeled, to keep the comparison honest and legible.)

### Shared architecture
- **Pure math module:** `src/lib/tax/` — `constants2025.ts` (all verified figures, each annotated with its IRS/SSA source + "TY2025" provenance), `brackets.ts` (`computeIncomeTax(taxable, status)`), `seTax.ts`, `scorp.ts`. **No DOM, no Astro** — plain functions, fully unit-testable.
- **UI:** each calculator is an Astro component with a client-side `<script>` (vanilla TS, no framework — preserves the zero-JS-framework, fast, static ethos). The script imports the pure functions, reads inputs, renders results live.
- **Engraved styling:** reuse existing design tokens/components (ivory panels, gold rules, Fraunces/Spectral). A shared `CalculatorShell` pattern: inputs left / results card right (stacks on mobile), `.section-wrap--prose` width discipline.
- **Graceful degradation:** with JS off, inputs render but show a notice ("Enable JavaScript to calculate, or call us — we'll run it for you") + a book/contact CTA. Content (what the tool does, the tax explainer, disclaimer) is server-rendered and indexable regardless.
- **Disclaimer component:** `TaxDisclaimer.astro` — one reusable YMYL block ("Estimates for planning only, not tax advice; TY2025 federal figures; your situation may differ — consult Wayne Jones, CPA"). Appears on every tool.
- **SEO:** per-page title/description/canonical/OG; JSON-LD `WebApplication` (applicationCategory FinanceApplication, offers price 0) + `FAQPage` (3–5 Qs per tool) + `BreadcrumbList`. Internal links each tool → its related service page and `/contact/`.

---

## Component B — Conversion layer

### B1. Booking CTA system (scaffolded, no account needed)
- A `BookConsult.astro` button/section component reading a single config constant `BOOKING_URL` from `src/config/site.ts`.
- **Phase 1 default:** `BOOKING_URL = '/contact/'` (falls back to the existing contact page). When Eric supplies a Calendly/Cal.com/GHL link, change one line → every CTA site-wide becomes real scheduling. Component supports an external URL (new tab + rel) vs internal route transparently.
- Standardize primary CTA copy to **"Book a Free Consultation"** across hero, service pages, tool results, and footer.

### B2. Sticky mobile click-to-call bar
- Fixed bottom bar on **mobile only** (≤640px): "Call (706) 232-8565" `tel:` + "Book" button. Hidden on desktop. Respects safe-area insets, doesn't cover footer CTAs, dismissible-free (always available). Pure CSS/HTML, no JS dependency for the call link.

### B3. Resources / lead-magnet hub
- `/resources/` page listing downloadable PDFs. Phase 1 ships **two real, genuinely useful PDFs** generated at build/author time and committed to `public/resources/`:
  1. **2026 Tax Deadline Calendar** (individual + business + quarterly dates).
  2. **Small-Business Tax-Prep Checklist** (what to gather, by entity type).
- Engraved-branded PDF design. Each is a free download (no gate in Phase 1 — gating needs the Phase-2 email system; for now they're trust/value builders + SEO/linkable assets). Page has schema + CTA.

---

## Component C — Trust layer

### C1. Credentials / trust bar
- A slim band directly under the hero (and reusable on service pages): **Licensed CPA — Georgia #026715 · Licensed in GA & AL · 35+ Years in Practice · IRS e-File Authorized**. Iconography in the engraved gold/navy style. This is the single highest-trust, lowest-effort element given the review gap — it substitutes hard credentials for the missing star rating.

### C2. Hero CTA hierarchy tighten
- Around the existing photo-placeholder ledger card: one dominant primary CTA ("Book a Free Consultation") + one secondary (call), clear visual hierarchy. Keep the engraved aesthetic; no redesign — just sharpen the conversion path and make the trust bar flow from it.

---

## Testing & verification

- **Unit (Vitest, added as devDependency):** each pure tax function tested **test-first** against hand-worked IRS examples — e.g. single filer $50,000 taxable → known bracket tax; SE profit $100,000 → SE tax $14,129.55 (100,000×.9235×.153); S-corp $120k profit / $60k salary → savings vs sole-prop. Edge cases: $0, income spanning the SS wage base, top bracket, additional-Medicare threshold crossing.
- **Build:** `npm run build` clean; new pages in sitemap.
- **Schema/SEO:** existing `validate-schema.cjs` + `audit-seo.cjs` pass (0/0), extended to cover the new routes; **0 base-less internal links.**
- **Visual QA:** Playwright renders of each tool (desktop + mobile + no-JS), trust bar, sticky call bar, hero.
- **Accessibility:** labeled inputs, `aria-live` on results, keyboard-operable, AA contrast (use `--gold-text`).

## Out of scope (Phase 2+, needs client)
Real scheduler account · GHL/Formspree wiring + instant auto-response · GA4/Clarity analytics · real photo/video · review-generation automation · gated lead capture / email nurture · client portal · AI chatbot · domain cutover.

---

## Appendix A — Verified TY2025 constants (sources)

**Income tax brackets (Rev. Proc. 2024-40; OBBBA kept the TCJA rate schedule):**
- Single: 10% ≤ $11,925 · 12% ≤ $48,475 · 22% ≤ $103,350 · 24% ≤ $197,300 · 32% ≤ $250,525 · 35% ≤ $626,350 · 37% > $626,350
- MFJ: 10% ≤ $23,850 · 12% ≤ $96,950 · 22% ≤ $206,700 · 24% ≤ $394,600 · 32% ≤ $501,050 · 35% ≤ $751,600 · 37% > $751,600
- HoH: 10% ≤ $17,000 · 12% ≤ $64,850 · 22% ≤ $103,350 · 24% ≤ $197,300 · 32% ≤ $250,500 · 35% ≤ $626,350 · 37% > $626,350

**Standard deduction (TY2025, per OBBBA — raised above the inflation-only figures):** Single $15,750 · MFJ $31,500 · HoH $23,625.

**Self-employment / FICA (TY2025):** SE rate 15.3% (12.4% Social Security + 2.9% Medicare); net-earnings factor 0.9235; **Social Security wage base $176,100**; Additional Medicare 0.9% over $200,000 (Single/HoH) / $250,000 (MFJ) — not inflation-indexed.

**QBI (§199A, TY2025):** 20%; phase-in thresholds $197,300 (single/other) / $394,600 (MFJ). Excluded from estimators for legibility; disclaimed.

> The implementer MUST re-confirm every constant against the IRS source in `constants2025.ts` comments before shipping, and TDD the math against the worked examples above. If any figure cannot be confirmed, pause and flag — do not guess.

Sources: IRS "Federal income tax rates and brackets"; Tax Foundation 2025 brackets; IRS Rev. Proc. 2025-32 + "One Big Beautiful Bill" provisions (standard deduction); SSA Contribution & Benefit Base ($176,100); IRS Topic 751 / 560 / Schedule SE; IRS §199A guidance.
