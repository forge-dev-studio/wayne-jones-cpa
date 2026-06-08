// Live production verification of the liability-remediation pass.
const { chromium, request } = require('playwright');
const B = 'https://forge-dev-studio.github.io/wayne-jones-cpa/';
(async () => {
  const br = await chromium.launch();
  let fail = 0;
  const ok = (c, m) => { if (!c) fail++; console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); };

  // Home: no "most trusted"; trust bar no e-File credential; footer disclaimer present
  let p = await br.newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  const home = await p.content();
  ok(!/most trusted/i.test(home), 'home: "most trusted" gone');
  ok(!/e-File Authorized/i.test(home), 'home: e-File credential gone');
  ok(/Serving Rome Since 2008/.test(home), 'home: trust bar replacement present');
  ok(/does not create a CPA-client relationship/i.test(home), 'home: footer disclaimer present');
  await p.close();

  // SE calculator: Q2 = June 15 (not 16); computes
  p = await br.newPage();
  await p.goto(B + 'tax-tools/self-employment-tax-calculator/', { waitUntil: 'networkidle' });
  const se = await p.content();
  ok(/June 15, 2026/.test(se) && !/June 16, 2026/.test(se), 'SE page: Q2 = June 15, 2026 (not 16)');
  await p.close();

  // S-corp: relabeled headline + estimate caption
  p = await br.newPage();
  await p.goto(B + 'tax-tools/s-corp-vs-llc-calculator/', { waitUntil: 'networkidle' });
  const sc = (await p.textContent('#sc-headline'))?.trim() || '';
  ok(/before income tax/i.test(sc) && /~\$/.test(sc), `s-corp: relabeled+rounded headline → "${sc}"`);
  ok(/Rough planning estimate/i.test(await p.content()), 's-corp: estimate caption present');
  await p.close();

  // Legal pages live
  for (const [u, h] of [['privacy/', 'Privacy Policy'], ['disclaimer/', 'Terms of Use']]) {
    p = await br.newPage();
    const r = await p.goto(B + u, { waitUntil: 'load' });
    ok(r.status() === 200 && new RegExp(h).test(await p.content()), `${u} live (200, "${h}")`);
    await p.close();
  }

  // PDF: regenerated, downloadable
  const rc = await request.newContext();
  const pdf = await rc.get(B + 'resources/2026-tax-deadline-calendar.pdf');
  ok(pdf.status() === 200 && /pdf/.test(pdf.headers()['content-type'] || ''), `deadline PDF live (${pdf.status()})`);
  await rc.dispose();

  await br.close();
  console.log(fail === 0 ? '\n✅ ALL LIABILITY-FIX LIVE CHECKS PASSED' : `\n❌ ${fail} FAILED`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error(e.message); process.exit(1); });
