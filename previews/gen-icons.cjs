// Render the WJ tile, then emit apple-touch-icon (180) + favicon-32 + favicon-16 PNGs.
const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const ROOT = '/home/adminsynergycloud/wayne-jones-cpa';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(ROOT, 'previews/assets/icon.html'), { waitUntil: 'load' });
  try { await p.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}
  await p.waitForTimeout(600);
  const buf = await p.screenshot({ clip: { x: 0, y: 0, width: 180, height: 180 } }); // 360x360 @2x
  await b.close();
  const out = [
    ['public/apple-touch-icon.png', 180],
    ['public/favicon-32.png', 32],
    ['public/favicon-16.png', 16],
  ];
  for (const [file, size] of out) {
    const info = await sharp(buf).resize(size, size).png().toFile(path.join(ROOT, file));
    console.log(file, info.width + 'x' + info.height, info.size + 'B');
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
