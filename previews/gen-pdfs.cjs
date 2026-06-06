#!/usr/bin/env node
// gen-pdfs.cjs — Generate branded PDF lead magnets via Playwright
// Usage: node previews/gen-pdfs.cjs
'use strict';

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const jobs = [
    ['pdf-deadlines.html', '2026-tax-deadline-calendar.pdf'],
    ['pdf-checklist.html', 'small-business-tax-prep-checklist.pdf'],
  ];

  for (const [src, out] of jobs) {
    const srcPath = 'file://' + path.resolve(__dirname, 'assets', src);
    const outPath = path.resolve(__dirname, '../public/resources', out);
    await page.goto(srcPath, { waitUntil: 'networkidle' });
    await page.pdf({
      path: outPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    console.log('wrote', out);
  }

  await browser.close();
  console.log('done');
})();
