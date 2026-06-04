import { useState } from 'react';
import ShapeInput from '../ui/ShapeInput';
import WasteSlider from '../ui/WasteSlider';
import { calcPaver } from '../../lib/engine/calculators';
import { PAVER_SIZES } from '../../lib/engine/constants';
import type { PaverSize } from '../../lib/engine/constants';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';

const SIZES = Object.entries(PAVER_SIZES) as [PaverSize, (typeof PAVER_SIZES)[PaverSize]][];

export default function PaverCalculator() {
  const [shape, setShape] = useState<EngineShape>({ type: 'rectangle', lengthFt: 0, widthFt: 0 });
  const [paverSize, setPaverSize] = useState<PaverSize>('12x12');
  const [waste, setWaste] = useState(0.10);
  const [pricePerPaver, setPricePerPaver] = useState('');

  const result = calcPaver(shape, paverSize, waste, pricePerPaver ? Number(pricePerPaver) : undefined);
  const hasArea = result.areaSqFt > 0;

  return (
    <div className="space-y-6">
      {/* Area */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Measure your patio or path area</h2>
        <ShapeInput onChange={setShape} />
      </div>

      {/* Paver size */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Select paver size</h2>
        <div className="flex flex-col gap-2">
          {SIZES.map(([key, val]) => (
            <button
              key={key}
              onClick={() => setPaverSize(key)}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors text-left ${
                paverSize === key
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'border-gray-300 text-gray-700 hover:border-brand-400'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Waste + price */}
      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">3. Waste &amp; price (optional)</h2>
        <WasteSlider value={waste} onChange={setWaste} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price per paver (optional)
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="number" min="0" step="0.01" placeholder="0.00"
              value={pricePerPaver}
              onChange={e => setPricePerPaver(e.target.value)}
              className="input-field pl-7"
            />
          </div>
        </div>
      </div>

      {/* Result */}
      {hasArea && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Paver Estimate</h2>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm text-brand-700">Pavers needed</p>
              <p className="text-2xl font-bold text-brand-900">{result.paversNeeded.toLocaleString()}</p>
              <p className="text-xs text-brand-600">incl. {Math.round(waste * 100)}% waste</p>
            </div>
            <div>
              <p className="text-sm text-brand-700">Area covered</p>
              <p className="text-2xl font-bold text-brand-900">{result.areaSqFt.toFixed(1)} sq ft</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm border-t border-brand-100 pt-3">
            <div>
              <p className="text-brand-600">Sand base (1" deep)</p>
              <p className="font-semibold text-brand-900">{result.sandCuYd.toFixed(2)} cu yd</p>
            </div>
            <div>
              <p className="text-brand-600">Gravel base (4" deep)</p>
              <p className="font-semibold text-brand-900">{result.gravelCuYd.toFixed(2)} cu yd</p>
            </div>
          </div>
          {result.costEstimate != null && (
            <div className="mt-3 pt-3 border-t border-brand-100">
              <p className="text-sm text-brand-600">Estimated paver cost</p>
              <p className="text-xl font-bold text-brand-900">${result.costEstimate.toFixed(2)}</p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-3">
            Also need: sand (use <a href="/calculator/sand" className="text-brand-600 hover:underline">Sand Calculator</a>)
            and gravel base (use <a href="/calculator/gravel" className="text-brand-600 hover:underline">Gravel Calculator</a>)
          </p>
        </div>
      )}
    </div>
  );
}
