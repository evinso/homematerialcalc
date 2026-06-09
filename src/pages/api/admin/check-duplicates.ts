export const prerender = false;

import type { APIRoute } from 'astro';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const PAGES_DIR = join(process.cwd(), 'src/pages');
const SKIP = new Set(['ozgur247162.astro', 'api']);

function walk(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else if (entry.endsWith('.astro') || entry.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

const DYNAMIC_TITLE_RE  = /(?:const\s+title\s*=|title=\{)/;
const DYNAMIC_DESC_RE   = /(?:const\s+description\s*=|description=\{)/;

function extract(content: string): { title: string | null; description: string | null; dynamic: boolean } {
  const titleMatch = content.match(/title=["']([^"']+)["']/);
  const descMatch  = content.match(/description=["']([^"']+)["']/);
  const isDynamic  = DYNAMIC_TITLE_RE.test(content) || DYNAMIC_DESC_RE.test(content);
  return {
    title:       titleMatch ? titleMatch[1].trim() : null,
    description: descMatch  ? descMatch[1].trim()  : null,
    dynamic:     isDynamic,
  };
}

export const GET: APIRoute = async ({ request }) => {
  const key = request.headers.get('x-admin-key');
  if (key !== process.env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const files = walk(PAGES_DIR);
  const pages: { path: string; title: string | null; description: string | null; dynamic: boolean }[] = [];

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const { title, description, dynamic } = extract(content);
      pages.push({ path: '/' + relative(PAGES_DIR, file).replace(/\.(astro|mdx)$/, '').replace(/\/index$/, ''), title, description, dynamic });
    } catch {
      // skip unreadable files
    }
  }

  // Find duplicate titles
  const titleMap = new Map<string, string[]>();
  const descMap  = new Map<string, string[]>();

  for (const p of pages) {
    if (p.title) {
      const key = p.title.toLowerCase();
      titleMap.set(key, [...(titleMap.get(key) ?? []), p.path]);
    }
    if (p.description) {
      const key = p.description.toLowerCase();
      descMap.set(key, [...(descMap.get(key) ?? []), p.path]);
    }
  }

  const dupTitles = [...titleMap.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([title, paths]) => ({ title: [...titleMap.keys()].find(k => k === title) as string, paths }))
    .map(({ title, paths }) => ({
      value: pages.find(p => p.title?.toLowerCase() === title)!.title!,
      paths,
    }));

  const dupDescs = [...descMap.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([desc, paths]) => ({
      value: pages.find(p => p.description?.toLowerCase() === desc)!.description!,
      paths,
    }));

  // Dynamic pages have template-generated meta — not flagged as missing
  const missing = pages
    .filter(p => !p.dynamic && (!p.title || !p.description))
    .map(p => ({ path: p.path, missingTitle: !p.title, missingDesc: !p.description }));

  const dynamicPages = pages.filter(p => p.dynamic).map(p => p.path);

  return new Response(
    JSON.stringify({ total: pages.length, dupTitles, dupDescs, missing, dynamicPages }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
