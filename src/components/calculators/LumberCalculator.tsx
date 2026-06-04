import { useState } from 'react';
import { calcLumber } from '../../lib/engine/calculators';
import { LUMBER_NOMINAL_SIZES } from '../../lib/engine/constants';
import type { LumberSize } from '../../lib/engine/constants';

const SIZES = Object.entries(LUMBER_NOMINAL_SIZES) as [LumberSize, (typeof LUMBER_NOMINAL_SIZES)[LumberSize]][];
const LENGTH_OPTIONS = [8, 10, 12, 16, 20];

export default function LumberCalculator() {
  const [pieces, setPieces] = useState(10);
  const [size, setSize] = useState<LumberSize>('2x4');
  const [lengthFt, setLengthFt] = useState(8);
  const [customLength, setCustomLength] = useState('');
  const [waste, setWaste] = useState(0.10);
  const [pricePerBf, setPricePerBf] = useState('');

  const effectiveLength = customLength ? Number(customLength) : lengthFt;
  const result = calcLumber(pieces, size, effectiveLength, waste, pricePerBf ? Number(pricePerBf) : undefined);
  const hasInput = pieces > 0 && effectiveLength > 0;

  return (
    <div className="space-y-6">
      {/* Pieces */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Number of pieces</h2>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max="9999"
            value={pieces}
            onChange={e => setPieces(Math.max(1, Number(e.target.value)))}
            className="input-field w-32 text-center text-lg"
          />
          <span className="text-sm text-gray-600">pieces of lumber</span>
        </div>
      </div>

      {/* Size */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Nominal size</h2>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSize(key)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                size === key
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'border-gray-300 text-gray-700 hover:border-brand-400'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Actual size for {LUMBER_NOMINAL_SIZES[size].label}: {LUMBER_NOMINAL_SIZES[size].thickness}" × {LUMBER_NOMINAL_SIZES[size].width}"
        </p>
      </div>

      {/* Length */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">3. Length per piece</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {LENGTH_OPTIONS.map(l => (
            <button
              key={l}
              onClick={() => { setLengthFt(l); setCustomLength(''); }}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                !customLength && lengthFt === l
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'border-gray-300 text-gray-700 hover:border-brand-400'
              }`}
            >
              {l} ft
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="40"
            step="0.5"
            value={customLength}
            onChange={e => setCustomLength(e.target.value)}
            className="input-field w-28 text-center"
            placeholder="Custom ft"
          />
          <span className="text-xs text-gray-500">custom length (ft)</span>
        </div>
      </div>

      {/* Waste + price */}
      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">4. Waste &amp; price (optional)</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Waste factor: {Math.round(waste * 100)}%
          </label>
          <input
            type="range" min="0" max="0.30" step="0.05"
            value={waste}
            onChange={e => setWaste(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-0.5">
            <span>0%</span><span>10% (recommended)</span><span>30%</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price per board foot (optional)
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="number" min="0" step="0.01" placeholder="0.00"
              value={pricePerBf}
              onChange={e => setPricePerBf(e.target.value)}
              className="input-field pl-7"
            />
          </div>
        </div>
      </div>

      {/* Result */}
      {hasInput && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Lumber Estimate</h2>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm text-brand-700">Board feet (with {Math.round(waste * 100)}% waste)</p>
              <p className="text-2xl font-bold text-brand-900">{result.boardFeetWithWaste.toFixed(1)} bf</p>
            </div>
            <div>
              <p className="text-sm text-brand-700">Pieces needed</p>
              <p className="text-2xl font-bold text-brand-900">{result.piecesNeeded}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm border-t border-brand-100 pt-3">
            <div>
              <p className="text-brand-600">Board feet (no waste)</p>
              <p className="font-semibold text-brand-900">{result.boardFeet.toFixed(1)} bf</p>
            </div>
            <div>
              <p className="text-brand-600">Nominal size</p>
              <p className="font-semibold text-brand-900">{LUMBER_NOMINAL_SIZES[size].label} × {effectiveLength} ft</p>
            </div>
          </div>
          {result.costEstimate != null && (
            <div className="mt-3 pt-3 border-t border-brand-100">
              <p className="text-sm text-brand-600">Estimated cost</p>
              <p className="text-xl font-bold text-brand-900">${result.costEstimate.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
