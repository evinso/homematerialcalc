const SITE = 'https://www.homematerialcalc.com';

const SITEMAPS = [
  'sitemap-calculators.xml',
  'sitemap-guides.xml',
  'sitemap-programmatic.xml',
  'sitemap-static.xml',
];

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const entries = SITEMAPS.map(s => `  <sitemap>
    <loc>${SITE}/${s}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
