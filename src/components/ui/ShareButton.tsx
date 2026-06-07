import { useState } from 'react';

interface Props {
  className?: string;
}

export default function ShareButton({ className = '' }: Props) {
  const [state, setState] = useState<'idle' | 'copied' | 'shared'>('idle');

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url, title: document.title });
        setState('shared');
        setTimeout(() => setState('idle'), 2000);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setState('copied');
        setTimeout(() => setState('idle'), 2000);
      } catch {
        // fallback: select input
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setState('copied');
        setTimeout(() => setState('idle'), 2000);
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
        state !== 'idle'
          ? 'border-green-400 text-green-700 bg-green-50'
          : 'border-gray-300 text-gray-600 bg-white hover:border-brand-400 hover:text-brand-700'
      } ${className}`}
    >
      {state === 'copied' ? (
        <><span>✓</span> Link copied!</>
      ) : state === 'shared' ? (
        <><span>✓</span> Shared!</>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share result
        </>
      )}
    </button>
  );
}
