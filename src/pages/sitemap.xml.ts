import { getPublishedPages } from '../lib/publishing';

const SITE = 'https://www.homematerialcalc.com';

const PRIORITY: Record<string, string> = {
  '/': '1.0',
  '/calculator': '1.0',
  '/guide/how-much': '0.9',
  '/guide': '0.8',
  '/methodology': '0.7',
};

const CHANGEFREQ: Record<string, string> = {
  '/calculator': 'monthly',
  '/guide': 'yearly',
  '/methodology': 'yearly',
};

// Programmatic pages — kept in sync with getStaticPaths in each file
// All URLs end with / to match canonical tags
const PROGRAMMATIC_PAGES: string[] = [
  ...[50,150,200,250,300,400,500,600,750,1000,1500,2000].map(a => `/guide/how-much-mulch-for-${a}-sq-ft/`),
  ...[100,200,300,500,1000].map(a => `/guide/how-much-gravel-for-${a}-sq-ft/`),
  ...['4x4','6x6','8x8','10x16','12x12','12x20','16x16','20x20','20x40','24x24'].map(s => `/guide/how-many-bags-of-concrete-for-${s}-slab/`),
  ...[50,100,200,300,500,1000,2000].map(a => `/guide/how-much-topsoil-for-${a}-sq-ft/`),
  ...[50,100,200,300,500].map(a => `/guide/how-much-sand-for-${a}-sq-ft/`),
  ...[100,200,500,1000,2000,5000,10000].map(a => `/guide/how-much-sod-for-${a}-sq-ft/`),
  ...['8x8','10x10','10x12','10x14','12x12','12x14','12x15','12x20','14x14','15x15','20x20'].map(s => `/guide/how-much-paint-for-${s}-room/`),
  // State × material pages (20 states × 4 materials = 80 pages)
  ...['mulch','gravel','topsoil','sand'].flatMap(m =>
    ['texas','florida','california','new-york','georgia','north-carolina','ohio','michigan',
     'pennsylvania','illinois','arizona','washington','tennessee','indiana','missouri',
     'colorado','virginia','maryland','oregon','wisconsin'].map(s => `/guide/${m}-cost-in-${s}/`)
  ),
];

// Ensure trailing slash on URL (homepage stays /)
function withSlash(url: string): string {
  if (url === '/') return '/';
  return url.endsWith('/') ? url : url + '/';
}

function getPriority(url: string): string {
  if (url === '/') return '1.0';
  for (const [prefix, val] of Object.entries(PRIORITY)) {
    if (url.startsWith(prefix)) return val;
  }
  return '0.5';
}

function getChangefreq(url: string): string {
  for (const [prefix, val] of Object.entries(CHANGEFREQ)) {
    if (url.startsWith(prefix)) return val;
  }
  return 'yearly';
}

function buildSitemap(): string {
  const today = new Date().toISOString().split('T')[0];
  const EXCLUDE = new Set(['/privacy', '/terms', '/contact', '/contact-success']);

  const published = getPublishedPages().filter(p => !EXCLUDE.has(p.url));

  const publishedUrls = published.map(p => {
    const loc = SITE + withSlash(p.url);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${p.publishedAt ?? today}</lastmod>
    <changefreq>${getChangefreq(p.url)}</changefreq>
    <priority>${getPriority(p.url)}</priority>
  </url>`;
  });

  const programmaticUrls = PROGRAMMATIC_PAGES.map(url => `  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...publishedUrls, ...programmaticUrls].join('\n')}
</urlset>`;
}

export async function GET() {
  return new Response(buildSitemap(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
