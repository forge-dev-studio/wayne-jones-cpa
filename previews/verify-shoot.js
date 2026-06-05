const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();

  // 1) JS DISABLED — proves C1 fix: content must be visible without JS
  const ctx1 = await b.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const p1 = await ctx1.newPage();
  await p1.goto('http://localhost:8091/site/', { waitUntil: 'load' });
  await p1.waitForTimeout(2000);
  await p1.screenshot({ path: 'previews/nojs-desktop.png', fullPage: true });
  await ctx1.close();
  console.log('nojs shot');

  // 2) MOBILE 390 — schedule legibility (I2) + overall
  const ctx2 = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p2 = await ctx2.newPage();
  await p2.goto('http://localhost:8091/site/', { waitUntil: 'load' });
  await p2.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}.reveal-clip .line__inner{transform:none!important}' });
  await p2.evaluate(async () => {
    document.querySelectorAll('.reveal, .reveal-clip').forEach((e) => e.classList.add('is-in'));
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
  });
  await p2.waitForTimeout(1500);
  const svc = await p2.$('#services');
  if (svc) await svc.screenshot({ path: 'previews/m-services.png' });
  await p2.screenshot({ path: 'previews/eng-mobile.png', fullPage: true });
  await ctx2.close();
  console.log('mobile shot');

  await b.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
