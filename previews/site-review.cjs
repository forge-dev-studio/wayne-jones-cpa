// Site review: per-page perf metrics (FCP/LCP/CLS/long-tasks/scroll-jank) + full-page screenshots.
const { chromium } = require('playwright');
const BASE = 'http://localhost:4321/wayne-jones-cpa/';
const PAGES = [
  ['', 'home'],
  ['tax-tools/', 'hub'],
  ['tax-tools/s-corp-vs-llc-calculator/', 'scorp'],
  ['about/', 'about'],
  ['services/tax-preparation/', 'service'],
  ['locations/rome-ga/', 'rome'],
  ['resources/', 'resources'],
  ['contact/', 'contact'],
  ['faq/', 'faq'],
];
const W = parseInt(process.argv[2] || '1440', 10);
const TAG = process.argv[3] || 'desk';

(async () => {
  const b = await chromium.launch();
  for (const [path, name] of PAGES) {
    const ctx = await b.newContext({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.addInitScript(() => {
      window.__cls = 0; window.__lcp = 0; window.__lt = 0;
      try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
      try { new PerformanceObserver(l => { const es = l.getEntries(); window.__lcp = es[es.length - 1].startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) {}
      try { new PerformanceObserver(l => { window.__lt += l.getEntries().length; }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
    });
    await p.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
    try { await p.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}
    await p.waitForTimeout(1100);
    // scroll through, sampling frame deltas to detect jank from transitions/reveals
    const jank = await p.evaluate(async () => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      let frames = [], last = performance.now(), running = true;
      const loop = now => { frames.push(now - last); last = now; if (running) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      const h = document.body.scrollHeight, steps = 22;
      for (let i = 1; i <= steps; i++) { window.scrollTo(0, h * i / steps); await sleep(55); }
      running = false; await sleep(40);
      frames = frames.filter(f => f > 0 && f < 2000);
      return { longFrames: frames.filter(f => f > 50).length, maxFrame: Math.round(Math.max(...frames)), samples: frames.length };
    });
    const m = await p.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const fcp = (performance.getEntriesByType('paint').find(x => x.name === 'first-contentful-paint') || {}).startTime || 0;
      const res = performance.getEntriesByType('resource');
      return {
        nodes: document.querySelectorAll('*').length,
        trans: Array.from(document.querySelectorAll('*')).filter(el => { const t = getComputedStyle(el).transitionDuration; return t && t !== '0s'; }).length,
        load: Math.round(nav.loadEventEnd || 0),
        fcp: Math.round(fcp),
        lcp: Math.round(window.__lcp || 0),
        cls: +(window.__cls || 0).toFixed(3),
        lt: window.__lt || 0,
        kb: Math.round(res.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
        reqs: res.length,
      };
    });
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}.reveal-clip .line__inner{transform:none!important}' });
    await p.evaluate(() => document.querySelectorAll('.reveal,.reveal-clip,[data-rule]').forEach(e => e.classList.add('is-in')));
    await p.waitForTimeout(250);
    await p.screenshot({ path: `previews/rev-${TAG}-${name}.png`, fullPage: true });
    console.log(name.padEnd(10), `fcp=${m.fcp} lcp=${m.lcp} cls=${m.cls} load=${m.load} lt=${m.lt} | nodes=${m.nodes} trans=${m.trans} kb=${m.kb} reqs=${m.reqs} | jank:longFrames=${jank.longFrames}/${jank.samples} max=${jank.maxFrame}ms`);
    await ctx.close();
  }
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
