import { getPublishedPages } from '../lib/publishing';

const SITE = 'https://homematerialcalc.com';

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
  const published = getPublishedPages().filter(p =>
    !['/privacy', '/terms', '/contact', '/contact-success'].includes(p.url)
  );

  const urls = published
    .map(p => `  <url>
    <loc>${SITE}${p.url}</loc>
    <lastmod>${p.publishedAt ?? today}</lastmod>
    <changefreq>${getChangefreq(p.url)}</changefreq>
    <priority>${getPriority(p.url)}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET() {
  return new Response(buildSitemap(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
