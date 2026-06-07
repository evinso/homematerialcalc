import { useState, useEffect, useRef } from 'react';
import ShareButton from '../ui/ShareButton';
import { useLocalStorage } from '../../lib/useLocalStorage';
import { getUrlParam, setUrlParams } from '../../lib/useUrlParams';

type AsphaltThickness = '2' | '3' | '4' | '6';

const THICKNESS_LABELS: Record<AsphaltThickness, string> = {
  '2': '2 inches — overlay / resurfacing',
  '3': '3 inches — residential driveway',
  '4': '4 inches — heavy residential / parking',
  '6': '6 inches — commercial / heavy traffic',
};

// Asphalt density: ~145 lbs per cubic foot = ~1.96 tons per cubic yard
const ASPHALT_TONS_PER_CU_YD = 1.96;
// Rule of thumb: 1 ton covers ~80 sq ft at 2 in, ~55 sq ft at 3 in, ~40 sq ft at 4 in
function sqFtPerTon(thicknessIn: number) { return Math.round(160 / thicknessIn); }

export default function AsphaltCalculator() {
  const [lengthFt, setLengthFt] = useLocalStorage('asph_l', Number(getUrlParam('l') ?? 50));
  const [widthFt, setWidthFt]   = useLocalStorage('asph_w', Number(getUrlParam('w') ?? 12));
  const [thickness, setThickness] = useLocalStorage<AsphaltThickness>('asph_th', (getUrlParam('th') as AsphaltThickness | null) ?? '3');
  const [pricePerTon, setPricePerTon] = useLocalStorage('asph_price', getUrlParam('price') ?? '');

  const areaSqFt = lengthFt * widthFt;
  const thIn = Number(thickness);
  const volumeCuFt = areaSqFt * thIn / 12;
  const volumeCuYd = volumeCuFt / 27;
  const tonsNeeded = Math.ceil(volumeCuYd * ASPHALT_TONS_PER_CU_YD * 1.05 * 10) / 10; // 5% waste, 1 decimal
  const costEst = pricePerTon ? (tonsNeeded * Number(pricePerTon)).toFixed(0) : null;

  // Gravel base estimate (4 in typically needed under new asphalt)
  const gravelCuYd = Math.ceil((areaSqFt * 4 / 12 / 27) * 1.1 * 10) / 10;
  const gravelTons = Math.ceil(gravelCuYd * 1.4 * 10) / 10;

  const hasInput = areaSqFt > 0;

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!hasInput) return;
    setUrlParams({ l: lengthFt, w: widthFt, th: thickness, ...(pricePerTon ? { price: pricePerTon } : {}) });
  }, [lengthFt, widthFt, thickness, pricePerTon]);

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Area dimensions</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Length (ft)</span>
            <input type="number" min="0" step="1" value={lengthFt}
              onChange={e => setLengthFt(Number(e.target.value))} className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Width (ft)</span>
            <input type="number" min="0" step="1" value={widthFt}
              onChange={e => setWidthFt(Number(e.target.value))} className="input-field" />
          </label>
        </div>
        {hasInput && <p className="text-sm text-gray-500 mt-2">Area: <strong>{areaSqFt.toLocaleString()} sq ft</strong></p>}
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Asphalt thickness</h2>
        <div className="space-y-2">
          {(Object.keys(THICKNESS_LABELS) as AsphaltThickness[]).map(t => (
            <button key={t} onClick={() => setThickness(t)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                thickness === t ? 'border-brand-500 bg-brand-50 text-brand-800 font-medium' : 'border-gray-200 text-gray-700 hover:border-brand-300'
              }`}>
              <span className="font-semibold">{t}"</span> — {THICKNESS_LABELS[t].split('— ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-2">3. Price per ton (optional)</h2>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-2 text-gray-400">$</span>
          <input type="number" min="0" step="1" placeholder="85" value={pricePerTon}
            onChange={e => setPricePerTon(e.target.value)} className="input-field pl-7" />
        </div>
        <p className="text-xs text-gray-500 mt-1">Typical: $80–$130/ton for asphalt mix (materials only)</p>
      </div>

      {hasInput && (
        <div className="result-box">
          <div className="flex items-start justify-between mb-3 gap-3">
            <h2 className="font-bold text-brand-800 text-lg">Your Asphalt Estimate</h2>
            <ShareButton />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{tonsNeeded}</p>
              <p className="text-sm text-gray-600 mt-1">tons of asphalt</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{volumeCuYd.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">cubic yards</p>
            </div>
          </div>
          {costEst && (
            <div className="bg-brand-100 rounded-lg p-3 text-center mb-4">
              <p className="text-sm text-gray-600">Estimated material cost</p>
              <p className="text-2xl font-bold text-brand-800">${costEst}</p>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 text-sm space-y-1.5 text-gray-700 mb-3">
            <p className="font-semibold text-gray-900 mb-2">Calculation breakdown</p>
            <p>Area: <span className="font-medium">{areaSqFt.toLocaleString()} sq ft</span></p>
            <p>Volume: <span className="font-medium">{volumeCuFt.toFixed(1)} cu ft = {volumeCuYd.toFixed(2)} cu yd</span></p>
            <p>Weight: {volumeCuYd.toFixed(2)} cu yd × {ASPHALT_TONS_PER_CU_YD} tons/cu yd + 5% = <span className="font-medium">{tonsNeeded} tons</span></p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <p className="font-medium mb-1">If installing new asphalt, you also need:</p>
            <p>Compacted gravel base (4"): <span className="font-medium">{gravelCuYd} cu yd / {gravelTons} tons</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
