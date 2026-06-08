import { getPublishedPages } from '../lib/publishing';

const SITE = 'https://www.homematerialcalc.com';

function withSlash(url: string) {
  return url === '/' ? '/' : url.endsWith('/') ? url : url + '/';
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const calcs = getPublishedPages().filter(p => p.type === 'calculator');

  const urls = calcs.map(p => `  <url>
    <loc>${SITE}${withSlash(p.url)}</loc>
    <lastmod>${p.publishedAt ?? today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
