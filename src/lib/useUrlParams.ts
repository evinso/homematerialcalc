/** Read a URL search param (safe for SSR). */
export function getUrlParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

/** Write multiple URL search params without navigation. */
export function setUrlParams(params: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) {
      url.searchParams.set(k, String(v));
    }
  });
  history.replaceState({}, '', url.toString());
}

/** Get the full current URL (for sharing). */
export function getCurrentUrl(): string {
  return typeof window !== 'undefined' ? window.location.href : '';
}
