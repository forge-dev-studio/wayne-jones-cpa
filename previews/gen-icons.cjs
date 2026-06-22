// Render the WJ tile, then emit apple-touch-icon (180) + favicon-32 (32) PNGs.
const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const ROOT = '/home/adminsynergycloud/wayne-jones-cpa';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(ROOT, 'previews/assets/icon.html'), { waitUntil: 'load' });
  try { await p.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}
  await p.waitForTimeout(800);
  const buf = await p.screenshot({ clip: { x: 0, y: 0, width: 180, height: 180 } }); // 360x360 @2x
  await b.close();
  const apple = await sharp(buf).resize(180, 180).png().toFile(path.join(ROOT, 'public/apple-touch-icon.png'));
  const fav32 = await sharp(buf).resize(32, 32).png().toFile(path.join(ROOT, 'public/favicon-32.png'));
  console.log('apple-touch-icon.png', apple.width + 'x' + apple.height, Math.round(apple.size / 1024) + 'KB');
  console.log('favicon-32.png', fav32.width + 'x' + fav32.height, fav32.size + 'B');
})().catch((e) => { console.error(e.message); process.exit(1); });
