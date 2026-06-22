// Render Wayne's portrait treatments at 600x750 (2x) from previews/assets/portrait.html
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ROOT = '/home/adminsynergycloud/wayne-jones-cpa';
const OUT = path.join(ROOT, 'previews/out');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 750 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(ROOT, 'previews/assets/portrait.html'), { waitUntil: 'load' });
  await p.waitForTimeout(500);
  for (const mode of ['natural', 'duotone']) {
    await p.evaluate((m) => { document.body.className = m; }, mode);
    await p.waitForTimeout(250);
    const out = path.join(OUT, `portrait-${mode}.png`);
    await p.screenshot({ path: out, clip: { x: 0, y: 0, width: 600, height: 750 } });
    console.log('wrote', out);
  }
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
