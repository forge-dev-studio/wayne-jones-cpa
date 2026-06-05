#!/usr/bin/env node
// validate-schema.cjs — JSON-LD validation for Wayne Jones CPA Astro build
// Usage: node previews/validate-schema.cjs
'use strict';

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '../dist');

// ─── helpers ────────────────────────────────────────────────────────────────

function walkHtml(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkHtml(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

// Relative path from dist root, e.g. "services/tax-preparation/index.html"
function relPath(abs) {
  return abs.slice(DIST.length + 1);
}

// URL path from file, e.g. "/services/tax-preparation/"
function urlPath(abs) {
  const rel = relPath(abs);
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/index\.html$/, '');
}

// ─── extract schemas ─────────────────────────────────────────────────────────

const SCHEMA_RE = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

function extractSchemas(html, filePath) {
  const schemas = [];
  let match;
  SCHEMA_RE.lastIndex = 0;
  while ((match = SCHEMA_RE.exec(html)) !== null) {
    const raw = match[1];
    try {
      const obj = JSON.parse(raw);
      schemas.push(obj);
    } catch (e) {
      throw new Error(`JSON parse error in ${filePath}: ${e.message}`);
    }
  }
  return schemas;
}

function collectTypes(schemas) {
  const types = new Set();
  for (const s of schemas) {
    const t = s['@type'];
    if (Array.isArray(t)) t.forEach((x) => types.add(x));
    else if (t) types.add(t);
  }
  return types;
}

// ─── route classifiers ───────────────────────────────────────────────────────

function isServiceSlug(u) {
  return /^\/services\/[^/]+\/$/.test(u);
}
function isLocationSlug(u) {
  return /^\/locations\/[^/]+\/$/.test(u);
}
function isBlogSlug(u) {
  return /^\/blog\/[^/]+\/$/.test(u);
}
function isFaq(u) {
  return u === '/faq/';
}
function isHome(u) {
  return u === '/';
}
function isNonHome(u) {
  return u !== '/';
}

// ─── main ────────────────────────────────────────────────────────────────────

const htmlFiles = walkHtml(DIST);

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

for (const absFile of htmlFiles.sort()) {
  const rel = relPath(absFile);
  const url = urlPath(absFile);
  const html = fs.readFileSync(absFile, 'utf-8');

  let schemas;
  try {
    schemas = extractSchemas(html, rel);
  } catch (e) {
    fail(e.message);
    continue;
  }

  const types = collectTypes(schemas);
  const fileLabel = rel;

  // 1. Every schema must have @context + @type
  for (const s of schemas) {
    if (!s['@context']) fail(`${fileLabel}: schema missing @context (type=${s['@type'] || '?'})`);
    if (!s['@type']) fail(`${fileLabel}: schema missing @type`);
  }

  // 2. AccountingService on ALL pages
  if (!types.has('AccountingService')) {
    fail(`${fileLabel} [${url}]: missing AccountingService schema`);
  }

  // 3. Service on /services/<slug>/
  if (isServiceSlug(url) && !types.has('Service')) {
    fail(`${fileLabel} [${url}]: missing Service schema`);
  }

  // 4. LocalBusiness on /locations/<slug>/
  if (isLocationSlug(url) && !types.has('LocalBusiness')) {
    fail(`${fileLabel} [${url}]: missing LocalBusiness schema`);
  }

  // 5. FAQPage on /faq/ and each /services/<slug>/
  if ((isFaq(url) || isServiceSlug(url)) && !types.has('FAQPage')) {
    fail(`${fileLabel} [${url}]: missing FAQPage schema`);
  }

  // 6. BlogPosting on /blog/<slug>/
  if (isBlogSlug(url) && !types.has('BlogPosting')) {
    fail(`${fileLabel} [${url}]: missing BlogPosting schema`);
  }

  // 7. BreadcrumbList on all non-home pages (except 404)
  const is404 = url === '/404/' || url === '/404.html';
  if (isNonHome(url) && !is404 && !types.has('BreadcrumbList')) {
    fail(`${fileLabel} [${url}]: missing BreadcrumbList schema`);
  }

  if (schemas.length === 0 && url !== '/404/') {
    warn(`${fileLabel} [${url}]: no JSON-LD schemas found`);
  }
}

// ─── summary ─────────────────────────────────────────────────────────────────

const total = htmlFiles.length;
console.log(`\nvalidate-schema: scanned ${total} HTML file(s)`);
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
