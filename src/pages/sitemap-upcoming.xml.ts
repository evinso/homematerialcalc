import { getPendingPages } from '../lib/publishing';

const SITE = 'https://www.homematerialcalc.com';

function withSlash(url: string) {
  return url === '/' ? '/' : url.endsWith('/') ? url : url + '/';
}

// Pending pages are included at low priority so Google is aware of upcoming URLs.
// These pages currently return noindex — as each one goes live (status → published),
// noindex is removed and Google indexes it on the next crawl.
export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const pages = getPendingPages();

  const urls = pages.map(p => `  <url>
    <loc>${SITE}${withSlash(p.url)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.3</priority>
  </url>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<!-- UPCOMING: ${pages.length} pending pages — noindex now, indexed as each goes live -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
