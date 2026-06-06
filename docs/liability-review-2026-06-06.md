# Wayne Jones CPA — Professional-Liability & Compliance Review (2026-06-06)

Audit of the live site for features/claims that could create professional liability for Wayne. Synthesized from 4 parallel reviews (tax-tool liability, advertising compliance, factual/credential accuracy, legal-governance gaps), each web-grounded in the relevant standards (IRS deadlines, AICPA Code §1.600.010, GA Rule 20-12-.15, AL Admin Code 30-X-6-.05).

**Not legal advice.** This is a best-practices risk-reduction pass. The final site should still be reviewed by Wayne's attorney / E&O carrier.

Severity: 🔴 Critical · 🟠 High · 🟡 Medium · ⚪ Low.

---

## FIX NOW (conservative — only reduces risk; no unverified claims introduced)

### 🔴 1. Wrong Q2 2026 estimated-tax deadline (factual error)
June 15, 2026 is a **Sunday** → IRS deadline shifts to **Monday, June 16, 2026**. Contradicts the PDF's own weekend-rule note. Fix all 3 + regenerate the PDF:
- `previews/assets/pdf-deadlines.html` — Q2 row `June 15, 2026` → `June 16, 2026`
- `src/pages/tax-tools/self-employment-tax-calculator.astro` — dates `<li>` `June 15, 2026` → `June 16, 2026`
- same file, FAQ answer `June 15, 2026 (Q2)` → `June 16, 2026 (Q2)`
- Re-run `node previews/gen-pdfs.cjs` to rebuild the PDF.
All other dates verified correct (individual Apr 15; Q1/Q3/Q4 Apr 15/Sep 15 2026/Jan 15 2027; 1120-S/1065 Mar 16; C-corp Apr 15; extensions Oct 15).

### 🔴 2. "Rome's most trusted name" superlative
Unprovable comparative claim (AICPA false/misleading; GA/AL board). Replace:
- `src/components/sections/Hero.astro` deck "Rome's most trusted name in tax & accounting." → **"Personal, year-round tax & accounting — from a CPA who answers his own phone."**
- `src/config.ts` `tagline` "Rome's trusted name in tax & accounting since 2008." → **"Licensed tax & accounting for Rome, GA — since 2008."**

### 🟠 3. "IRS e-File Authorized" trust-bar item (unverified credential — I added this)
Maps to the IRS "Authorized e-file Provider"/EFIN designation; no evidence Wayne holds it. Replace the credential with a **verified** item:
- `src/components/TrustBar.astro` — "IRS e-File Authorized" → **"Serving Rome Since 2008"** (fully verified, trust-building, no credential implication).
- *(Restorable: if Wayne confirms he's an IRS Authorized e-file Provider, we can add "IRS e-File Provider" back. If he simply e-files returns, "E-File & Direct Deposit" is a safe service statement — but not a credential.)*

### 🟠 4. Calculator result framing reads as authoritative advice
- **Round headline displays** to the nearest $100 so they read as estimates, not precise facts. Add a `roundDisplay(n)` helper (round to nearest 100) used only for the big headline numbers (keep detail rows exact). Apply in all 3 calculators' headline strings.
- **Inline micro-caption** under each `.calc__headline` (reuse the existing-but-unused `.calc__headline-label` class or a new `.calc__headline-note`): **"Rough planning estimate — your actual figure will differ."**
- **S-corp headline relabel**: `"Estimated net savings: $X with S-corp"` → **"Potential SE-tax savings (before income tax): ~$X"** so it can't be read as total tax savings.
- **Privacy assurance** (accurate — calculators are 100% client-side, nothing transmitted/stored; verified no fetch/storage/analytics): add to `TaxDisclaimer.astro`: **"Your numbers stay in your browser — nothing you enter here is sent to us or stored."**

### 🟠 5. "official IRS tax tables/rates" overstates precision
Each tool omits credits/QBI/AMT/NIIT/state tax. In the 3 calculator-page decks:
- `tax-refund-estimator.astro`: "Built with official IRS tax tables by a licensed CPA." → **"Uses 2025 federal tax rates — a simplified estimate that excludes many credits and state tax."**
- `self-employment-tax-calculator.astro` & `s-corp-vs-llc-calculator.astro`: "...built on official IRS rates..." → **"...based on published 2025 federal rates — simplified, excludes credits and state tax."**

### 🟠 6. S-corp "reasonable salary" anchor (audit exposure)
- `ScorpCalculator.astro` salary hint → **"A salary you and your CPA can defend — not just the lowest number. The IRS requires reasonable compensation."**
- Add a results warning when entered salary < 35% of profit: **"⚠ This salary may be below 'reasonable' and is a common audit trigger. Don't set your payroll from this figure — ask Wayne."** (compute in the render script; show/hide a `#sc-warning` element).

### 🟠 7. Outcome/promise softening
- `tax-refund-estimator.astro` related-link "let Wayne file your return and maximize every deduction." → **"...let Wayne prepare your return and review it for the deductions and credits you qualify for."**
- `src/content/services/individual-tax-returns.md` "e-filed for the fastest possible refund via direct deposit." → **"e-filed with direct deposit, the IRS's fastest standard refund method."**
- `self-employment-tax-calculator.astro` FAQ "potentially saving thousands per year." → **"which may reduce self-employment tax for some owners — whether it saves you money depends on your salary, profit, and state."**
- `s-corp-vs-llc-calculator.astro` FAQ "Electing S-corp status is one of the most effective strategies." → **"Electing S-corp status can be one of the most effective strategies for some owners."**
- `tax-tools/index.astro` blurb "See how much an S-corp election could save you." → **"See whether an S-corp election could reduce your self-employment tax."**

### ⚪ 8. PDF per-page disclaimer
Add a CSS `@media print` running footer (or repeat the disclaimer line) so a single detached printed page still carries "Estimates/general info, not tax advice." in both `pdf-deadlines.html` and `pdf-checklist.html`; regenerate.

### 🟠 9. Legal scaffolding (none currently exists)
Add the standard professional-services set. Copy drafted below (accurate to this static, no-tracking site).
- **New page** `src/pages/privacy.astro` (Privacy Policy) — mirror `faq.astro` structure (BaseLayout + Breadcrumbs + `.section-wrap--prose`).
- **New page** `src/pages/disclaimer.astro` (Terms of Use & Disclaimer) — same structure.
- **Footer** (`Footer.astro`): add a site-wide disclaimer line + Privacy + Disclaimer links (via `href()`).
- **Contact form** (`ContactForm.astro` + `contact.astro`): consent/"don't send SSNs" line under the submit button, linking Privacy.
- **FAQ** (`faq.astro`): one general-information note after the list.
- **Service pages**: one engagement/no-advice note in the shared service template (`src/pages/services/[slug].astro`), shown once per page.

---

## MUST VERIFY WITH WAYNE (cannot confirm from public data — flagged, not silently changed)

1. **IRS e-File Authorized / EFIN** — does Wayne hold the IRS "Authorized e-file Provider" status? (Fix #3 removes the claim in the interim.) If yes → we can restore "IRS e-File Provider."
2. **"35+ Years"** — accurate as *years practicing as a CPA*? (Inferred CPA since ~1988 → ~38 yrs; conservative & likely true, used consistently and kept distinct from the firm's "since 2008." Left in place; confirm before launch. If cautious, "three decades" is unimpeachable.)
3. **Legal entity** — site uses DBA "Wayne Jones Accounting Services" as `legalName`/copyright; dossier (BBB) says registered entity is **HW Jones, LLC**. Confirm; likely set `SITE.legalName = 'HW Jones, LLC'` (keep display name as the DBA).

Also owner-confirm (non-blocking): AICPA/GSCPA membership is **not** claimed (correct — keep unclaimed unless confirmed); refine placeholder geo coords to the real Suite-330 location.

---

## Already clean (no action)
No fee/refund guarantees; licensure stated accurately (GA + AL, CPA026715) and consistently; dual-state AL-serving pages correctly tied to the AL license; no "#1/leading/premier/award-winning"; no fabricated stats; **no star ratings / review counts** (the 2.3★ profile correctly suppressed); IRS-resolution page exemplary ("no guarantees…"); blog posts already carry a YMYL disclaimer; calculators transmit/store nothing.

---

## Drafted legal copy

### Footer disclaimer line
> The information on this website is provided for general informational purposes only and does not constitute tax, accounting, or legal advice. Viewing this site, using its calculators, or contacting Wayne Jones, CPA does not create a CPA-client relationship. See our Privacy Policy and Disclaimer.

### Contact-form consent line (under submit button)
> By submitting, you agree we may use your information to respond to your inquiry; messages are delivered through our form provider (Formspree). Please **don't** include Social Security numbers or other sensitive information here — call **(706) 232-8565** to share those securely. Submitting this form does not create a CPA-client relationship. See our Privacy Policy.

### Privacy Policy (privacy.astro body)
Use the starter from the governance audit: what we collect (form name/email/phone/interest/message only), Formspree delivery, **no advertising cookies/analytics/pixels** (Google Fonts + a Google Maps embed on contact are the only third-party loads), don't-send-sensitive-info, CPA confidentiality for engagement data, no sale/sharing, contact (706) 232-8565, "last updated 2026-06-06."

### Terms of Use & Disclaimer (disclaimer.astro body)
Use the starter from the governance audit: general-information-only; no CPA-client relationship (engagement begins only by written agreement; scope/fees in a written engagement letter); calculators are simplified estimates — don't rely on them; no warranties ("as is"); third-party links/embeds not controlled; licensing (CPA in GA #CPA026715 and AL); contact (706) 232-8565.

### FAQ / service-page note (one line)
> The information here is general, not advice for your specific situation. Please contact Wayne Jones, CPA to discuss your circumstances; engagement scope and fees are confirmed in writing before any work begins.
