const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const measure = async (url, sels) => {
    await p.goto(url, { waitUntil: 'load', timeout: 20000 });
    return p.evaluate((sels) => sels.map((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { sel, left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), maxWidth: cs.maxWidth, textAlign: cs.textAlign, marginLeft: cs.marginLeft };
    }), sels);
  };
  console.log('--- SERVICE ---');
  console.log(JSON.stringify(await measure('http://localhost:4321/wayne-jones-cpa/services/tax-preparation/',
    ['.service-detail__header .eyebrow', '.service-detail__header h1', '.service-detail__header .section-deck', '.prose p', '.service-detail__for-text', '.service-detail__faq', '.faqlist, .faq-list, dl']), null, 1));
  console.log('--- FAQ PAGE ---');
  console.log(JSON.stringify(await measure('http://localhost:4321/wayne-jones-cpa/faq/',
    ['.section-wrap', 'h1', 'dl', 'dt', '.faqlist, .faq-list']), null, 1));
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
