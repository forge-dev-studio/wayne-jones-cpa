import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// DOMAIN CUTOVER: when waynejonescpa.com is live, set site:'https://waynejonescpa.com',
// base:'/', add public/CNAME with the domain, and set the Pages custom domain.
export default defineConfig({
  site: 'https://forge-dev-studio.github.io',
  base: '/wayne-jones-cpa',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
