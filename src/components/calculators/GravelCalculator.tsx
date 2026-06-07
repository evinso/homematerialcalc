import { useState, useEffect, useRef } from 'react';
import ShapeInput from '../ui/ShapeInput';
import WasteSlider from '../ui/WasteSlider';
import ShareButton from '../ui/ShareButton';
import { calcGravel } from '../../lib/engine/calculators';
import { GRAVEL, GRAVEL_DENSITIES } from '../../lib/engine/constants';
import { useLocalStorage } from '../../lib/useLocalStorage';
import { getUrlParam, setUrlParams } from '../../lib/useUrlParams';
import type { GravelType } from '../../lib/engine/constants';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';

const STONE_LABELS: Record<GravelType, string> = {
  'pea-gravel':         'Pea Gravel',
  'crushed-stone-3_4':  'Crushed Stone (3/4")',
  'crushed-limestone':  'Crushed Limestone',
  'river-rock':         'River Rock (1–3")',
  'decomposed-granite': 'Decomposed Granite',
};

const DEPTH_OPTIONS = [1, 2, 3, 4, 6];

export default function GravelCalculator() {
  const initL = Number(getUrlParam('l') ?? 0);
  const initW = Number(getUrlParam('w') ?? 0);

  const [shape, setShape] = useState<EngineShape>({ type: 'rectangle', lengthFt: initL, widthFt: initW });
  const [depthIn, setDepthIn] = useLocalStorage('gravel_depth', Number(getUrlParam('d') ?? GRAVEL.DEFAULT_DEPTH_IN));
  const [stoneType, setStoneType] = useLocalStorage<GravelType>('gravel_type', (getUrlParam('t') as GravelType | null) ?? GRAVEL.DEFAULT_TYPE);
  const [waste, setWaste] = useLocalStorage('gravel_waste', Number(getUrlParam('waste') ?? GRAVEL.DEFAULT_WASTE));
  const [pricePerTon, setPricePerTon] = useLocalStorage('gravel_price', getUrlParam('price') ?? '');

  const result = calcGravel(shape, depthIn, stoneType, waste, pricePerTon ? Number(pricePerTon) : undefined);
  const hasArea = result.areaSqFt > 0;

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!hasArea) return;
    const s = shape as any;
    setUrlParams({ l: s.lengthFt ?? 0, w: s.widthFt ?? 0, d: depthIn, t: stoneType, waste, ...(pricePerTon ? { price: pricePerTon } : {}) });
  }, [shape, depthIn, stoneType, waste, pricePerTon]);

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Measure your area</h2>
        <ShapeInput onChange={setShape} initLFt={initL} initWFt={initW} />
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Stone type &amp; depth</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Stone type</label>
          <select
            value={stoneType}
            onChange={e => setStoneType(e.target.value as GravelType)}
            className="input-field"
          >
            {(Object.keys(STONE_LABELS) as GravelType[]).map(k => (
              <option key={k} value={k}>{STONE_LABELS[k]} — {GRAVEL_DENSITIES[k].tons} tons/cu yd</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Depth</label>
          <div className="flex flex-wrap gap-2">
            {DEPTH_OPTIONS.map(d => (
              <button key={d} onClick={() => setDepthIn(d)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  depthIn === d ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'
                }`}>
                {d}"
              </button>
            ))}
            <input type="number" min="1" max="12" step="0.5" value={depthIn}
              onChange={e => setDepthIn(Number(e.target.value))}
              className="input-field w-20 text-center" placeholder="in" />
          </div>
          <p className="text-xs text-gray-500 mt-2">2" decorative · 3–4" driveways &amp; walkways</p>
        </div>
      </div>

      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">3. Adjust &amp; price (optional)</h2>
        <WasteSlider value={waste} onChange={setWaste} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per ton (optional)</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={pricePerTon}
              onChange={e => setPricePerTon(e.target.value)} className="input-field pl-7" />
          </div>
        </div>
      </div>

      {hasArea && (
        <div className="result-box">
          <div className="flex items-start justify-between mb-3 gap-3">
            <h2 className="font-bold text-brand-800 text-lg">Your Gravel Estimate</h2>
            <ShareButton />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{result.tons.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">tons</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{result.volumeCuYdWithWaste.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">cubic yards</p>
            </div>
          </div>
          {result.costEstimate != null && (
            <div className="bg-brand-100 rounded-lg p-3 text-center mb-4">
              <p className="text-sm text-gray-600">Estimated cost</p>
              <p className="text-2xl font-bold text-brand-800">${result.costEstimate.toFixed(2)}</p>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 text-sm space-y-1.5 text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">Calculation breakdown</p>
            <p>Area: <span className="font-medium">{result.areaSqFt.toFixed(1)} sq ft</span></p>
            <p>Volume: <span className="font-medium">{result.volumeCuFt.toFixed(2)} cu ft</span> ({result.volumeCuYd.toFixed(2)} cu yd)</p>
            <p>With {Math.round(waste * 100)}% waste: <span className="font-medium">{result.volumeCuYdWithWaste.toFixed(2)} cu yd</span></p>
            <p>Weight: {result.volumeCuYdWithWaste.toFixed(2)} cu yd × {GRAVEL_DENSITIES[stoneType].tons} tons/cu yd = <span className="font-medium">{result.tons.toFixed(2)} tons</span></p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Density varies by moisture and compaction. Confirm with your supplier for large orders.</p>
        </div>
      )}
    </div>
  );
}
