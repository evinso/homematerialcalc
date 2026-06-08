import schedule from '../../publish-schedule.json';

export type PageStatus = 'published' | 'pending' | 'future';

export type PageType = 'calculator' | 'guide' | 'reference' | 'static';

export interface ScheduledPage {
  url: string;
  label: string;
  type: PageType;
  status: PageStatus;
  publishedAt: string | null;
}

const pages = (schedule.pages as unknown[]).filter(
  (p): p is ScheduledPage => typeof p === 'object' && p !== null && 'url' in p && 'status' in p
);

/** Returns all pages with status === 'published'. */
export function getPublishedPages(): ScheduledPage[] {
  return pages.filter(p => p.status === 'published');
}

/** Returns all pages with status === 'pending' (file exists, not yet published). */
export function getPendingPages(): ScheduledPage[] {
  return pages.filter(p => p.status === 'pending');
}

/** Returns true if the given URL is published. */
export function isPublished(url: string): boolean {
  return pages.some(p => p.url === url && p.status === 'published');
}

/** Published URLs as a Set for O(1) lookup. */
export const publishedUrls = new Set(getPublishedPages().map(p => p.url));
