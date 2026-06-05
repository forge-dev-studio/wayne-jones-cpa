const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // '/wayne-jones-cpa'
const SITE_URL = import.meta.env.SITE; // 'https://forge-dev-studio.github.io'

export const href = (path: string) =>
  `${BASE}/${path.replace(/^\//, '')}`.replace(/\/{2,}/g, '/');

export const absoluteUrl = (path: string) => `${SITE_URL}${href(path)}`;
