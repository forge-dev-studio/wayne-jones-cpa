const { chromium } = require('playwright');

const URL = 'http://localhost:8090';
const SHOTS = [
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

(async () => {
  const browser = await chromium.launch();
  for (const s of SHOTS) {
    const page = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: 2 });
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    // Force scroll-reveal elements visible and settle fonts/animations
    await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important} *{animation:none!important;transition:none!important}' });
    await page.evaluate(async () => {
      document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible'));
      if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    });
    await page.waitForTimeout(2500); // let Google Fonts + map iframe paint
    await page.screenshot({ path: `previews/${s.name}.png`, fullPage: true });
    // Also a hero-only (above the fold) crop for a clean first impression
    await page.screenshot({ path: `previews/${s.name}-fold.png`, fullPage: false });
    await page.close();
    console.log(`shot: ${s.name} (${s.width}x${s.height})`);
  }
  await browser.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
