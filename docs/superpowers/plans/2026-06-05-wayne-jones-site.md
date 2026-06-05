# Wayne Jones CPA Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page static pitch website for Wayne Jones Accounting Services (Rome GA CPA) that earns trust and captures consultation leads.

**Architecture:** Hand-crafted static site — one `index.html` with anchored sections, one `styles.css` design system, one `script.js` for interactions, an SVG favicon. No framework, no build step. Contact form targets a Formspree endpoint (placeholder) with a JS demo-success fallback so it works before the endpoint exists.

**Tech Stack:** HTML5, modern CSS (custom properties, grid, `clamp()`, IntersectionObserver-driven reveals), vanilla JS. Google Fonts: **Fraunces** (display) + **Libre Franklin** (body). Hostable on GitHub Pages / Cloudflare Pages.

**Aesthetic — "Trusted Ledger":** An accountant's ledger as a premium brand. Navy ink (`#0f2a43`) on cream paper (`#faf8f3`), gold balance-line accents (`#c8a24b`), thin gold ledger rules as dividers, subtle paper grain, generous whitespace, serif headlines.

**Content rule:** Lead with credentials + longevity. **No star ratings or review counts anywhere** (real profile is 2.3★/3 reviews — would hurt the pitch). Every unknown is marked with an HTML comment `<!-- PLACEHOLDER: ... -->` and tracked in `site/README.md`.

---

## File Structure

```
site/
├── index.html            # All markup: header, hero, trust bar, services, who-we-serve, about, why-us, contact, footer
├── assets/
│   ├── styles.css        # Trusted Ledger design system + all section styles
│   ├── script.js         # Mobile nav, sticky-header condense, scroll reveals, form handling
│   └── favicon.svg       # WJ monogram mark
└── README.md             # Hosting steps + placeholder register + go-live checklist
```

Responsibilities: `index.html` = structure + content; `styles.css` = all presentation (tokens defined once in `:root`, reused everywhere — DRY); `script.js` = behavior; `README.md` = handoff doc.

---

## Design Tokens (canonical — defined in Task 1, referenced by name thereafter)

```css
:root {
  /* color */
  --navy: #0f2a43;
  --navy-700: #173955;
  --navy-900: #0a1f33;
  --gold: #c8a24b;
  --gold-600: #b08d3a;
  --cream: #faf8f3;
  --cream-200: #f1ece0;
  --ink: #1a1a1a;
  --slate: #5a6b7b;
  --line: rgba(15, 42, 67, 0.12);
  --line-gold: rgba(200, 162, 75, 0.45);
  --white: #ffffff;

  /* type */
  --font-display: "Fraunces", Georgia, "Times New Roman", serif;
  --font-body: "Libre Franklin", system-ui, -apple-system, sans-serif;

  /* scale */
  --container: 1180px;
  --gutter: clamp(1.25rem, 4vw, 3rem);
  --radius: 4px;
  --radius-lg: 10px;
  --shadow-sm: 0 1px 3px rgba(10, 31, 51, 0.08);
  --shadow-md: 0 14px 40px -18px rgba(10, 31, 51, 0.35);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Fonts (in `<head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Libre+Franklin:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## Content Reference (verified facts — use verbatim)

- **Name:** Wayne Jones Accounting Services · **Brand line:** Wayne Jones, CPA
- **NAP:** 101 East 2nd Avenue, Suite 330, Rome, GA 30161 · **(706) 232-8565** · Mon–Fri 9:00 AM – 4:00 PM, Sat–Sun closed
- **Credentials:** GA CPA #026715 · Licensed in Georgia & Alabama · Founded 2008 · 35+ years' experience
- **Facebook:** https://www.facebook.com/p/Wayne-Jones-Accounting-Services-100063056748027/
- **tel link:** `tel:+17062328565`
- Placeholders: headshot, AICPA/GSCPA membership, industry specialties, branded email, final domain (`waynejonescpa.com`), Formspree ID, "Website by" credit.

---

## Task 1: Scaffold + design system + base

**Files:**
- Create: `site/index.html`
- Create: `site/assets/styles.css`
- Create: `site/assets/favicon.svg`

- [ ] **Step 1: Create `favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0f2a43"/>
  <rect x="10" y="44" width="44" height="2" fill="#c8a24b"/>
  <text x="32" y="40" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#faf8f3">WJ</text>
</svg>
```

- [ ] **Step 2: Create `index.html` skeleton** — doctype, lang, meta charset/viewport, SEO title + meta description, the fonts `<link>` block above, `<link rel="icon" href="assets/favicon.svg">`, `<link rel="stylesheet" href="assets/styles.css">`. Body contains a skip link, empty `<header>`, `<main>` with empty `<section>` stubs (`#home`, `#services`, `#who`, `#about`, `#why`, `#contact`), `<footer>`, and `<script src="assets/script.js" defer>`.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Wayne Jones, CPA — Tax &amp; Accounting in Rome, GA</title>
  <meta name="description" content="Wayne Jones Accounting Services — a Rome, Georgia CPA firm offering tax preparation, bookkeeping, payroll, and business consulting for small businesses and individuals since 2008. Licensed in GA &amp; AL.">
  <link rel="icon" href="assets/favicon.svg">
  <!-- fonts link block here -->
  <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
  <a class="skip-link" href="#home">Skip to content</a>
  <header class="site-header"><!-- Task 2 --></header>
  <main>
    <section id="home" class="hero"><!-- Task 3 --></section>
    <!-- trust bar Task 4 -->
    <section id="services" class="services"><!-- Task 5 --></section>
    <section id="who" class="who"><!-- Task 6 --></section>
    <section id="about" class="about"><!-- Task 7 --></section>
    <section id="why" class="why"><!-- Task 8 --></section>
    <section id="contact" class="contact"><!-- Task 9 --></section>
  </main>
  <footer class="site-footer"><!-- Task 10 --></footer>
  <script src="assets/script.js" defer></script>
</body>
</html>
```

- [ ] **Step 3: Write the design system in `styles.css`** — paste the `:root` token block above, then: modern reset (`*{box-sizing:border-box;margin:0}`), `html{scroll-behavior:smooth}`, `body{font-family:var(--font-body);background:var(--cream);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased}`. Add a fixed grain overlay:

```css
body::before{
  content:""; position:fixed; inset:0; z-index:1; pointer-events:none; opacity:.035;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

Then base utilities (complete): `.container{width:min(100% - 2*var(--gutter), var(--container));margin-inline:auto}`; display headings `h1,h2,h3{font-family:var(--font-display);color:var(--navy);line-height:1.08;font-weight:600;letter-spacing:-.01em}`; `.eyebrow{font:600 .8rem/1 var(--font-body);letter-spacing:.18em;text-transform:uppercase;color:var(--gold-600)}`; section padding `.services,.who,.about,.why,.contact{padding:clamp(4rem,9vw,7rem) 0;position:relative}`; a gold ledger rule helper `.rule{height:0;border-top:1px solid var(--line-gold);box-shadow:0 3px 0 -2px var(--line-gold)}` (double-line ledger effect); buttons:

```css
.btn{display:inline-flex;align-items:center;gap:.5rem;font:600 1rem/1 var(--font-body);
  padding:.95rem 1.6rem;border-radius:var(--radius);border:1.5px solid transparent;
  cursor:pointer;text-decoration:none;transition:transform .25s var(--ease),background .25s,box-shadow .25s}
.btn-primary{background:var(--gold);color:var(--navy-900);box-shadow:var(--shadow-sm)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 24px -10px rgba(200,162,75,.7)}
.btn-ghost{background:transparent;color:var(--navy);border-color:var(--line)}
.btn-ghost:hover{border-color:var(--navy);transform:translateY(-2px)}
.skip-link{position:absolute;left:-999px}.skip-link:focus{left:1rem;top:1rem;z-index:1000;background:var(--navy);color:var(--cream);padding:.6rem 1rem;border-radius:var(--radius)}
:focus-visible{outline:2.5px solid var(--gold);outline-offset:3px}
```

- [ ] **Step 4: Verify base renders**

Run: `cd ~/wayne-jones-cpa && python3 -m http.server 8080 --directory site` then open `http://localhost:8080`.
Expected: cream background, no console errors, Fraunces/Libre Franklin loaded (check Network), favicon shows.
Also run: `grep -c 'assets/styles.css\|assets/script.js\|fonts.googleapis' site/index.html` → Expected: `3`.

- [ ] **Step 5: Commit**

```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): scaffold + Trusted Ledger design system"
```

---

## Task 2: Sticky header + navigation

**Files:** Modify `site/index.html` (`<header>`), `site/assets/styles.css`, create `site/assets/script.js`.

- [ ] **Step 1: Header markup** — brand (favicon-style WJ monogram inline SVG + "Wayne Jones, CPA"), nav links to `#services #about #why #contact` labeled Services / About / Why Us / Contact, a `.btn-primary` "Request a Consultation" → `#contact`, and a `.nav-toggle` button (`aria-expanded="false"`, `aria-controls="nav"`).

```html
<div class="container header-inner">
  <a class="brand" href="#home" aria-label="Wayne Jones, CPA — home">
    <svg class="brand-mark" viewBox="0 0 64 64" width="40" height="40" aria-hidden="true"><rect width="64" height="64" rx="12" fill="#0f2a43"/><rect x="10" y="44" width="44" height="2" fill="#c8a24b"/><text x="32" y="40" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="700" fill="#faf8f3">WJ</text></svg>
    <span class="brand-text"><strong>Wayne Jones</strong><em>CPA</em></span>
  </a>
  <button class="nav-toggle" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
  <nav id="nav" class="nav">
    <a href="#services">Services</a><a href="#about">About</a><a href="#why">Why Us</a><a href="#contact">Contact</a>
    <a href="#contact" class="btn btn-primary nav-cta">Request a Consultation</a>
  </nav>
</div>
```

- [ ] **Step 2: Header CSS** — sticky, cream translucent, condenses on `.is-scrolled` (smaller padding + shadow + hairline). Complete rules:

```css
.site-header{position:sticky;top:0;z-index:100;background:rgba(250,248,243,.85);backdrop-filter:blur(10px);border-bottom:1px solid transparent;transition:padding .3s var(--ease),box-shadow .3s,border-color .3s}
.site-header.is-scrolled{box-shadow:var(--shadow-sm);border-color:var(--line)}
.header-inner{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 0;transition:padding .3s var(--ease)}
.is-scrolled .header-inner{padding:.6rem 0}
.brand{display:flex;align-items:center;gap:.7rem;text-decoration:none}
.brand-text{display:flex;flex-direction:column;line-height:1}
.brand-text strong{font:600 1.1rem var(--font-display);color:var(--navy);letter-spacing:-.01em}
.brand-text em{font:500 .68rem var(--font-body);letter-spacing:.28em;text-transform:uppercase;color:var(--gold-600);font-style:normal}
.nav{display:flex;align-items:center;gap:2rem}
.nav>a:not(.btn){font:500 .98rem var(--font-body);color:var(--navy);text-decoration:none;position:relative;padding:.2rem 0}
.nav>a:not(.btn)::after{content:"";position:absolute;left:0;bottom:-2px;width:0;height:2px;background:var(--gold);transition:width .3s var(--ease)}
.nav>a:not(.btn):hover::after{width:100%}
.nav-cta{padding:.6rem 1.1rem;font-size:.92rem}
.nav-toggle{display:none}
@media(max-width:860px){
  .nav-toggle{display:flex;flex-direction:column;gap:5px;background:none;border:0;cursor:pointer;padding:.4rem}
  .nav-toggle span{width:26px;height:2px;background:var(--navy);transition:.3s var(--ease)}
  .nav-toggle[aria-expanded="true"] span:nth-child(1){transform:translateY(7px) rotate(45deg)}
  .nav-toggle[aria-expanded="true"] span:nth-child(2){opacity:0}
  .nav-toggle[aria-expanded="true"] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
  .nav{position:fixed;inset:0 0 0 auto;width:min(78vw,320px);flex-direction:column;align-items:flex-start;justify-content:center;gap:1.5rem;padding:2rem;background:var(--cream);box-shadow:var(--shadow-md);transform:translateX(100%);transition:transform .35s var(--ease)}
  .nav.is-open{transform:translateX(0)}
  .nav>a:not(.btn){font-size:1.3rem;font-family:var(--font-display)}
}
```

- [ ] **Step 3: Create `script.js` with nav + scroll behavior**

```js
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 24), { passive: true });

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}));
```

- [ ] **Step 4: Verify** — reload `http://localhost:8080`. Expected: header sticks; scrolling down adds shadow + shrinks; on a <860px viewport the hamburger opens a slide-in panel and toggles `aria-expanded`; clicking a link closes it. Run `grep -c 'aria-expanded' site/index.html` → `1`.

- [ ] **Step 5: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): sticky header + responsive nav"
```

---

## Task 3: Hero

**Files:** Modify `site/index.html` (`#home`), `site/assets/styles.css`.

- [ ] **Step 1: Hero markup** — two columns. Left: eyebrow, H1, subhead, two CTAs, trust line. Right: a decorative "ledger card" (balance-sheet motif) doubling as the brand visual (no photo needed). Stagger reveals via inline `style="--d:1"` etc.

```html
<div class="container hero-inner">
  <div class="hero-copy">
    <p class="eyebrow reveal" style="--d:0">Certified Public Accountant · Rome, Georgia</p>
    <h1 class="reveal" style="--d:1">Rome's trusted name in tax &amp; accounting since 2008.</h1>
    <p class="hero-sub reveal" style="--d:2">Personal, year-round CPA service for small businesses and individuals across Northwest Georgia and Alabama — from everyday bookkeeping to tax season and beyond.</p>
    <div class="hero-cta reveal" style="--d:3">
      <a href="#contact" class="btn btn-primary">Request a Free Consultation</a>
      <a href="tel:+17062328565" class="btn btn-ghost">Call (706) 232-8565</a>
    </div>
    <p class="hero-trust reveal" style="--d:4">Licensed in Georgia &amp; Alabama · GA CPA #026715</p>
  </div>
  <aside class="ledger-card reveal" style="--d:3" aria-hidden="true">
    <div class="ledger-head"><span>Wayne Jones, CPA</span><span class="est">EST. 2008</span></div>
    <ul class="ledger-lines">
      <li><span>Tax Preparation &amp; Planning</span><span class="chk">✓</span></li>
      <li><span>Bookkeeping &amp; Write-Up</span><span class="chk">✓</span></li>
      <li><span>Payroll &amp; HR</span><span class="chk">✓</span></li>
      <li><span>Business Consulting</span><span class="chk">✓</span></li>
    </ul>
    <div class="ledger-total"><span>Balance</span><span class="total-val">Peace of mind</span></div>
  </aside>
</div>
```

- [ ] **Step 2: Hero CSS** (complete):

```css
.hero{padding:clamp(3rem,8vw,6rem) 0 clamp(3rem,7vw,5rem);position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;inset:0;z-index:-1;background:
  repeating-linear-gradient(180deg,transparent 0 38px,var(--line) 38px 39px);opacity:.5;mask-image:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent)}
.hero-inner{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(2rem,5vw,4.5rem);align-items:center}
.hero h1{font-size:clamp(2.4rem,5.4vw,4.1rem);margin:1rem 0;font-weight:600}
.hero-sub{font-size:clamp(1.05rem,1.6vw,1.25rem);color:var(--slate);max-width:34ch}
.hero-cta{display:flex;flex-wrap:wrap;gap:1rem;margin:2rem 0 1.1rem}
.hero-trust{font-size:.92rem;color:var(--slate);letter-spacing:.01em}
.hero-trust::before{content:"";display:inline-block;width:26px;height:1px;background:var(--gold);vertical-align:middle;margin-right:.6rem}
/* ledger card */
.ledger-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);padding:1.7rem;box-shadow:var(--shadow-md);position:relative}
.ledger-card::before{content:"";position:absolute;left:0;top:0;width:6px;height:100%;background:var(--gold);border-radius:var(--radius-lg) 0 0 var(--radius-lg)}
.ledger-head{display:flex;justify-content:space-between;align-items:baseline;font-family:var(--font-display);color:var(--navy);font-size:1.15rem;padding-bottom:1rem;border-bottom:2px solid var(--line)}
.ledger-head .est{font:600 .7rem var(--font-body);letter-spacing:.16em;color:var(--gold-600)}
.ledger-lines{list-style:none;margin:.5rem 0}
.ledger-lines li{display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px dashed var(--line);color:var(--navy-700)}
.ledger-lines .chk{color:var(--gold-600);font-weight:700}
.ledger-total{display:flex;justify-content:space-between;align-items:baseline;padding-top:1rem;font-family:var(--font-display)}
.ledger-total .total-val{color:var(--gold-600);font-style:italic;font-size:1.2rem}
@media(max-width:860px){.hero-inner{grid-template-columns:1fr}.ledger-card{order:-1;max-width:420px}}
```

- [ ] **Step 3: Verify** — reload. Expected: two-column hero on desktop, ledger card on the right with gold spine + checklist; faint horizontal ledger lines behind; CTAs link to `#contact` and dial `tel:+17062328565`; single column on mobile. Run `grep -c 'tel:+17062328565' site/index.html` → `≥1`.

- [ ] **Step 4: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): hero with ledger-card motif"
```

---

## Task 4: Trust bar

**Files:** Modify `site/index.html` (insert after `#home`, before `#services`), `site/assets/styles.css`.

- [ ] **Step 1: Markup**
```html
<section class="trustbar" aria-label="At a glance">
  <div class="container trustbar-inner">
    <div class="stat"><span class="num">2008</span><span class="lbl">Serving Rome since</span></div>
    <div class="stat"><span class="num">35<em>+</em></span><span class="lbl">Years of experience</span></div>
    <div class="stat"><span class="num">GA·AL</span><span class="lbl">Licensed in two states</span></div>
    <div class="stat"><span class="num">1:1</span><span class="lbl">Work directly with Wayne</span></div>
  </div>
</section>
```

- [ ] **Step 2: CSS** (complete):
```css
.trustbar{background:var(--navy);color:var(--cream)}
.trustbar-inner{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;padding:clamp(1.8rem,4vw,2.6rem) 0}
.stat{text-align:center;padding:.5rem;border-right:1px solid rgba(250,248,243,.14)}
.stat:last-child{border-right:0}
.stat .num{display:block;font-family:var(--font-display);font-size:clamp(1.8rem,4vw,2.6rem);color:var(--gold);font-variant-numeric:tabular-nums;line-height:1}
.stat .num em{font-style:normal;font-size:.7em}
.stat .lbl{display:block;margin-top:.4rem;font-size:.85rem;color:rgba(250,248,243,.8);letter-spacing:.02em}
@media(max-width:620px){.trustbar-inner{grid-template-columns:repeat(2,1fr);gap:1.4rem}.stat:nth-child(2n){border-right:0}}
```

- [ ] **Step 3: Verify** — reload. Expected: full-width navy strip, 4 gold tabular figures; 2×2 on narrow screens. Run `grep -c 'class="stat"' site/index.html` → `4`.

- [ ] **Step 4: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): trust bar stats strip"
```

---

## Task 5: Services (6 cards)

**Files:** Modify `site/index.html` (`#services`), `site/assets/styles.css`.

- [ ] **Step 1: Markup** — section head + 6 `.service-card`s, each: ledger number (01–06), inline-SVG gold icon, `<h3>`, description. Copy verbatim:

| # | Title | Description |
|---|---|---|
| 01 | Tax Preparation & Planning | Accurate federal and state returns for businesses and individuals, with year-round planning to keep your tax bill as low as the law allows. |
| 02 | Bookkeeping & Monthly Write-Up | Clean, current books every month — reconciliations, financial statements, and the numbers you need to run your business. |
| 03 | Payroll & HR | Dependable payroll processing, filings, and HR support so your team is paid right and on time. |
| 04 | IRS & Tax-Problem Resolution | Behind on filings or facing a notice? We deal with the IRS and the Georgia DOR on your behalf. |
| 05 | Business Consulting | Entity setup, cash flow, and growth decisions — practical advice from a CPA who knows small business. |
| 06 | Individual Tax Returns | Personal returns handled with care — including investments, retirement, and major life changes. |

```html
<div class="container">
  <p class="eyebrow reveal">What we do</p>
  <h2 class="section-title reveal">Full-service accounting, under one roof.</h2>
  <div class="rule reveal"></div>
  <div class="service-grid">
    <article class="service-card reveal">
      <span class="card-num">01</span>
      <svg class="card-icon" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#b08d3a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6l4 4v16H5V2z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>
      <h3>Tax Preparation &amp; Planning</h3>
      <p>Accurate federal and state returns for businesses and individuals, with year-round planning to keep your tax bill as low as the law allows.</p>
    </article>
    <!-- repeat for 02–06 with the icons below and copy from the table -->
  </div>
</div>
```
Icons (one per card, reuse the `.card-icon` wrapper, swap inner paths): 02 book `M4 4h12a2 2 0 012 2v14H6a2 2 0 01-2-2z` + `M8 4v16`; 03 people `M16 7a4 4 0 11-8 0 4 4 0 018 0z` + `M3 21v-1a6 6 0 0112 0v1`; 04 shield `M12 2l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V5z` + `M9 12l2 2 4-4`; 05 chart `M4 20V4M4 20h16` + `M8 16l3-4 3 2 4-6`; 06 user-file `M14 2H6v20h12V8z` + `M14 2v6h4` + `M9 13a2 2 0 104 0`.

- [ ] **Step 2: CSS** (complete):
```css
.section-title{font-size:clamp(1.8rem,3.6vw,2.7rem);margin:.6rem 0 1.2rem;max-width:18ch}
.service-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem;margin-top:2.4rem}
.service-card{position:relative;background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);padding:2rem 1.6rem 1.7rem;overflow:hidden;transition:transform .3s var(--ease),box-shadow .3s var(--ease),border-color .3s}
.service-card::before{content:"";position:absolute;left:0;top:0;width:100%;height:3px;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .35s var(--ease)}
.service-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-md);border-color:transparent}
.service-card:hover::before{transform:scaleX(1)}
.card-num{font-family:var(--font-display);font-size:.95rem;color:var(--gold-600);letter-spacing:.05em}
.card-icon{display:block;margin:.6rem 0 1rem}
.service-card h3{font-size:1.28rem;margin-bottom:.5rem}
.service-card p{color:var(--slate);font-size:.97rem}
@media(max-width:860px){.service-grid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.service-grid{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verify** — reload. Expected: 6 cards (3/2/1 cols by width); hover lifts card + reveals gold top rule. Run `grep -c 'class="service-card' site/index.html` → `6`.

- [ ] **Step 4: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): services grid (6 cards)"
```

---

## Task 6: Who we serve

**Files:** Modify `site/index.html` (`#who`), `site/assets/styles.css`.

- [ ] **Step 1: Markup** — split: copy left, client-type list right. `<!-- PLACEHOLDER: confirm industry specialties with owner -->`
```html
<div class="container who-inner">
  <div class="reveal">
    <p class="eyebrow">Who we serve</p>
    <h2 class="section-title">Built for Rome's small businesses — and the people behind them.</h2>
    <p class="lead">From Main Street shops and contractors to professional practices and growing startups, Wayne Jones Accounting Services handles the books, payroll, and taxes so you can focus on your business. Individuals get that same personal attention at tax time and all year long.</p>
  </div>
  <ul class="who-list reveal">
    <li>Small businesses &amp; LLCs</li>
    <li>Sole proprietors &amp; contractors</li>
    <li>Professional practices</li>
    <li>Startups &amp; new ventures</li>
    <li>Individuals &amp; families</li>
  </ul>
</div>
```

- [ ] **Step 2: CSS** (complete):
```css
.who{background:linear-gradient(180deg,var(--cream),var(--cream-200))}
.who-inner{display:grid;grid-template-columns:1.2fr .8fr;gap:clamp(2rem,5vw,4rem);align-items:center}
.lead{font-size:1.12rem;color:var(--navy-700);max-width:46ch}
.who-list{list-style:none;display:grid;gap:.2rem}
.who-list li{font-family:var(--font-display);font-size:1.15rem;color:var(--navy);padding:.9rem 0 .9rem 2rem;border-bottom:1px dashed var(--line);position:relative}
.who-list li::before{content:"§";position:absolute;left:0;color:var(--gold-600);font-weight:700}
@media(max-width:860px){.who-inner{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verify** — reload. Expected: two-column band with tinted background and a ledger-style client list. Run `grep -c 'PLACEHOLDER' site/index.html` → `≥1`.

- [ ] **Step 4: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): who-we-serve section"
```

---

## Task 7: About Wayne

**Files:** Modify `site/index.html` (`#about`), `site/assets/styles.css`.

- [ ] **Step 1: Markup** — portrait placeholder (monogram seal, looks intentional) + bio + credentials list. `<!-- PLACEHOLDER: replace .portrait with Wayne's headshot --> <!-- PLACEHOLDER: confirm legal name (Harold Wayne Jones?) --> <!-- PLACEHOLDER: confirm AICPA / Georgia Society of CPAs membership -->`
```html
<div class="container about-inner">
  <div class="portrait reveal" role="img" aria-label="Wayne Jones, CPA">
    <span class="portrait-mono">WJ</span>
    <span class="portrait-cap">Wayne Jones, CPA</span>
  </div>
  <div class="about-copy reveal">
    <p class="eyebrow">Meet your accountant</p>
    <h2 class="section-title">A CPA who actually answers the phone.</h2>
    <p>For more than three decades, Wayne Jones has helped Northwest Georgia businesses and families make sense of their numbers. A Certified Public Accountant licensed in both Georgia and Alabama, Wayne opened Wayne Jones Accounting Services in downtown Rome in 2008 with a simple promise: every client works directly with him — not a rotating cast of associates.</p>
    <p>The result is accounting that's accurate, approachable, and genuinely personal.</p>
    <ul class="creds">
      <li>Certified Public Accountant — GA license #026715</li>
      <li>Licensed in Georgia &amp; Alabama</li>
      <li>35+ years of accounting experience</li>
      <li>Serving downtown Rome since 2008</li>
    </ul>
  </div>
</div>
```

- [ ] **Step 2: CSS** (complete):
```css
.about-inner{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(2rem,5vw,4rem);align-items:center}
.portrait{aspect-ratio:4/5;border-radius:var(--radius-lg);background:linear-gradient(160deg,var(--navy),var(--navy-900));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;box-shadow:var(--shadow-md);border:1px solid var(--navy-700);position:relative}
.portrait::after{content:"";position:absolute;inset:14px;border:1px solid var(--line-gold);border-radius:6px}
.portrait-mono{font-family:var(--font-display);font-size:clamp(3rem,8vw,5rem);color:var(--gold);letter-spacing:.05em}
.portrait-cap{font:500 .8rem var(--font-body);letter-spacing:.16em;text-transform:uppercase;color:rgba(250,248,243,.75)}
.about-copy p{color:var(--navy-700);margin-bottom:1rem;max-width:54ch}
.creds{list-style:none;margin-top:1.4rem;display:grid;gap:.7rem}
.creds li{padding-left:1.8rem;position:relative;color:var(--navy);font-weight:500}
.creds li::before{content:"✓";position:absolute;left:0;color:var(--gold-600);font-weight:700}
@media(max-width:760px){.about-inner{grid-template-columns:1fr}.portrait{max-width:300px}}
```

- [ ] **Step 3: Verify** — reload. Expected: navy monogram "portrait" with inset gold frame next to bio + checked credentials. Confirm 3 PLACEHOLDER comments exist: `grep -c 'PLACEHOLDER' site/index.html` increased by 3 vs Task 6.

- [ ] **Step 4: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): about Wayne + credentials"
```

---

## Task 8: Why choose us

**Files:** Modify `site/index.html` (`#why`), `site/assets/styles.css`.

- [ ] **Step 1: Markup** — 4 value props (icon + h3 + line). Copy:
1. **You work directly with Wayne** — No call centers, no hand-offs. The CPA who reviews your return is the one who answers your call.
2. **Local & accessible** — A familiar face in downtown Rome, not a faceless national chain.
3. **Decades of experience** — 35+ years navigating tax law for small businesses and individuals.
4. **One firm, start to finish** — Books, payroll, and taxes under one roof, with one point of contact.
```html
<div class="container">
  <p class="eyebrow reveal">Why Wayne Jones</p>
  <h2 class="section-title reveal">The difference is personal.</h2>
  <div class="why-grid">
    <div class="why-item reveal"><span class="why-no">01</span><h3>You work directly with Wayne</h3><p>No call centers, no hand-offs. The CPA who reviews your return is the one who answers your call.</p></div>
    <!-- items 02–04 from copy above -->
  </div>
</div>
```

- [ ] **Step 2: CSS** (complete):
```css
.why{background:var(--navy);color:var(--cream)}
.why .eyebrow{color:var(--gold)}
.why .section-title{color:var(--cream)}
.why-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.2rem 3rem;margin-top:2.4rem}
.why-item{padding:1.6rem 0 1.6rem 0;border-top:1px solid rgba(250,248,243,.16);display:grid;grid-template-columns:auto 1fr;gap:.4rem 1.2rem;align-items:start}
.why-no{grid-row:span 2;font-family:var(--font-display);font-size:2rem;color:var(--gold);line-height:1}
.why-item h3{color:var(--cream);font-size:1.25rem}
.why-item p{color:rgba(250,248,243,.78);font-size:.98rem}
@media(max-width:760px){.why-grid{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verify** — reload. Expected: navy section, 4 numbered value props (2×2 → 1 col). Run `grep -c 'class="why-item' site/index.html` → `4`.

- [ ] **Step 4: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): why-choose-us section"
```

---

## Task 9: Contact + lead form

**Files:** Modify `site/index.html` (`#contact`), `site/assets/styles.css`, `site/assets/script.js`.

- [ ] **Step 1: Markup** — two columns: form + contact aside with map. `<!-- PLACEHOLDER: replace FORMSPREE_ID with real Formspree form id -->`
```html
<div class="container contact-inner">
  <div class="contact-copy reveal">
    <p class="eyebrow">Get started</p>
    <h2 class="section-title">Let's talk about your books.</h2>
    <p class="lead">Request a free, no-obligation consultation. Tell us a little about what you need and we'll be in touch.</p>
    <ul class="contact-facts">
      <li><strong>Office</strong>101 East 2nd Avenue, Suite 330<br>Rome, GA 30161</li>
      <li><strong>Phone</strong><a href="tel:+17062328565">(706) 232-8565</a></li>
      <li><strong>Hours</strong>Mon–Fri 9:00 AM – 4:00 PM<br>Sat–Sun closed</li>
    </ul>
    <iframe class="map" title="Map to Wayne Jones Accounting Services" loading="lazy" src="https://maps.google.com/maps?q=101%20E%202nd%20Ave%20Suite%20330%20Rome%20GA%2030161&output=embed"></iframe>
  </div>
  <form class="lead-form reveal" action="https://formspree.io/f/FORMSPREE_ID" method="POST" novalidate>
    <div class="field"><label for="name">Full name</label><input id="name" name="name" type="text" required></div>
    <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required></div>
    <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel"></div>
    <div class="field"><label for="interest">I'm interested in</label>
      <select id="interest" name="interest">
        <option>Tax preparation</option><option>Bookkeeping</option><option>Payroll</option>
        <option>IRS / tax problem</option><option>Business consulting</option><option>Something else</option>
      </select></div>
    <div class="field"><label for="msg">How can we help?</label><textarea id="msg" name="message" rows="4"></textarea></div>
    <button class="btn btn-primary" type="submit">Request My Consultation</button>
    <p class="form-status" role="status" aria-live="polite"></p>
  </form>
</div>
```

- [ ] **Step 2: CSS** (complete):
```css
.contact-inner{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,4rem)}
.contact-facts{list-style:none;margin:1.6rem 0;display:grid;gap:1.1rem}
.contact-facts li{display:grid;gap:.15rem;padding-left:0}
.contact-facts strong{font:600 .78rem var(--font-body);letter-spacing:.14em;text-transform:uppercase;color:var(--gold-600)}
.contact-facts a{color:var(--navy);text-decoration:none;border-bottom:1px solid var(--line-gold)}
.map{width:100%;height:220px;border:1px solid var(--line);border-radius:var(--radius-lg);margin-top:.5rem;filter:grayscale(.2)}
.lead-form{background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);padding:clamp(1.5rem,3vw,2.4rem);box-shadow:var(--shadow-md);align-self:start}
.field{margin-bottom:1.1rem;display:grid;gap:.4rem}
.field label{font:600 .9rem var(--font-body);color:var(--navy)}
.field input,.field select,.field textarea{font:400 1rem var(--font-body);padding:.8rem .9rem;border:1px solid var(--line);border-radius:var(--radius);background:var(--cream);color:var(--ink);transition:border-color .2s,box-shadow .2s}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px var(--line-gold)}
.form-status{margin-top:.8rem;font-weight:600;min-height:1.2em}
.form-status.ok{color:#1f7a4d}.form-status.err{color:#b23b3b}
@media(max-width:860px){.contact-inner{grid-template-columns:1fr}}
```

- [ ] **Step 3: Append form handling to `script.js`** — demo-success while the action still says `FORMSPREE_ID`; once a real id is set, POST via fetch.
```js
const form = document.querySelector('.lead-form');
if (form) form.addEventListener('submit', async (e) => {
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) return; // let native validation show
  e.preventDefault();
  const placeholder = form.action.includes('FORMSPREE_ID');
  if (placeholder) {
    status.className = 'form-status ok';
    status.textContent = 'Thanks! This is a demo — connect a Formspree ID to receive real submissions.';
    form.reset();
    return;
  }
  status.textContent = 'Sending…'; status.className = 'form-status';
  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (res.ok) { status.className = 'form-status ok'; status.textContent = 'Thanks — we\'ll be in touch shortly.'; form.reset(); }
    else throw new Error();
  } catch { status.className = 'form-status err'; status.textContent = 'Something went wrong — please call (706) 232-8565.'; }
});
```

- [ ] **Step 4: Verify** — reload. Expected: form left/right beside contact facts + Google map of 101 E 2nd Ave; submitting a valid form shows the green demo message and resets; empty required fields trigger native validation. Run `grep -c 'FORMSPREE_ID' site/index.html` → `1`.

- [ ] **Step 5: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): contact section + lead form"
```

---

## Task 10: Footer

**Files:** Modify `site/index.html` (`<footer>`), `site/assets/styles.css`.

- [ ] **Step 1: Markup** — `<!-- PLACEHOLDER: confirm "Website by" credit -->`
```html
<div class="container footer-inner">
  <div class="footer-brand">
    <span class="brand-text"><strong>Wayne Jones</strong><em>CPA · Rome, GA</em></span>
    <p>101 East 2nd Avenue, Suite 330, Rome, GA 30161<br>GA CPA #026715 · Licensed in Georgia &amp; Alabama</p>
  </div>
  <nav class="footer-nav" aria-label="Footer"><a href="#services">Services</a><a href="#about">About</a><a href="#why">Why Us</a><a href="#contact">Contact</a></nav>
  <div class="footer-meta">
    <p><strong>(706) 232-8565</strong><br>Mon–Fri 9:00 AM – 4:00 PM</p>
    <a class="fb" href="https://www.facebook.com/p/Wayne-Jones-Accounting-Services-100063056748027/" aria-label="Facebook">Facebook ↗</a>
  </div>
</div>
<div class="container footer-base"><span>© 2026 Wayne Jones Accounting Services. All rights reserved.</span><span>Website by Synergy</span></div>
```

- [ ] **Step 2: CSS** (complete):
```css
.site-footer{background:var(--navy-900);color:rgba(250,248,243,.8);padding:clamp(2.6rem,5vw,4rem) 0 1.6rem}
.footer-inner{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:2rem;padding-bottom:2rem;border-bottom:1px solid rgba(250,248,243,.14)}
.footer-brand .brand-text strong{color:var(--cream);font:600 1.3rem var(--font-display)}
.footer-brand .brand-text em{color:var(--gold);font-style:normal;letter-spacing:.16em;font-size:.7rem;text-transform:uppercase;display:block;margin-top:.2rem}
.footer-brand p{margin-top:.9rem;font-size:.9rem;line-height:1.7}
.footer-nav{display:grid;gap:.6rem;align-content:start}
.footer-nav a,.fb{color:rgba(250,248,243,.8);text-decoration:none}
.footer-nav a:hover,.fb:hover{color:var(--gold)}
.footer-meta{display:grid;gap:1rem;align-content:start}
.footer-base{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem;padding-top:1.4rem;font-size:.82rem;color:rgba(250,248,243,.55)}
@media(max-width:760px){.footer-inner{grid-template-columns:1fr 1fr}.footer-brand{grid-column:1/-1}}
```

- [ ] **Step 3: Verify** — reload. Expected: dark footer with NAP, license line, nav, phone/hours, Facebook link, and base bar. Run `grep -c 'facebook.com/p/Wayne-Jones' site/index.html` → `1`.

- [ ] **Step 4: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): footer"
```

---

## Task 11: Scroll reveals + reduced motion

**Files:** Modify `site/assets/styles.css`, `site/assets/script.js`.

- [ ] **Step 1: Reveal CSS**
```css
.reveal{opacity:0;transform:translateY(18px);transition:opacity .7s var(--ease),transform .7s var(--ease);transition-delay:calc(var(--d,0)*90ms)}
.reveal.is-visible{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1!important;transform:none!important;transition:none}html{scroll-behavior:auto}}
```

- [ ] **Step 2: Append observer to `script.js`**
```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if (reduce || !('IntersectionObserver' in window)) {
  reveals.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(el => io.observe(el));
}
```

- [ ] **Step 3: Verify** — reload: sections fade/rise in on scroll; hero stagger via `--d`. Toggle OS "reduce motion" (or DevTools rendering emulation) → everything visible, no animation. Confirm no element stays stuck at opacity 0 after scrolling past.

- [ ] **Step 4: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "feat(site): scroll reveals + reduced-motion support"
```

---

## Task 12: Responsive + accessibility + SEO polish

**Files:** Modify `site/index.html`, `site/assets/styles.css`.

- [ ] **Step 1:** Add JSON-LD `AccountingService` schema in `<head>` (name, address, phone, hours, areaServed, GA+AL, url placeholder) for local SEO. Add `<meta property="og:title/description/type">` + `og:image` placeholder comment.
- [ ] **Step 2:** Audit headings (single `h1`; sequential `h2/h3`), every `input/select/textarea` has a `<label for>`, the map `iframe` has `title`, the monogram portrait has `role="img"` + `aria-label`, all interactive elements reachable by keyboard with visible `:focus-visible`.
- [ ] **Step 3:** Test widths 360 / 768 / 1024 / 1280 — no horizontal scroll, tap targets ≥44px, nav panel works, no overlap.
- [ ] **Step 4: Verify**

Run: `grep -c 'application/ld+json' site/index.html` → `1`.
Run (if available): `npx -y html-validate site/index.html` → Expected: 0 errors (warnings ok). If `html-validate` unavailable, skip and rely on browser DevTools "Issues" tab.
Browser: DevTools device toolbar at 360px & 1280px — confirm layout intact, run Lighthouse Accessibility ≥ 95.

- [ ] **Step 5: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "chore(site): a11y, responsive, and SEO polish"
```

---

## Task 13: README + placeholder register + go-live checklist

**Files:** Create `site/README.md`.

- [ ] **Step 1:** Write `README.md` with: (a) one-paragraph overview; (b) **Run locally:** `python3 -m http.server 8080 --directory site`; (c) **Deploy:** push `site/` to GitHub Pages or drag to Cloudflare Pages; (d) **Placeholder register** — table of every `<!-- PLACEHOLDER -->` (headshot, legal name, AICPA/GSCPA, industry specialties, Formspree ID, og:image, domain, "Website by") with what to supply; (e) **Go-live checklist** — set Formspree ID, point domain `waynejonescpa.com`, add real headshot, confirm hours/phone with Wayne, verify GA CPA license active at gsba.georgia.gov, add Google Analytics if desired, submit to Google Search Console.

- [ ] **Step 2: Verify** — `grep -c 'Placeholder\|Go-live\|Formspree' site/README.md` → `≥3`.

- [ ] **Step 3: Commit**
```bash
cd ~/wayne-jones-cpa && git add site && git commit -m "docs(site): README, placeholder register, go-live checklist"
```

---

## Self-Review

**Spec coverage:** header ✓(T2) hero ✓(T3) trust bar ✓(T4) 6 services ✓(T5) who-we-serve ✓(T6) about ✓(T7) why-us ✓(T8) contact form+NAP+map ✓(T9) footer ✓(T10) Trusted-Ledger tokens ✓(T1) no-star-ratings ✓(omitted throughout) placeholders-marked ✓(T6,7,9,10,13) reveals ✓(T11) a11y/SEO ✓(T12). All spec sections map to a task.

**Placeholder scan:** Plan steps contain concrete code/copy; site placeholders are intentional (owner-supplied assets) and centralized in T13's register — not plan gaps.

**Type consistency:** CSS classes referenced in JS (`.site-header`/`is-scrolled`, `.nav-toggle`/`#nav`/`is-open`, `.lead-form`/`.form-status`, `.reveal`/`is-visible`) are all defined in the tasks that introduce them. Token names (`--navy`,`--gold`,`--cream`,`--line-gold`,`--ease`, fonts) defined in T1 and reused verbatim.

**Ambiguity check:** Stack, tokens, copy, and interactions are fully specified; remaining visual latitude is bounded by the locked design tokens.
