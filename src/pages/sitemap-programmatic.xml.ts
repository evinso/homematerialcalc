const SITE = 'https://www.homematerialcalc.com';

// Area-based pages — kept in sync with getStaticPaths in each .astro file
const AREA_PAGES: string[] = [
  ...[50,150,200,250,300,400,500,600,750,1000,1500,2000].map(a => `/guide/how-much-mulch-for-${a}-sq-ft/`),
  ...[100,200,300,500,1000].map(a => `/guide/how-much-gravel-for-${a}-sq-ft/`),
  ...[50,100,200,300,500,1000,2000].map(a => `/guide/how-much-topsoil-for-${a}-sq-ft/`),
  ...[50,100,200,300,500].map(a => `/guide/how-much-sand-for-${a}-sq-ft/`),
  ...[100,200,500,1000,2000,5000,10000].map(a => `/guide/how-much-sod-for-${a}-sq-ft/`),
  ...['4x4','6x6','8x8','10x16','12x12','12x20','16x16','20x20','20x40','24x24'].map(s => `/guide/how-many-bags-of-concrete-for-${s}-slab/`),
  ...['8x8','10x10','10x12','10x14','12x12','12x14','12x15','12x20','14x14','15x15','20x20'].map(s => `/guide/how-much-paint-for-${s}-room/`),
];

// State × material pages (4 materials × 20 states = 80 pages)
const STATE_PAGES: string[] = ['mulch','gravel','topsoil','sand'].flatMap(m =>
  ['texas','florida','california','new-york','georgia','north-carolina','ohio','michigan',
   'pennsylvania','illinois','arizona','washington','tennessee','indiana','missouri',
   'colorado','virginia','maryland','oregon','wisconsin'].map(s => `/guide/${m}-cost-in-${s}/`)
);

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const areaUrls = AREA_PAGES.map(url => `  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`);

  const stateUrls = STATE_PAGES.map(url => `  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`);

  const all = [...areaUrls, ...stateUrls].join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all}
</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
