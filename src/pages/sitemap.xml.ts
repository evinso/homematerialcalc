const SITE = 'https://www.homematerialcalc.com';

// 3-tier sitemap structure:
//   sitemap-live.xml         → all published pages (calculators, guides, references, static)
//   sitemap-upcoming.xml     → pending pages (noindex now, indexed as they go live)
//   sitemap-programmatic.xml → dynamic routes (area/slab/state pages, always live)

const SITEMAPS = [
  'sitemap-live.xml',
  'sitemap-upcoming.xml',
  'sitemap-programmatic.xml',
];

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const entries = SITEMAPS.map(s => `  <sitemap>
    <loc>${SITE}/${s}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
