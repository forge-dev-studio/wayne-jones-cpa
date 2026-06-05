# Wayne Jones, CPA — Static Website

Single-page static pitch site for Wayne Jones Accounting Services (Rome, GA CPA). Built with hand-crafted HTML5, modern CSS (custom properties, grid, `clamp()`, IntersectionObserver), and vanilla JS. No framework, no build step. The "Trusted Ledger" design theme uses navy, cream, and gold — an accountant's ledger reimagined as a premium brand. The contact form uses Formspree with a JS demo-success fallback.

---

## Run locally

```bash
python3 -m http.server 8080 --directory site
# Then open http://localhost:8080
```

## Deploy

**GitHub Pages:** Push the repo, set Pages source to `site/` (or `docs/` if renamed).  
**Cloudflare Pages:** Connect the repo and set build output directory to `site`. No build command needed.

---

## Placeholder Register

Every `<!-- PLACEHOLDER: ... -->` comment in `index.html` corresponds to an item below. Confirm with Wayne before go-live.

| # | Placeholder | Location in `index.html` | What to supply |
|---|---|---|---|
| 1 | Headshot / office photo | `#about` — `.portrait` div | Replace the monogram `.portrait` with a real `<img>` of Wayne or the office. Use `aspect-ratio:4/5`. |
| 2 | Legal name | `#about` — bio copy | Confirm whether legal name is "Harold Wayne Jones" or "Wayne Jones" — update bio if needed. |
| 3 | AICPA / GSCPA membership | `#about` — `.creds` list | If Wayne holds AICPA or Georgia Society of CPAs membership, add as a credential list item. |
| 4 | Industry specialties | `#who` — who-list | Confirm any specific industry niches (e.g., restaurants, healthcare, real estate) to add to the client type list. |
| 5 | Formspree ID | `<form action="...">` in `#contact` | Replace `FORMSPREE_ID` in the form `action` attribute with the real Formspree form ID (e.g., `xrgvabcd`). |
| 6 | og:image | `<head>` Open Graph meta | Provide a 1200×630 JPG/PNG — uncomment the `og:image` and `og:url` meta tags and update with real URL. |
| 7 | Final domain | JSON-LD schema + og:url | Update `https://waynejonescpa.com` if the final domain differs. |
| 8 | "Website by" credit | `<footer>` footer-base | Currently reads "Website by Synergy." Confirm or replace this credit before publishing. |

---

## Go-live Checklist

- [ ] **Formspree ID** — create a form at formspree.io and replace `FORMSPREE_ID` in the form action.
- [ ] **Domain** — point `waynejonescpa.com` (or confirmed domain) DNS to the host; update JSON-LD `url` and og:url meta.
- [ ] **Headshot** — obtain a photo of Wayne or the office; swap in the `#about` portrait.
- [ ] **Confirm NAP** — verify phone `(706) 232-8565` and office hours with Wayne before launch.
- [ ] **GA CPA license** — verify license #026715 is active at [gsba.georgia.gov](https://gsba.georgia.gov).
- [ ] **AICPA / GSCPA** — ask Wayne about professional memberships; add to credentials if applicable.
- [ ] **og:image** — create and upload a 1200×630 social share image; uncomment og meta tags.
- [ ] **Google Analytics** (optional) — if desired, add GA4 `<script>` snippet before `</head>`.
- [ ] **Google Search Console** — submit sitemap / URL after DNS propagates.
- [ ] **Industry specialties** — confirm any specific niches; update the who-we-serve list.
- [ ] **"Website by" credit** — confirm footer attribution with Wayne.
- [ ] **Browser/device check** — test 360px, 768px, 1024px, 1280px breakpoints; check nav, form, map iframe.
