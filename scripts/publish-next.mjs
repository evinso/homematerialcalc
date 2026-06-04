/**
 * publish-next.mjs
 *
 * Promotes pending pages to "published" based on the cadence in publish-schedule.json.
 * Run manually or via a cron job / CI schedule.
 *
 * Usage:
 *   npm run publish           — promote up to pagesPerWeek pending pages, then build
 *   npm run publish -- --dry  — preview what would be published without writing
 *   npm run publish -- --all  — publish all pending pages at once
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCHEDULE_PATH = join(ROOT, 'publish-schedule.json');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry');
const PUBLISH_ALL = args.includes('--all');

// ─── Load schedule ────────────────────────────────────────────────────────────
const raw = readFileSync(SCHEDULE_PATH, 'utf-8');
const schedule = JSON.parse(raw);
const { pagesPerRun = schedule.cadence.pagesPerWeek ?? 1, minDaysBetweenRuns } = schedule.cadence;
const today = new Date().toISOString().split('T')[0];

// ─── Throttle check ───────────────────────────────────────────────────────────
if (!DRY_RUN && !PUBLISH_ALL && schedule.lastRun) {
  const last = new Date(schedule.lastRun);
  const diffDays = Math.floor((Date.now() - last.getTime()) / 86_400_000);
  if (diffDays < minDaysBetweenRuns) {
    console.log(`⏳ Last run was ${diffDays}d ago (min: ${minDaysBetweenRuns}d). Skipping.`);
    console.log('   Run with --dry to preview or --all to override.');
    process.exit(0);
  }
}

// ─── Find pending pages ───────────────────────────────────────────────────────
const pages = schedule.pages.filter(p => p && p.url && p.status);
const pending = pages.filter(p => p.status === 'pending');
const toPublish = PUBLISH_ALL ? pending : pending.slice(0, pagesPerRun);

if (toPublish.length === 0) {
  console.log('✅ No pending pages to publish.');
  const future = pages.filter(p => p.status === 'future');
  if (future.length > 0) {
    console.log(`\n📋 ${future.length} future page(s) not yet ready (status: "future"):`);
    future.forEach(p => console.log(`   · ${p.url}`));
    console.log('\n   To queue them: change status to "pending" in publish-schedule.json');
    console.log('   (make sure the .astro file exists first!)');
  }
  process.exit(0);
}

// ─── Preview ─────────────────────────────────────────────────────────────────
console.log(`\n📢 Pages to publish (${DRY_RUN ? 'DRY RUN' : 'LIVE'}):`);
toPublish.forEach(p => console.log(`   ✓ ${p.url}  —  ${p.label}`));

const stillPending = pending.slice(toPublish.length);
if (stillPending.length > 0) {
  console.log(`\n⏳ Remaining pending (next run):`);
  stillPending.forEach(p => console.log(`   · ${p.url}`));
}

if (DRY_RUN) {
  console.log('\n[DRY RUN] No changes written. Remove --dry to apply.');
  process.exit(0);
}

// ─── Apply changes ────────────────────────────────────────────────────────────
// Parse as object for structured updates (runs log + status changes)
const scheduleObj = JSON.parse(raw);

// Promote pages
for (const page of toPublish) {
  const entry = scheduleObj.pages.find(p => p && p.url === page.url);
  if (entry) {
    entry.status = 'published';
    entry.publishedAt = today;
  }
}

// Record this run in the runs history
const runRecord = {
  date: today,
  timestamp: new Date().toISOString(),
  pagesPublished: toPublish.map(p => ({ url: p.url, label: p.label, type: p.type ?? 'unknown' })),
  pendingBefore: pending.length,
  pendingAfter: pending.length - toPublish.length,
  trigger: process.env.GITHUB_ACTIONS === 'true'
    ? (process.env.GITHUB_EVENT_NAME === 'schedule' ? 'scheduled' : 'manual_dispatch')
    : 'local',
  runBy: process.env.GITHUB_ACTOR ?? 'local',
};

if (!Array.isArray(scheduleObj.runs)) scheduleObj.runs = [];
scheduleObj.runs.unshift(runRecord); // newest first

// Update lastRun
scheduleObj.lastRun = today;

// Write back with consistent formatting
const serialized = JSON.stringify(scheduleObj, null, 2);
writeFileSync(SCHEDULE_PATH, serialized + '\n', 'utf-8');
console.log(`\n✅ publish-schedule.json updated.`);
console.log(`   Run recorded: ${today} · trigger: ${runRecord.trigger} · by: ${runRecord.runBy}`);

// ─── Build ────────────────────────────────────────────────────────────────────
console.log('\n🔨 Running build…\n');
try {
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
  console.log('\n🚀 Build complete. Deploy the ./dist folder to your host.');
  console.log('   Vercel: `vercel --prod`  |  Netlify: `netlify deploy --prod --dir=dist`');
} catch {
  console.error('\n❌ Build failed. Fix errors before deploying.');
  process.exit(1);
}
