// Detects excessive vertical whitespace gaps + classifies each by background + neighbours.
const { chromium } = require('playwright');
const BASE = 'http://localhost:4321/wayne-jones-cpa/';
const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : [''];
const THRESHOLD = 150;

(async () => {
  const b = await chromium.launch();
  for (const path of PAGES) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
    try { await p.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}
    await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}.reveal-clip .line__inner{transform:none!important}' });
    await p.evaluate(() => document.querySelectorAll('.reveal,.reveal-clip,[data-rule]').forEach(e => e.classList.add('is-in')));
    await p.waitForTimeout(200);
    const out = await p.evaluate((TH) => {
      const txt = el => (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 42);
      const isContent = (el) => {
        const tag = el.tagName.toLowerCase();
        if (['script', 'style', 'br', 'hr', 'head'].includes(tag)) return false;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return false;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false;
        const hasText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
        const media = ['img', 'svg', 'input', 'select', 'textarea', 'button', 'iframe'].includes(tag);
        return hasText || media;
      };
      const bgAt = (x, y) => {
        let el = document.elementFromPoint(x, Math.min(y, window.innerHeight - 1));
        while (el) { const c = getComputedStyle(el).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; el = el.parentElement; }
        return 'none';
      };
      const sy = window.scrollY;
      const els = Array.from(document.querySelectorAll('body *')).filter(isContent);
      const recs = els.map(el => ({ el, t: el.getBoundingClientRect().top + sy, b: el.getBoundingClientRect().bottom + sy }))
        .filter(r => r.b > r.t).sort((a, b) => a.t - b.t);
      const intervals = recs.map(r => [r.t, r.b]);
      const merged = [];
      for (const iv of intervals) {
        if (!merged.length || iv[0] > merged[merged.length - 1][1]) merged.push(iv.slice());
        else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], iv[1]);
      }
      const gaps = [];
      for (let i = 1; i < merged.length; i++) {
        const gap = merged[i][0] - merged[i - 1][1];
        if (gap < TH) continue;
        const from = merged[i - 1][1], to = merged[i][0], mid = (from + to) / 2;
        const above = recs.filter(r => Math.abs(r.b - from) < 3).map(r => r.el.tagName.toLowerCase() + ':' + txt(r.el)).pop() || '?';
        const below = recs.filter(r => Math.abs(r.t - to) < 3).map(r => r.el.tagName.toLowerCase() + ':' + txt(r.el))[0] || '?';
        // need to scroll mid into view to sample bg
        gaps.push({ from: Math.round(from), to: Math.round(to), gap: Math.round(gap), mid: Math.round(mid), above, below });
      }
      return { docH: Math.round(document.body.scrollHeight), gaps };
    }, THRESHOLD);

    // sample bg color for each gap by scrolling it into view
    for (const g of out.gaps) {
      await p.evaluate(y => window.scrollTo(0, Math.max(0, y - window.innerHeight / 2)), g.mid);
      await p.waitForTimeout(60);
      g.bg = await p.evaluate(my => {
        const yv = my - window.scrollY;
        let el = document.elementFromPoint(720, Math.max(1, Math.min(yv, window.innerHeight - 1)));
        while (el) { const c = getComputedStyle(el).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; el = el.parentElement; }
        return 'none';
      }, g.mid);
    }
    console.log(`\n=== ${path || 'home'} (docH=${out.docH}) ===`);
    for (const g of out.gaps.sort((a, b) => a.from - b.from)) {
      const dark = /(18, 32, 54)|(15, 42|26, 62)/.test(g.bg) || (g.bg.match(/\d+/g) && g.bg.match(/\d+/g).slice(0, 3).every(n => +n < 80));
      console.log(`${String(g.gap).padStart(4)}px @ ${g.from}-${g.to}  bg=${g.bg.padEnd(20)} ${dark ? '[DARK band — likely intentional]' : '[LIGHT — check]'}\n        above: ${g.above}\n        below: ${g.below}`);
    }
    await ctx.close();
  }
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
