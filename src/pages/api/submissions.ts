export const prerender = false;

import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (key !== process.env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });

  const [quotes, newsletters, contacts] = await Promise.all([
    redis.lrange('hmc:quote', 0, 49),
    redis.lrange('hmc:newsletter', 0, 49),
    redis.lrange('hmc:contact', 0, 49),
  ]);

  const parse = (items: unknown[]) =>
    items.map(item => {
      try { return typeof item === 'string' ? JSON.parse(item) : item; }
      catch { return item; }
    });

  return new Response(JSON.stringify({
    quotes: parse(quotes),
    newsletters: parse(newsletters),
    contacts: parse(contacts),
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
