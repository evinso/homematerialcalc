import { getPublishedPages } from '../lib/publishing';

const SITE = 'https://www.homematerialcalc.com';

const EXCLUDE = new Set(['/privacy', '/terms', '/contact', '/contact-success']);

function withSlash(url: string) {
  return url === '/' ? '/' : url.endsWith('/') ? url : url + '/';
}

function getPriority(url: string, type: string): string {
  if (url === '/') return '1.0';
  if (type === 'calculator') return '1.0';
  if (url.startsWith('/guide/how-much')) return '0.9';
  if (type === 'guide' || type === 'reference') return '0.8';
  if (type === 'static') return '0.7';
  return '0.6';
}

function getChangefreq(type: string): string {
  if (type === 'calculator' || type === 'static') return 'monthly';
  return 'yearly';
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const pages = getPublishedPages().filter(p => !EXCLUDE.has(p.url));

  const urls = pages.map(p => `  <url>
    <loc>${SITE}${withSlash(p.url)}</loc>
    <lastmod>${p.publishedAt ?? today}</lastmod>
    <changefreq>${getChangefreq(p.type)}</changefreq>
    <priority>${getPriority(p.url, p.type)}</priority>
  </url>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<!-- LIVE: ${pages.length} published pages — calculators, guides, references, static -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
