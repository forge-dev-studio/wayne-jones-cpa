import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// DOMAIN CUTOVER: when waynejonescpa.com is live, set site:'https://waynejonescpa.com',
// base:'/', add public/CNAME with the domain, and set the Pages custom domain.
const BASE = '/wayne-jones-cpa';

/**
 * rehype plugin: base-aware internal links in markdown bodies.
 * Markdown content links like `](/services/bookkeeping)` emit `<a href="/services/bookkeeping">`,
 * which drops the GitHub Pages base prefix and 404s. This walks the HAST tree and, for any
 * <a> whose href starts with "/" but NOT with "//" (protocol-relative) and NOT already with
 * the base, prepends BASE and ensures a trailing slash on internal page links (no file
 * extension, no fragment, no query). Cutover-safe: when base becomes "/", prefixing is a
 * no-op and only the trailing-slash normalization applies.
 */
function rehypeBaseAwareLinks() {
  const ensureTrailingSlash = (p) => {
    // Skip if it has a query, fragment, or looks like a file (has an extension in the last segment).
    if (p.includes('?') || p.includes('#')) return p;
    const lastSeg = p.split('/').pop();
    if (lastSeg && lastSeg.includes('.')) return p; // e.g. /foo/bar.pdf
    return p.endsWith('/') ? p : p + '/';
  };

  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'a' && node.properties) {
      let href = node.properties.href;
      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
        const baseNorm = BASE.replace(/\/$/, '');
        const alreadyBased =
          baseNorm !== '' && (href === baseNorm || href.startsWith(baseNorm + '/'));
        if (!alreadyBased) {
          href = ensureTrailingSlash(href);
          href = `${baseNorm}${href}`.replace(/\/{2,}/g, '/');
        } else {
          href = ensureTrailingSlash(href);
        }
        node.properties.href = href;
      }
    }
    if (node.children) for (const child of node.children) visit(child);
  };

  return (tree) => {
    visit(tree);
  };
}

export default defineConfig({
  site: 'https://forge-dev-studio.github.io',
  base: BASE,
  trailingSlash: 'always',
  markdown: {
    rehypePlugins: [rehypeBaseAwareLinks],
  },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
