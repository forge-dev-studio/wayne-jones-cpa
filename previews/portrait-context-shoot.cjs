// In-context shots of the real portrait: hero credentials card + dark About band, desktop + mobile.
const { chromium } = require('playwright');
const URL = 'http://localhost:4321/wayne-jones-cpa/';
const VIEWS = [
  { tag: 'desktop', w: 1440, h: 1024 },
  { tag: 'mobile', w: 390, h: 844 },
];
async function prep(p) {
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}.reveal-clip .line__inner{transform:none!important}' });
  await p.evaluate(async () => {
    document.querySelectorAll('.reveal,.reveal-clip').forEach((e) => e.classList.add('is-in'));
    try { await document.fonts.ready; } catch (e) {}
  });
  await p.waitForTimeout(1400);
}
(async () => {
  const b = await chromium.launch();
  for (const v of VIEWS) {
    const p = await b.newPage({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 2 });
    await p.goto(URL, { waitUntil: 'load', timeout: 25000 });
    await prep(p);
    // Hero credentials card (desktop) / hero fold (mobile)
    const heroSel = v.tag === 'desktop' ? '.hero__right' : '.hero';
    const hero = await p.$(heroSel);
    if (hero) { await hero.screenshot({ path: `previews/ctx-hero-${v.tag}.png` }); console.log('shot ctx-hero-' + v.tag); }
    // Dark About band
    const about = await p.$('#about');
    if (about) { await about.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await about.screenshot({ path: `previews/ctx-about-${v.tag}.png` }); console.log('shot ctx-about-' + v.tag); }
    await p.close();
  }
  await b.close();
  console.log('done');
})().catch((e) => { console.error(e.message); process.exit(1); });
