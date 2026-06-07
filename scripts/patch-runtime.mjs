// Patch @astrojs/vercel@7 which hardcodes nodejs18.x (now invalid on Vercel)
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const funcDir = '.vercel/output/functions';
try {
  const fns = readdirSync(funcDir);
  for (const fn of fns) {
    const cfg = join(funcDir, fn, '.vc-config.json');
    try {
      const data = JSON.parse(readFileSync(cfg, 'utf8'));
      if (data.runtime === 'nodejs18.x') {
        data.runtime = 'nodejs20.x';
        writeFileSync(cfg, JSON.stringify(data, null, '\t'));
        console.log(`[patch-runtime] ${fn}: nodejs18.x → nodejs20.x`);
      }
    } catch {}
  }
} catch {
  console.log('[patch-runtime] no .vercel/output/functions found, skipping');
}
