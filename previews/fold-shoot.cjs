const { chromium } = require('playwright');
const [path, name, w] = [process.argv[2], process.argv[3], +(process.argv[4]||1100)];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: w, height: Math.round(w*0.62) }, deviceScaleFactor: 1 });
  await p.goto('http://localhost:4321/wayne-jones-cpa/' + path, { waitUntil: 'load', timeout: 20000 });
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}.reveal-clip .line__inner{transform:none!important}' });
  await p.evaluate(async () => { document.querySelectorAll('.reveal,.reveal-clip').forEach(e=>e.classList.add('is-in')); try{await document.fonts.ready}catch(e){} });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `previews/${name}.png`, fullPage: false });
  await b.close(); console.log('shot', name);
})().catch(e=>{console.error(e.message);process.exit(1)});
