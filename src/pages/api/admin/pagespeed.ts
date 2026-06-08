export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url  = new URL(request.url);
  const path = url.searchParams.get('path') ?? '/';
  const key  = process.env.PAGESPEED_KEY ?? '';

  const target  = encodeURIComponent(`https://www.homematerialcalc.com${path}`);
  const apiUrl  = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${target}&strategy=mobile${key ? `&key=${key}` : ''}`;

  try {
    const res  = await fetch(apiUrl, { signal: AbortSignal.timeout(30_000) });
    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data?.error?.message ?? 'API hatası', status: res.status }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cats    = data?.lighthouseResult?.categories;
    const audits  = data?.lighthouseResult?.audits;

    const score = (n: number | undefined) => Math.round((n ?? 0) * 100);

    return new Response(JSON.stringify({
      path,
      performance: score(cats?.performance?.score),
      lcp:  audits?.['largest-contentful-paint']?.displayValue ?? '—',
      fcp:  audits?.['first-contentful-paint']?.displayValue ?? '—',
      cls:  audits?.['cumulative-layout-shift']?.displayValue ?? '—',
      tbt:  audits?.['total-blocking-time']?.displayValue ?? '—',
      si:   audits?.['speed-index']?.displayValue ?? '—',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Zaman aşımı veya bağlantı hatası' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
