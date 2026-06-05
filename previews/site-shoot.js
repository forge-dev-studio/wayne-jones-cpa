const { chromium } = require('playwright');
const SHOTS = [
  { name: 'eng-desktop', width: 1440, height: 1024 },
  { name: 'eng-mobile', width: 390, height: 844 },
];
(async () => {
  const b = await chromium.launch();
  for (const s of SHOTS) {
    const p = await b.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: 2 });
    await p.goto('http://localhost:8091/site/', { waitUntil: 'load' });
    // scroll through to trigger reveals + count-ups, then settle
    await p.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
      if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `previews/${s.name}.png`, fullPage: true });
    await p.screenshot({ path: `previews/${s.name}-fold.png`, fullPage: false });
    await p.close();
    console.log('shot:', s.name);
  }
  await b.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
