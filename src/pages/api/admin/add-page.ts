export const prerender = false;

import type { APIRoute } from 'astro';

const OWNER = 'evinso';
const REPO  = 'homematerialcalc';
const PATH  = 'publish-schedule.json';

export const POST: APIRoute = async ({ request }) => {
  const key = request.headers.get('x-admin-key');
  if (key !== process.env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'GITHUB_TOKEN env var not set' }), { status: 500 });
  }

  let body: { url: string; label: string; type: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { url, label, type } = body;
  if (!url || !label || !type) {
    return new Response(JSON.stringify({ error: 'url, label ve type zorunlu' }), { status: 400 });
  }

  // 1. Mevcut dosyayı çek
  const getRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );

  if (!getRes.ok) {
    return new Response(JSON.stringify({ error: 'Dosya okunamadı', status: getRes.status }), { status: 500 });
  }

  const { content: b64Content, sha } = await getRes.json();
  const current = JSON.parse(Buffer.from(b64Content, 'base64').toString('utf-8'));

  // Duplicate kontrolü
  const exists = current.pages?.some((p: any) => p.url === url);
  if (exists) {
    return new Response(JSON.stringify({ error: `${url} zaten mevcut` }), { status: 409 });
  }

  // Yeni sayfa ekle
  current.pages.push({ url, label, type, status: 'pending', publishedAt: null });

  // 2. Güncellenmiş içeriği commit et
  const newContent = Buffer.from(JSON.stringify(current, null, 2)).toString('base64');

  const putRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `chore: add ${url} to pending queue via admin`,
        content: newContent,
        sha,
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    return new Response(JSON.stringify({ error: 'Commit başarısız', detail: err }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, message: `${url} kuyruğa eklendi` }), { status: 200 });
};
