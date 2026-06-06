// Live production verification against GitHub Pages.
const { chromium, request } = require('playwright');
const BASE = 'https://forge-dev-studio.github.io/wayne-jones-cpa/';

(async () => {
  const b = await chromium.launch();
  let fail = 0;
  const log = (ok, msg) => { if (!ok) fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); };

  // 1. Home: trust bar present + visible text (the token-bug regression guard)
  let p = await b.newPage();
  let r = await p.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  log(r.status() === 200, `home 200 (${r.status()})`);
  const tb = await p.textContent('.trustbar').catch(() => '');
  log(/Licensed CPA/.test(tb) && (await p.locator('.trustbar').isVisible()), `home trust bar visible w/ text`);
  log(/Book a Free Consultation/.test(await p.content()), `home hero "Book a Free Consultation" CTA`);
  await p.close();

  // 2. Tax-tools hub
  p = await b.newPage();
  r = await p.goto(BASE + 'tax-tools/', { waitUntil: 'load', timeout: 30000 });
  log(r.status() === 200, `tax-tools hub 200 (${r.status()})`);
  await p.close();

  // 3. Calculators compute live
  for (const [url, sel, label] of [
    ['tax-tools/tax-refund-estimator/', '#rf-headline', 'refund'],
    ['tax-tools/self-employment-tax-calculator/', '#se-headline', 'self-employment'],
    ['tax-tools/s-corp-vs-llc-calculator/', '#sc-headline', 's-corp'],
  ]) {
    p = await b.newPage();
    r = await p.goto(BASE + url, { waitUntil: 'networkidle', timeout: 30000 });
    const txt = (await p.textContent(sel).catch(() => '')) || '';
    log(r.status() === 200 && /\$/.test(txt) && !/enable javascript/i.test(txt), `${label} computes live → "${txt.trim()}"`);
    await p.close();
  }

  // 4. Resources page + PDFs downloadable
  p = await b.newPage();
  r = await p.goto(BASE + 'resources/', { waitUntil: 'load', timeout: 30000 });
  log(r.status() === 200, `resources 200 (${r.status()})`);
  await p.close();

  const rc = await request.newContext();
  for (const f of ['2026-tax-deadline-calendar.pdf', 'small-business-tax-prep-checklist.pdf']) {
    const resp = await rc.get(BASE + 'resources/' + f);
    const ct = resp.headers()['content-type'] || '';
    log(resp.status() === 200 && /pdf/.test(ct), `PDF ${f} (${resp.status()}, ${ct})`);
  }
  await rc.dispose();

  await b.close();
  console.log(fail === 0 ? '\n✅ ALL LIVE CHECKS PASSED' : `\n❌ ${fail} LIVE CHECK(S) FAILED`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error(e.message); process.exit(1); });
