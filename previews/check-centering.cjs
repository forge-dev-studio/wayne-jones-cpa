const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const pages = process.argv.slice(2);
  let fail = 0;
  for (const path of pages) {
    await p.goto('http://localhost:4321/wayne-jones-cpa/' + path, { waitUntil: 'load', timeout: 20000 });
    const r = await p.evaluate(() => {
      // the first content wrapper inside main that uses section-wrap (skip header/footer)
      const el = document.querySelector('main .section-wrap');
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { left: Math.round(b.left), right: Math.round(b.right), width: Math.round(b.width), iw: window.innerWidth };
    });
    if (!r) { console.log(`SKIP ${path} (no .section-wrap in main)`); continue; }
    const leftGap = r.left, rightGap = r.iw - r.right;
    const centered = Math.abs(leftGap - rightGap) <= 4;
    const reading = r.width <= 880;
    const ok = centered && reading;
    if (!ok) fail++;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${path}  width=${r.width} leftGap=${leftGap} rightGap=${rightGap} centered=${centered} reading=${reading}`);
  }
  await b.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e.message); process.exit(2); });
