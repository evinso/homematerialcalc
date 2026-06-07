import { useState, useEffect, useRef } from 'react';
import ShareButton from '../ui/ShareButton';
import { useLocalStorage } from '../../lib/useLocalStorage';
import { getUrlParam, setUrlParams } from '../../lib/useUrlParams';

type GrassType = 'tall-fescue' | 'fine-fescue' | 'kentucky-bluegrass' | 'perennial-rye' | 'bermuda' | 'zoysia' | 'buffalo';
type SeedMode = 'new' | 'overseed';

const GRASS_LABELS: Record<GrassType, string> = {
  'tall-fescue':          'Tall Fescue',
  'fine-fescue':          'Fine Fescue',
  'kentucky-bluegrass':   'Kentucky Bluegrass',
  'perennial-rye':        'Perennial Ryegrass',
  'bermuda':              'Bermudagrass',
  'zoysia':               'Zoysia',
  'buffalo':              'Buffalograss',
};

// lbs per 1,000 sq ft — [new lawn, overseeding]
const RATES: Record<GrassType, [number, number]> = {
  'tall-fescue':        [7, 3.5],
  'fine-fescue':        [4.5, 2],
  'kentucky-bluegrass': [2.5, 1.25],
  'perennial-rye':      [7, 3.5],
  'bermuda':            [1.5, 0.75],
  'zoysia':             [1.5, 0.75],
  'buffalo':            [1.5, 0.75],
};

const PRICE_PER_LB: Record<GrassType, number> = {
  'tall-fescue': 3.5, 'fine-fescue': 5, 'kentucky-bluegrass': 8,
  'perennial-rye': 3, 'bermuda': 12, 'zoysia': 15, 'buffalo': 10,
};

export default function GrassSeedCalculator() {
  const [lengthFt, setLengthFt] = useLocalStorage('gseed_l', Number(getUrlParam('l') ?? 50));
  const [widthFt, setWidthFt]   = useLocalStorage('gseed_w', Number(getUrlParam('w') ?? 40));
  const [grassType, setGrassType] = useLocalStorage<GrassType>('gseed_type', (getUrlParam('t') as GrassType | null) ?? 'tall-fescue');
  const [mode, setMode] = useLocalStorage<SeedMode>('gseed_mode', (getUrlParam('mode') as SeedMode | null) ?? 'new');
  const [pricePerLb, setPricePerLb] = useLocalStorage('gseed_price', getUrlParam('price') ?? '');

  const areaSqFt = lengthFt * widthFt;
  const rateIdx = mode === 'new' ? 0 : 1;
  const lbsPer1k = RATES[grassType][rateIdx];
  const lbsNeeded = Math.ceil((areaSqFt / 1000) * lbsPer1k * 1.1); // +10% waste
  const lbsNeededExact = (areaSqFt / 1000) * lbsPer1k;
  const priceLb = pricePerLb ? Number(pricePerLb) : PRICE_PER_LB[grassType];
  const costEstimate = lbsNeeded * priceLb;
  const hasArea = areaSqFt > 0;

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!hasArea) return;
    setUrlParams({ l: lengthFt, w: widthFt, t: grassType, mode, ...(pricePerLb ? { price: pricePerLb } : {}) });
  }, [lengthFt, widthFt, grassType, mode, pricePerLb]);

  return (
    <div className="space-y-6">
      {/* Mode */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">1. Project type</h2>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {([['new', 'New Lawn'], ['overseed', 'Overseeding']] as const).map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === m ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {mode === 'new' ? 'Bare soil — full seeding rate' : 'Thin or patchy lawn — half rate'}
        </p>
      </div>

      {/* Dimensions */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">2. Lawn size</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Length (ft)</span>
            <input type="number" min="0" step="1" value={lengthFt}
              onChange={e => setLengthFt(Number(e.target.value))}
              className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Width (ft)</span>
            <input type="number" min="0" step="1" value={widthFt}
              onChange={e => setWidthFt(Number(e.target.value))}
              className="input-field" />
          </label>
        </div>
        {areaSqFt > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Area: <strong>{areaSqFt.toLocaleString()} sq ft</strong>
            {areaSqFt >= 43560 && <span className="ml-2 text-brand-600">({(areaSqFt / 43560).toFixed(2)} acres)</span>}
          </p>
        )}
      </div>

      {/* Grass type */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">3. Grass type</h2>
        <select value={grassType} onChange={e => setGrassType(e.target.value as GrassType)} className="input-field">
          {(Object.keys(GRASS_LABELS) as GrassType[]).map(k => (
            <option key={k} value={k}>{GRASS_LABELS[k]} — {RATES[k][0]} lbs/1,000 sq ft (new)</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-2">
          {mode === 'new' ? `New lawn rate: ${lbsPer1k} lbs per 1,000 sq ft` : `Overseeding rate: ${lbsPer1k} lbs per 1,000 sq ft`}
        </p>
      </div>

      {/* Price */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">4. Price per lb (optional)</h2>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-2 text-gray-400">$</span>
          <input type="number" min="0" step="0.01"
            placeholder={String(PRICE_PER_LB[grassType])}
            value={pricePerLb}
            onChange={e => setPricePerLb(e.target.value)}
            className="input-field pl-7" />
        </div>
        <p className="text-xs text-gray-500 mt-1">Typical: ${PRICE_PER_LB[grassType]}/lb for {GRASS_LABELS[grassType]}</p>
      </div>

      {/* Result */}
      {hasArea && (
        <div className="result-box">
          <div className="flex items-start justify-between mb-3 gap-3">
            <h2 className="font-bold text-brand-800 text-lg">Your Grass Seed Estimate</h2>
            <ShareButton />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{lbsNeeded}</p>
              <p className="text-sm text-gray-600 mt-1">lbs needed</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">${costEstimate.toFixed(0)}</p>
              <p className="text-sm text-gray-600 mt-1">est. seed cost</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-sm space-y-1.5 text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">Calculation breakdown</p>
            <p>Area: <span className="font-medium">{areaSqFt.toLocaleString()} sq ft</span></p>
            <p>Seeding rate: <span className="font-medium">{lbsPer1k} lbs per 1,000 sq ft</span> ({mode === 'new' ? 'new lawn' : 'overseeding'})</p>
            <p>Base seed needed: <span className="font-medium">{lbsNeededExact.toFixed(1)} lbs</span></p>
            <p>With 10% waste buffer: <span className="font-medium">{lbsNeeded} lbs</span> (rounded up)</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Includes 10% extra for uneven coverage. Confirm seeding rates on your seed bag label.</p>
        </div>
      )}
    </div>
  );
}
