export const prerender = false;

import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: import.meta.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (!['quote', 'newsletter', 'contact'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid type' }), { status: 400 });
    }

    const entry = {
      ...data,
      date: new Date().toISOString(),
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };

    await redis.lpush(`hmc:${type}`, JSON.stringify(entry));

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
