const { chromium } = require('playwright');
const path = require('path');
const ROOT = '/home/adminsynergycloud/wayne-jones-cpa';
(async () => {
  const b = await chromium.launch();
  const shots = [
    { html: 'previews/assets/og.html', w: 1200, h: 630, out: 'public/og/og-default.png' },
    { html: 'previews/assets/headshot.html', w: 600, h: 750, out: 'public/images/wayne-headshot-placeholder.png' },
  ];
  for (const s of shots) {
    const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 });
    await p.goto('file://' + path.join(ROOT, s.html), { waitUntil: 'load' });
    try { await p.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}
    await p.waitForTimeout(1200);
    await p.screenshot({ path: s.out, clip: { x: 0, y: 0, width: s.w, height: s.h } });
    await p.close();
    console.log('asset:', s.out);
  }
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
