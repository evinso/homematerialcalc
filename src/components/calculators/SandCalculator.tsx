import { useState } from 'react';
import ShapeInput from '../ui/ShapeInput';
import WasteSlider from '../ui/WasteSlider';
import { calcSand } from '../../lib/engine/calculators';
import { SAND, SAND_DENSITIES } from '../../lib/engine/constants';
import { useLocalStorage } from '../../lib/useLocalStorage';
import type { SandType } from '../../lib/engine/constants';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';

const SAND_LABELS: Record<SandType, string> = {
  'all-purpose': 'All-Purpose / Fill Sand',
  'paver':       'Paver / Leveling Sand',
  'play':        'Play Sand',
  'mason':       'Mason Sand',
};

const DEPTH_OPTIONS = [1, 2, 3, 4, 6];

export default function SandCalculator() {
  const [shape, setShape] = useState<EngineShape>({ type: 'rectangle', lengthFt: 0, widthFt: 0 });
  const [depthIn, setDepthIn] = useLocalStorage('sand_depth', SAND.DEFAULT_DEPTH_IN);
  const [sandType, setSandType] = useLocalStorage<SandType>('sand_type', SAND.DEFAULT_TYPE);
  const [waste, setWaste] = useLocalStorage('sand_waste', SAND.DEFAULT_WASTE);
  const [pricePerTon, setPricePerTon] = useLocalStorage('sand_price', '');

  const result = calcSand(shape, depthIn, sandType, waste, pricePerTon ? Number(pricePerTon) : undefined);
  const hasArea = result.areaSqFt > 0;

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Measure your area</h2>
        <ShapeInput onChange={setShape} />
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Sand type &amp; depth</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sand type</label>
          <select value={sandType} onChange={e => setSandType(e.target.value as SandType)} className="input-field">
            {(Object.keys(SAND_LABELS) as SandType[]).map(k => (
              <option key={k} value={k}>{SAND_LABELS[k]} — {SAND_DENSITIES[k].tons} tons/cu yd</option>
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
          <p className="text-xs text-gray-500 mt-2">1" paver base · 2–4" sandbox or fill</p>
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
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Sand Estimate</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.tons.toFixed(2)}</p>
              <p className="text-xs text-gray-600 mt-1">tons</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.volumeCuYdWithWaste.toFixed(2)}</p>
              <p className="text-xs text-gray-600 mt-1">cubic yards</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.bags50lb}</p>
              <p className="text-xs text-gray-600 mt-1">50 lb bags</p>
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
            <p>Weight: {result.volumeCuYdWithWaste.toFixed(2)} × {SAND_DENSITIES[sandType].tons} t/cu yd = <span className="font-medium">{result.tons.toFixed(2)} tons</span></p>
            <p>50 lb bags: {(result.volumeCuYdWithWaste * 27).toFixed(2)} cu ft ÷ 0.50 = <span className="font-medium">{result.bags50lb} bags</span></p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Results are estimates. Confirm with your supplier for large orders.</p>
        </div>
      )}
    </div>
  );
}
