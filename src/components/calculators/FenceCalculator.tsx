import { useState, useEffect, useRef } from 'react';
import ShareButton from '../ui/ShareButton';
import { useLocalStorage } from '../../lib/useLocalStorage';
import { getUrlParam, setUrlParams } from '../../lib/useUrlParams';

type FenceMaterial = 'wood-6ft' | 'wood-8ft' | 'vinyl-6ft' | 'chainlink-4ft' | 'chainlink-6ft';

const MATERIAL_LABELS: Record<FenceMaterial, string> = {
  'wood-6ft':       'Wood privacy — 6 ft tall',
  'wood-8ft':       'Wood privacy — 8 ft tall',
  'vinyl-6ft':      'Vinyl privacy — 6 ft tall',
  'chainlink-4ft':  'Chain link — 4 ft tall',
  'chainlink-6ft':  'Chain link — 6 ft tall',
};

const POST_SPACING_FT = 8; // standard
const CONCRETE_BAGS_PER_POST = 2; // 50 lb bags

function calcFence(linearFt: number, mat: FenceMaterial, gates: number) {
  const posts = Math.ceil(linearFt / POST_SPACING_FT) + 1 + gates; // extra post per gate
  const concreteBags = posts * CONCRETE_BAGS_PER_POST;

  const isPrivacy = mat.startsWith('wood') || mat.startsWith('vinyl');
  const isWood    = mat.startsWith('wood');
  const height    = mat.includes('8ft') ? 8 : mat.includes('4ft') ? 4 : 6;

  // Rails: 2 for ≤6 ft, 3 for 8 ft
  const railsPerSection = height === 8 ? 3 : 2;
  const sections = Math.ceil(linearFt / POST_SPACING_FT);
  const rails = isPrivacy ? sections * railsPerSection : 0;

  // Pickets (wood privacy only): 5.5 in wide, 1/2 in gap → ~1.6 pickets/ft
  const pickets = isWood ? Math.ceil(linearFt * 1.6 * 1.05) : 0; // 5% waste

  // Chain link: rolls of 50 linear ft
  const chainLinkRolls = !isPrivacy ? Math.ceil(linearFt / 50) : 0;

  // Post caps (wood only)
  const postCaps = isWood ? posts : 0;

  return { posts, concreteBags, rails, pickets, chainLinkRolls, postCaps, sections };
}

export default function FenceCalculator() {
  const [linearFt, setLinearFt] = useLocalStorage('fence_l', Number(getUrlParam('l') ?? 100));
  const [material, setMaterial] = useLocalStorage<FenceMaterial>('fence_mat', (getUrlParam('mat') as FenceMaterial | null) ?? 'wood-6ft');
  const [gates, setGates] = useLocalStorage('fence_gates', Number(getUrlParam('gates') ?? 1));

  const r = calcFence(linearFt, material, gates);
  const hasInput = linearFt > 0;

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!hasInput) return;
    setUrlParams({ l: linearFt, mat: material, gates });
  }, [linearFt, material, gates]);

  const isWood    = material.startsWith('wood');
  const isPrivacy = isWood || material.startsWith('vinyl');

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Total fence length</h2>
        <label className="flex flex-col gap-1 max-w-xs">
          <span className="text-sm text-gray-600">Linear feet of fence</span>
          <input type="number" min="0" step="1" value={linearFt}
            onChange={e => setLinearFt(Number(e.target.value))}
            className="input-field" />
        </label>
        <p className="text-xs text-gray-500 mt-2">Measure the total perimeter or run of fence needed.</p>
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Fence type</h2>
        <select value={material} onChange={e => setMaterial(e.target.value as FenceMaterial)} className="input-field">
          {(Object.keys(MATERIAL_LABELS) as FenceMaterial[]).map(k => (
            <option key={k} value={k}>{MATERIAL_LABELS[k]}</option>
          ))}
        </select>
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">3. Number of gates</h2>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setGates(n)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                gates === n ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {hasInput && (
        <div className="result-box">
          <div className="flex items-start justify-between mb-3 gap-3">
            <h2 className="font-bold text-brand-800 text-lg">Your Fence Materials List</h2>
            <ShareButton />
          </div>
          <div className="bg-white rounded-lg p-4 space-y-2.5 text-sm text-gray-700 mb-4">
            <p className="font-semibold text-gray-900 mb-3">Materials needed for {linearFt} linear ft</p>
            <div className="flex justify-between border-b pb-2">
              <span>Posts (every 8 ft + gates)</span>
              <span className="font-bold text-brand-700">{r.posts} posts</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Concrete (2 bags per post)</span>
              <span className="font-bold text-brand-700">{r.concreteBags} bags (50 lb)</span>
            </div>
            {isPrivacy && (
              <div className="flex justify-between border-b pb-2">
                <span>Rails ({material.includes('8ft') ? 3 : 2} per section)</span>
                <span className="font-bold text-brand-700">{r.rails} rails</span>
              </div>
            )}
            {isWood && (
              <div className="flex justify-between border-b pb-2">
                <span>Pickets (6" wide, 5% waste)</span>
                <span className="font-bold text-brand-700">{r.pickets} pickets</span>
              </div>
            )}
            {!isPrivacy && (
              <div className="flex justify-between border-b pb-2">
                <span>Chain link fabric (50 ft rolls)</span>
                <span className="font-bold text-brand-700">{r.chainLinkRolls} rolls</span>
              </div>
            )}
            {isWood && (
              <div className="flex justify-between">
                <span>Post caps</span>
                <span className="font-bold text-brand-700">{r.postCaps} caps</span>
              </div>
            )}
          </div>
          <div className="bg-brand-50 rounded-lg p-3 text-xs text-brand-700">
            <p>Post spacing: 8 ft on-center · Post holes: 12 in diameter × 2 ft deep recommended · Always call 811 before digging</p>
          </div>
        </div>
      )}
    </div>
  );
}
