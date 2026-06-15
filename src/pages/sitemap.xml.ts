import { getPendingPages } from '../lib/publishing';

const SITE = 'https://www.homematerialcalc.com';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const sitemaps = ['sitemap-live.xml', 'sitemap-programmatic.xml'];
  if (getPendingPages().length > 0) sitemaps.splice(1, 0, 'sitemap-upcoming.xml');

  const entries = sitemaps.map(s => `  <sitemap>
    <loc>${SITE}/${s}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
