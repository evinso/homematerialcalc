import { useState } from 'react';
import ShapeInput from '../ui/ShapeInput';
import { calcSod } from '../../lib/engine/calculators';
import { SOD } from '../../lib/engine/constants';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';

export default function SodCalculator() {
  const [shape, setShape] = useState<EngineShape>({ type: 'rectangle', lengthFt: 0, widthFt: 0 });
  const [irregular, setIrregular] = useState(false);
  const [pricePerPallet, setPricePerPallet] = useState('');

  const result = calcSod(shape, irregular, pricePerPallet ? Number(pricePerPallet) : undefined);
  const hasArea = result.areaSqFt > 0;
  const wastePct = irregular ? SOD.DEFAULT_WASTE_IRREGULAR : SOD.DEFAULT_WASTE_STRAIGHT;

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Measure your lawn area</h2>
        <ShapeInput onChange={setShape} />
        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" id="irregular" checked={irregular}
            onChange={e => setIrregular(e.target.checked)}
            className="w-4 h-4 accent-brand-600" />
          <label htmlFor="irregular" className="text-sm text-gray-700">
            Curved or irregular edges (uses 10% waste instead of 5%)
          </label>
        </div>
      </div>

      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">2. Price (optional)</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per pallet (optional)</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={pricePerPallet}
              onChange={e => setPricePerPallet(e.target.value)} className="input-field pl-7" />
          </div>
          <p className="text-xs text-gray-500 mt-1">1 pallet covers approx. 450 sq ft</p>
        </div>
      </div>

      {hasArea && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Sod Estimate</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.palletsRoundedUp}</p>
              <p className="text-xs text-gray-600 mt-1">pallets</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.pieces}</p>
              <p className="text-xs text-gray-600 mt-1">pieces</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.areaWithWaste.toFixed(0)}</p>
              <p className="text-xs text-gray-600 mt-1">sq ft (w/ waste)</p>
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
            <p>Waste factor: <span className="font-medium">{Math.round(wastePct * 100)}%</span> ({irregular ? 'curved/irregular' : 'straight edges'})</p>
            <p>Area with waste: <span className="font-medium">{result.areaWithWaste.toFixed(1)} sq ft</span></p>
            <p>Pallets: {result.areaWithWaste.toFixed(1)} ÷ 450 sq ft/pallet = <span className="font-medium">{result.palletsRoundedUp} pallets</span> (rounded up)</p>
            <p>Pieces: {result.areaWithWaste.toFixed(1)} ÷ 2.67 sq ft/piece = <span className="font-medium">{result.pieces} pieces</span></p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Pallet coverage varies by supplier (450 sq ft is the standard). Confirm before ordering.</p>
        </div>
      )}
    </div>
  );
}
