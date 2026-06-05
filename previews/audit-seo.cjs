#!/usr/bin/env node
// audit-seo.cjs — SEO + internal-link audit for Wayne Jones CPA Astro build
// Usage: node previews/audit-seo.cjs
'use strict';

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '../dist');
const BASE = '/wayne-jones-cpa'; // astro base prefix in emitted hrefs

// ─── helpers ─────────────────────────────────────────────────────────────────

function walkHtml(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkHtml(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

function relPath(abs) {
  return abs.slice(DIST.length + 1);
}

// Extract first match of a regex from html; returns string or null
function extract(html, re) {
  const m = re.exec(html);
  return m ? m[1] : null;
}

// Extract ALL matches
function extractAll(html, re) {
  const results = [];
  let m;
  const clone = new RegExp(re.source, re.flags);
  while ((m = clone.exec(html)) !== null) results.push(m[1]);
  return results;
}

// ─── build emitted-file index ────────────────────────────────────────────────

const htmlFiles = walkHtml(DIST);

// Build a set of all emitted paths (relative to DIST root, with leading slash)
// e.g. "/services/tax-preparation/index.html", "/index.html", "/404.html"
const emittedSet = new Set();
for (const abs of htmlFiles) {
  emittedSet.add('/' + relPath(abs));
}
// Also index non-html emitted assets at top level for reference
for (const entry of fs.readdirSync(DIST, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    emittedSet.add('/' + entry.name);
  }
}

/**
 * Resolve an internal href (which starts with BASE, e.g. /wayne-jones-cpa/services/)
 * to an emitted file path (relative to dist root).
 *
 * Rules per spec:
 *   1. Strip the BASE prefix → bare path (e.g. /services/)
 *   2. If it ends with '/', try <path>index.html
 *   3. Otherwise try exact match, then <path>/index.html
 */
function resolveInternalHref(rawHref) {
  // Strip BASE prefix
  let bare = rawHref;
  if (bare.startsWith(BASE)) {
    bare = bare.slice(BASE.length) || '/';
  }
  // Remove fragment / query
  bare = bare.split('#')[0].split('?')[0];
  if (!bare) bare = '/';

  const candidates = [];
  if (bare === '/') {
    candidates.push('/index.html');
  } else if (bare.endsWith('/')) {
    candidates.push(bare + 'index.html');
    candidates.push(bare.slice(0, -1)); // exact non-slash
  } else {
    candidates.push(bare);
    candidates.push(bare + '/index.html');
    candidates.push(bare + '.html');
  }
  return candidates.some((c) => emittedSet.has(c));
}

// ─── audit ───────────────────────────────────────────────────────────────────

let errors = 0;
let warnings = 0;
const report = [];

function fail(msg) {
  errors++;
  report.push(`  FAIL  ${msg}`);
}
function warn(msg) {
  warnings++;
  report.push(`  WARN  ${msg}`);
}

const titlesSeen = new Map(); // title → first file that used it

for (const absFile of htmlFiles.sort()) {
  const rel = relPath(absFile);
  const html = fs.readFileSync(absFile, 'utf-8');

  // --- 1. Exactly one <h1> ---
  const h1Matches = [...html.matchAll(/<h1[\s>]/gi)];
  if (h1Matches.length === 0) {
    fail(`${rel}: no <h1> found`);
  } else if (h1Matches.length > 1) {
    fail(`${rel}: ${h1Matches.length} <h1> elements (expected exactly 1)`);
  }

  // --- 2. Non-empty <title>, globally unique ---
  const title = extract(html, /<title[^>]*>([^<]*)<\/title>/i);
  if (!title || !title.trim()) {
    fail(`${rel}: missing or empty <title>`);
  } else {
    const t = title.trim();
    if (titlesSeen.has(t)) {
      fail(`${rel}: duplicate <title> "${t}" (first seen in ${titlesSeen.get(t)})`);
    } else {
      titlesSeen.set(t, rel);
    }
  }

  // --- 3. Non-empty <meta name="description"> ≤160 chars ---
  const desc = extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i)
    ?? extract(html, /<meta\s+content="([^"]*)"\s+name="description"/i);
  if (!desc || !desc.trim()) {
    fail(`${rel}: missing or empty <meta name="description">`);
  } else {
    // Decode basic HTML entities for accurate character count
    const decoded = desc.trim()
      .replace(/&#38;/g, '&').replace(/&amp;/g, '&')
      .replace(/&#60;/g, '<').replace(/&lt;/g, '<')
      .replace(/&#62;/g, '>').replace(/&gt;/g, '>')
      .replace(/&#34;/g, '"').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/&apos;/g, "'")
      .replace(/&#8212;/g, '—').replace(/&mdash;/g, '—')
      .replace(/&#8211;/g, '–').replace(/&ndash;/g, '–');
    if (decoded.length > 160) {
      warn(`${rel}: description is ${decoded.length} chars (>160): "${decoded.slice(0, 80)}..."`);
    }
  }

  // --- 4. <link rel="canonical"> ---
  const canonical = extract(html, /<link[^>]+rel="canonical"[^>]*href="([^"]+)"/i)
    ?? extract(html, /<link[^>]+href="([^"]+)"[^>]*rel="canonical"/i);
  if (!canonical) {
    fail(`${rel}: missing <link rel="canonical">`);
  }

  // --- 5. Internal <a href> links resolve to emitted files ---
  // Only check <a href="..."> tags (not <link>, <script>, etc.)
  const anchorHrefs = extractAll(html, /<a\s[^>]*href="([^"]+)"/gi);
  for (const rawHref of anchorHrefs) {
    if (!rawHref.startsWith(BASE)) continue; // skip external, mailto, tel, anchors
    if (!resolveInternalHref(rawHref)) {
      fail(`${rel}: broken internal link → "${rawHref}"`);
    }
  }
}

// ─── summary ─────────────────────────────────────────────────────────────────

const total = htmlFiles.length;
console.log(`\naudit-seo: scanned ${total} HTML file(s)`);
if (report.length) {
  report.forEach((l) => console.log(l));
}
console.log(`\n  Errors:   ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (errors > 0) {
  console.log('\nFAILED — fix the errors above and re-run.\n');
  process.exit(1);
} else {
  console.log('\nPASSED\n');
  process.exit(0);
}
