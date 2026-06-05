# Wayne Jones CPA — Website Design Spec

**Date:** 2026-06-05 · **Status:** Approved (direction A) · **Type:** Spec/pitch site to win the client

## Goal
A trust-forward, lead-generating one-page website to pitch Wayne Jones Accounting Services. Built from researched facts (see `../../../research/business-dossier.md`); unknowns marked as placeholders.

## Stack
- **Static HTML + hand-crafted CSS + minimal vanilla JS.** No framework, no build step.
- Single landing page (`site/index.html`) with anchored smooth-scroll nav.
- Contact form posts to **Formspree** (placeholder endpoint) → works with zero backend.
- Hostable on GitHub Pages / Cloudflare Pages (matches existing client sites).
- Hand-crafted CSS (not a template) for a bespoke, non-generic feel.

## Visual direction — "Trusted Ledger" (approved)
- **Palette:** navy `#0f2a43` (primary) · gold `#c8a24b` (accent) · cream `#faf8f3` (bg) · ink `#1a1a1a` · slate `#5a6b7b` (muted).
- **Type:** Serif headlines (authoritative — e.g. *Fraunces* / *Playfair*-class via system or Google Fonts) + humanist sans body (e.g. *Inter* / *Source Sans*).
- **Texture:** subtle paper/linen grain on cream sections; generous whitespace; thin gold rules as ledger motif.
- **Tone:** established, premium, trustworthy. Local Rome pride.

## Page structure & content
1. **Header (sticky):** logo wordmark "Wayne Jones, CPA" · nav (Services · About · Why Us · Contact) · persistent CTA button "Request a Consultation" + phone.
2. **Hero:** H1 "Rome's trusted name in tax & accounting since 2008." Subhead on personal, full-service CPA care. Primary CTA *Request a Free Consultation* · secondary click-to-call **(706) 232-8565**. Trust microcopy: Licensed GA & AL.
3. **Trust bar:** Licensed GA & AL · GA CPA #026715 · Serving Rome since 2008 · 35+ years' experience · Small business & individuals.
4. **Services (6 cards):** Tax Preparation & Planning · Bookkeeping & Monthly Write-Up · Payroll & HR · IRS & Tax-Problem Resolution · Business Consulting · Individual Tax Returns. Each: icon + 1-line benefit.
5. **Who we serve:** small businesses + individuals; one firm for books → payroll → taxes. Industry specialties = `[[PLACEHOLDER]]`.
6. **About Wayne:** bio — decades-long CPA, downtown Rome, licensed GA & AL, personal hands-on service. Headshot = `[[PLACEHOLDER]]`. Legal name `[[CONFIRM: Harold Wayne Jones?]]`.
7. **Why choose us:** personal service (you work directly with Wayne) · local & accessible · decades of experience · one-stop full-cycle · year-round (not just tax season).
8. **Contact / lead capture:** consultation form (name, email, phone, service interest, message) + NAP block (101 E 2nd Ave, Ste 330, Rome GA 30161 · (706) 232-8565 · email `[[CONFIRM branded email]]`) · hours Mon–Fri 9–4 · embedded map.
9. **Footer:** NAP, license #, hours, social (Facebook), copyright. Subtle "Site by [[Synergy]]" optional.

## Copy rules
- Lead with credentials + longevity, NOT reviews. **No star ratings or review counts anywhere** (2.3★/3 reviews would hurt the pitch).
- Warm, professional, plain-English (not jargon). Reassuring for tax-anxious readers.
- Every CTA points to consultation form or phone.

## CTAs
- Primary: **Request a Free Consultation** (scrolls to form).
- Secondary: **click-to-call** (706) 232-8565 (tel: link).
- Persistent header button.

## Placeholder register (to confirm with owner before go-live)
- `[[HEADSHOT]]` — photo of Wayne / office (using styled monogram fallback for now).
- `[[YEARS]]` — exact CPA tenure (using "35+ years" / "since 2008" from research).
- `[[AFFILIATIONS]]` — AICPA / Georgia Society of CPAs membership (omitted until confirmed).
- `[[TESTIMONIALS]]` — none real usable; section omitted or generic until collected.
- `[[EMAIL]]` — branded email (research shows only wsdj@bellsouth.net; using a "request" form instead of exposing it).
- `[[DOMAIN]]` — assuming `waynejonescpa.com`.
- `[[SPECIALTIES]]` — industry niches.
- `[[FORMSPREE_ID]]` — form endpoint.

## Out of scope (YAGNI)
Blog, client portal/login, online payments, multi-page site, booking calendar. Can add later if the client signs.

## Verified facts baked in
HW Jones LLC dba Wayne Jones Accounting Services · 101 E 2nd Ave Ste 330, Rome GA 30161 · (706) 232-8565 · Mon–Fri 9–4 · GA CPA #026715 · licensed GA + AL · founded 2008 · services per dossier.
