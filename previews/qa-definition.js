const { chromium } = require('playwright');
const SHOTS = [
  { n: 'def-desktop', w: 1440, h: 1024 },
  { n: 'def-mobile', w: 390, h: 844 },
];
(async () => {
  const b = await chromium.launch();
  for (const s of SHOTS) {
    const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
    await p.goto('http://localhost:8091/site/', { waitUntil: 'load' });
    await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}.reveal-clip .line__inner{transform:none!important}' });
    await p.evaluate(async () => {
      document.querySelectorAll('.reveal, .reveal-clip').forEach((e) => e.classList.add('is-in'));
      if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    });
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `previews/${s.n}.png`, fullPage: true });
    await p.close();
    console.log('shot:', s.n);
  }
  await b.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
