export const prerender = false;

import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

export const POST: APIRoute = async ({ request }) => {
  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });

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
    console.error('submit error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
