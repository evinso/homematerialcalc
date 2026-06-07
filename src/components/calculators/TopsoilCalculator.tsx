import { useState } from 'react';
import ShapeInput from '../ui/ShapeInput';
import WasteSlider from '../ui/WasteSlider';
import { calcTopsoil } from '../../lib/engine/calculators';
import { TOPSOIL } from '../../lib/engine/constants';
import { useLocalStorage } from '../../lib/useLocalStorage';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';

const DEPTH_OPTIONS = [2, 4, 6, 8, 12];

export default function TopsoilCalculator() {
  const [shape, setShape] = useState<EngineShape>({ type: 'rectangle', lengthFt: 0, widthFt: 0 });
  const [depthIn, setDepthIn] = useLocalStorage('topsoil_depth', TOPSOIL.DEFAULT_DEPTH_IN);
  const [waste, setWaste] = useLocalStorage('topsoil_waste', TOPSOIL.DEFAULT_WASTE);
  const [pricePerCuYd, setPricePerCuYd] = useLocalStorage('topsoil_price', '');

  const result = calcTopsoil(shape, depthIn, waste, pricePerCuYd ? Number(pricePerCuYd) : undefined);
  const hasArea = result.areaSqFt > 0;

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Measure your area</h2>
        <ShapeInput onChange={setShape} />
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Choose depth</h2>
        <div className="flex flex-wrap gap-2">
          {DEPTH_OPTIONS.map(d => (
            <button key={d} onClick={() => setDepthIn(d)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                depthIn === d ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'
              }`}>
              {d}"
            </button>
          ))}
          <input type="number" min="1" max="24" step="0.5" value={depthIn}
            onChange={e => setDepthIn(Number(e.target.value))}
            className="input-field w-20 text-center" placeholder="in" />
        </div>
        <p className="text-xs text-gray-500 mt-2">2" top-dress · 4–6" new garden beds · 8–12" raised beds from scratch</p>
      </div>

      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">3. Adjust &amp; price (optional)</h2>
        <WasteSlider value={waste} onChange={setWaste} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per cubic yard (optional)</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={pricePerCuYd}
              onChange={e => setPricePerCuYd(e.target.value)} className="input-field pl-7" />
          </div>
        </div>
      </div>

      {hasArea && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Topsoil Estimate</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.volumeCuYdWithWaste.toFixed(2)}</p>
              <p className="text-xs text-gray-600 mt-1">cubic yards</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.bags40lb}</p>
              <p className="text-xs text-gray-600 mt-1">40 lb bags</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.tons.toFixed(2)}</p>
              <p className="text-xs text-gray-600 mt-1">tons</p>
            </div>
          </div>
          {result.costEstimate != null && (
            <div className="bg-brand-100 rounded-lg p-3 text-center mb-4">
              <p className="text-sm text-gray-600">Estimated cost (bulk)</p>
              <p className="text-2xl font-bold text-brand-800">${result.costEstimate.toFixed(2)}</p>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 text-sm space-y-1.5 text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">Calculation breakdown</p>
            <p>Area: <span className="font-medium">{result.areaSqFt.toFixed(1)} sq ft</span></p>
            <p>Volume: <span className="font-medium">{result.volumeCuFt.toFixed(2)} cu ft</span> ({result.volumeCuYd.toFixed(2)} cu yd)</p>
            <p>With {Math.round(waste * 100)}% waste: <span className="font-medium">{result.volumeCuYdWithWaste.toFixed(2)} cu yd</span></p>
            <p>40 lb bags: {(result.volumeCuYdWithWaste * 27).toFixed(2)} cu ft ÷ 0.75 = <span className="font-medium">{result.bags40lb} bags</span> (rounded up)</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Results are estimates. Confirm with your supplier for large orders.</p>
        </div>
      )}
    </div>
  );
}
