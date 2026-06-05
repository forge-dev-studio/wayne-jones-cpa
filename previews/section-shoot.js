const { chromium } = require('playwright');
const IDS = ['services', 'who', 'about', 'why', 'contact'];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8091/site/', { waitUntil: 'load' });
  // Force reveal elements into final state (so element screenshots aren't blank)
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}.reveal-clip .line__inner{transform:none!important}' });
  await p.evaluate(async () => {
    document.querySelectorAll('.reveal, .reveal-clip').forEach((e) => e.classList.add('is-in'));
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
  });
  await p.waitForTimeout(1500);
  for (const id of IDS) {
    const el = await p.$('#' + id);
    if (el) { await el.screenshot({ path: `previews/sec-${id}.png` }); console.log('sec:', id); }
    else console.log('MISSING #' + id);
  }
  // also a clean full-page with reveals forced visible
  await p.screenshot({ path: 'previews/eng-desktop.png', fullPage: true });
  await b.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
