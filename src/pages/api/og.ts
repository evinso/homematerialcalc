import type { APIRoute } from 'astro';

export const prerender = false;

// Brand colours
const BLUE = '#2563eb';
const BLUE_DARK = '#1d4ed8';
const BLUE_LIGHT = '#dbeafe';
const WHITE = '#ffffff';
const GRAY = '#6b7280';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxCharsPerLine = 32): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxCharsPerLine && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines.slice(0, 3); // max 3 lines
}

function getIcon(type: string): string {
  if (type === 'calculator') return '🧮';
  if (type === 'guide') return '📐';
  if (type === 'comparison') return '⚖️';
  return '🏠';
}

export const GET: APIRoute = ({ url }) => {
  const title = url.searchParams.get('title') ?? 'Free Material Calculator';
  const sub = url.searchParams.get('sub') ?? 'Instant estimates for US homeowners';
  const type = url.searchParams.get('type') ?? 'calculator';

  const safeTitle = escapeXml(title);
  const safeSub = escapeXml(sub);
  const icon = getIcon(type);

  const titleLines = wrapText(title, 28);
  const titleY = titleLines.length === 1 ? 290 : titleLines.length === 2 ? 268 : 248;
  const lineH = 72;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BLUE_DARK}"/>
      <stop offset="100%" stop-color="${BLUE}"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${WHITE}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${WHITE}" stop-opacity="0.02"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle grid pattern -->
  <g opacity="0.06">
    ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="630" stroke="white" stroke-width="1"/>`).join('')}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="1200" y2="${i * 100}" stroke="white" stroke-width="1"/>`).join('')}
  </g>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="8" fill="${WHITE}" opacity="0.15"/>

  <!-- Card -->
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="url(#card)" stroke="${WHITE}" stroke-opacity="0.12" stroke-width="1.5"/>

  <!-- Site label -->
  <text x="120" y="148" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="600" fill="${WHITE}" opacity="0.7" letter-spacing="2">HOMEMATERIALCALC.COM</text>

  <!-- Divider -->
  <rect x="120" y="162" width="60" height="3" rx="2" fill="${WHITE}" opacity="0.4"/>

  <!-- Icon -->
  <text x="120" y="248" font-family="system-ui,sans-serif" font-size="64">${icon}</text>

  <!-- Title lines -->
  ${titleLines.map((line, i) => `<text x="120" y="${titleY + i * lineH}" font-family="system-ui,-apple-system,sans-serif" font-size="64" font-weight="800" fill="${WHITE}" letter-spacing="-1">${escapeXml(line)}</text>`).join('\n  ')}

  <!-- Subtitle -->
  <text x="120" y="${titleY + titleLines.length * lineH + 32}" font-family="system-ui,-apple-system,sans-serif" font-size="28" fill="${WHITE}" opacity="0.75">${safeSub}</text>

  <!-- Bottom badge -->
  <rect x="120" y="506" width="200" height="40" rx="20" fill="${WHITE}" opacity="0.15"/>
  <text x="220" y="531" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="17" font-weight="600" fill="${WHITE}">Free · No signup</text>

  <!-- Right decorative circles -->
  <circle cx="980" cy="315" r="180" fill="${WHITE}" opacity="0.04"/>
  <circle cx="980" cy="315" r="120" fill="${WHITE}" opacity="0.04"/>
  <circle cx="980" cy="315" r="60" fill="${WHITE}" opacity="0.06"/>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};
