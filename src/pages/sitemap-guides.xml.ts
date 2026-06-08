import { getPublishedPages } from '../lib/publishing';

const SITE = 'https://www.homematerialcalc.com';

const EXCLUDE = new Set(['/privacy', '/terms', '/contact', '/contact-success']);

function withSlash(url: string) {
  return url === '/' ? '/' : url.endsWith('/') ? url : url + '/';
}

function getPriority(url: string): string {
  if (url.startsWith('/guide/how-much')) return '0.9';
  return '0.8';
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const guides = getPublishedPages().filter(
    p => (p.type === 'guide' || p.type === 'reference') && !EXCLUDE.has(p.url)
  );

  const urls = guides.map(p => `  <url>
    <loc>${SITE}${withSlash(p.url)}</loc>
    <lastmod>${p.publishedAt ?? today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>${getPriority(p.url)}</priority>
  </url>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
