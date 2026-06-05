const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:4321/wayne-jones-cpa/services/tax-preparation/', { waitUntil: 'load', timeout: 20000 });
  const data = await p.evaluate(() => {
    const out = { innerWidth: window.innerWidth };
    const sels = ['main', 'article.service-detail', '.service-detail__header', '.service-detail__included', '.cta', '.cta .section-wrap'];
    out.els = sels.map((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { sel, left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
        maxWidth: cs.maxWidth, marginLeft: cs.marginLeft, marginRight: cs.marginRight, display: cs.display, cssWidth: cs.width };
    });
    // also resolve the --max-w var on :root
    out.maxWvar = getComputedStyle(document.documentElement).getPropertyValue('--max-w').trim();
    out.gutterVar = getComputedStyle(document.documentElement).getPropertyValue('--gutter').trim();
    return out;
  });
  console.log(JSON.stringify(data, null, 2));
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
