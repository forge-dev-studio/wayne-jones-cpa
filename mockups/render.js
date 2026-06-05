const { chromium } = require('playwright');
const NAMES = ['a-engraved', 'b-midnight', 'c-heritage'];

(async () => {
  const browser = await chromium.launch();
  for (const n of NAMES) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:8091/mockups/${n}/`, { waitUntil: 'load' });
    // trigger any scroll observers + settle fonts/entrance animations
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `mockups/renders/${n}.png`, fullPage: true });
    await page.screenshot({ path: `mockups/renders/${n}-fold.png`, fullPage: false });
    await page.close();
    console.log('shot:', n);
  }
  await browser.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
