export const prerender = false;

import type { APIRoute } from 'astro';

const OWNER    = 'evinso';
const REPO     = 'homematerialcalc';
const WORKFLOW = 'scheduled-publish.yml';

export const POST: APIRoute = async ({ request }) => {
  const key = request.headers.get('x-admin-key');
  if (key !== process.env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'GITHUB_TOKEN env var not set' }), { status: 500 });
  }

  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: 'main' }),
    }
  );

  if (res.status === 204) {
    return new Response(JSON.stringify({ ok: true, message: 'Workflow tetiklendi — ~2 dk içinde yayınlanır' }), { status: 200 });
  }

  const body = await res.text();
  return new Response(JSON.stringify({ error: `GitHub API hatası: ${res.status}`, detail: body }), { status: res.status });
};
