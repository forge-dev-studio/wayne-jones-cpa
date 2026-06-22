// Submit each lead form and screenshot the resulting confirmation panel.
const { chromium } = require('playwright');
const BASE = 'http://localhost:4321/wayne-jones-cpa';
const TARGETS = [
  { tag: 'contact', url: BASE + '/contact/', w: 1440, h: 1024 },
  { tag: 'home', url: BASE + '/', w: 1440, h: 1024 },
  { tag: 'contact-mobile', url: BASE + '/contact/', w: 390, h: 844 },
];
(async () => {
  const b = await chromium.launch();
  for (const t of TARGETS) {
    const p = await b.newPage({ viewport: { width: t.w, height: t.h }, deviceScaleFactor: 2 });
    await p.goto(t.url, { waitUntil: 'load', timeout: 25000 });
    await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
    await p.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in')));
    await p.fill('#name', 'Wayne Jones');
    await p.fill('#email', 'wsdj@bellsouth.net');
    await p.click('.cert-form button[type="submit"]');
    await p.waitForTimeout(1100);
    const form = await p.$('.cert-form');
    if (form) { await form.screenshot({ path: `previews/ctx-form-success-${t.tag}.png` }); console.log('shot ctx-form-success-' + t.tag); }
    await p.close();
  }
  await b.close();
  console.log('done');
})().catch((e) => { console.error(e.message); process.exit(1); });
