// Runtime verification for the tax calculators: confirms client JS computes,
// inputs update results live, and the no-JS fallback is server-rendered.
const { chromium } = require('playwright');
const BASE = 'http://localhost:4321/wayne-jones-cpa/tax-tools/';

const CALCS = [
  { name: 'refund', url: 'tax-refund-estimator/', headline: '#rf-headline', input: '#rf-income', bump: '250000' },
  { name: 'self-employment', url: 'self-employment-tax-calculator/', headline: '#se-headline', input: '#se-profit', bump: '300000' },
  { name: 's-corp', url: 's-corp-vs-llc-calculator/', headline: '#sc-headline', input: '#sc-profit', bump: '400000' },
];

(async () => {
  const b = await chromium.launch();
  let failures = 0;

  // --- JS-enabled: compute + live update ---
  for (const c of CALCS) {
    const p = await b.newPage();
    await p.goto(BASE + c.url, { waitUntil: 'networkidle', timeout: 20000 });
    const before = (await p.textContent(c.headline))?.trim() || '';
    const computed = /\$|refund|owed|savings|tax/i.test(before) && !/enable javascript/i.test(before);
    // change an input and confirm the result reacts
    await p.fill(c.input, c.bump);
    await p.waitForTimeout(150);
    const after = (await p.textContent(c.headline))?.trim() || '';
    const reacted = after !== before && (/\$|savings|tax|owed|refund/i.test(after));
    const ok = computed && reacted;
    if (!ok) failures++;
    console.log(`[JS] ${c.name.padEnd(16)} ${ok ? 'PASS' : 'FAIL'}  before="${before}"  after="${after}"`);
    await p.close();
  }

  // --- no-JS: .calc__nojs fallback visible + server-rendered form/disclaimer present ---
  const ctx = await b.newContext({ javaScriptEnabled: false });
  for (const c of CALCS) {
    const p = await ctx.newPage();
    await p.goto(BASE + c.url, { waitUntil: 'load', timeout: 20000 });
    const nojs = (await p.textContent('.calc__nojs'))?.trim() || '';
    const fallbackVisible = await p.locator('.calc__nojs').first().isVisible();
    const hasFallback = fallbackVisible && /enable javascript/i.test(nojs);
    const headlineHidden = !(await p.locator(c.headline).isVisible());
    const hasForm = (await p.locator(c.input).count()) > 0;
    const hasDisclaimer = (await p.locator('.tax-disclaimer').count()) > 0;
    const ok = hasFallback && headlineHidden && hasForm && hasDisclaimer;
    if (!ok) failures++;
    console.log(`[noJS] ${c.name.padEnd(16)} ${ok ? 'PASS' : 'FAIL'}  fallback=${hasFallback} headlineHidden=${headlineHidden} form=${hasForm} disclaimer=${hasDisclaimer}`);
    await p.close();
  }
  await ctx.close();
  await b.close();
  console.log(failures === 0 ? '\nALL CALCULATOR RUNTIME CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error(e.message); process.exit(1); });
