const { chromium } = require('playwright');
const path = process.argv[2] || '';
const name = process.argv[3] || 'page';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:4321/wayne-jones-cpa/' + path, { waitUntil: 'load', timeout: 20000 });
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}.reveal-clip .line__inner{transform:none!important}' });
  await p.evaluate(async () => { document.querySelectorAll('.reveal,.reveal-clip').forEach(e=>e.classList.add('is-in')); if(document.fonts&&document.fonts.ready){try{await document.fonts.ready}catch(e){}} });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `previews/${name}.png`, fullPage: true });
  await b.close(); console.log('shot', name);
})().catch(e=>{console.error(e.message);process.exit(1)});
