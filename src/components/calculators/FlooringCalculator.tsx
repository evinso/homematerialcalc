import { useState } from 'react';
import ShapeInput from '../ui/ShapeInput';
import { calcFlooring } from '../../lib/engine/calculators';
import { FLOORING } from '../../lib/engine/constants';
import type { FlooringPattern } from '../../lib/engine/constants';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';

const COMMON_BOX_COVERAGES = [
  { label: 'Enter manually', value: 0 },
  { label: 'Vinyl plank / LVP — 20 sq ft', value: 20 },
  { label: 'Vinyl plank / LVP — 23 sq ft', value: 23 },
  { label: 'Laminate — 20 sq ft', value: 20 },
  { label: 'Laminate — 25 sq ft', value: 25 },
  { label: 'Engineered hardwood — 15 sq ft', value: 15 },
];

const PATTERN_LABELS: Record<FlooringPattern, string> = {
  straight: 'Straight lay (+10% waste)',
  diagonal: 'Diagonal lay (+15% waste)',
  complex:  'Complex room / many cuts (+15% waste)',
};

export default function FlooringCalculator() {
  const [shape, setShape] = useState<EngineShape>({ type: 'rectangle', lengthFt: 0, widthFt: 0 });
  const [boxCoverage, setBoxCoverage] = useState(FLOORING.DEFAULT_BOX_COVERAGE_SQ_FT);
  const [pattern, setPattern] = useState<FlooringPattern>(FLOORING.DEFAULT_PATTERN);
  const [pricePerBox, setPricePerBox] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(1);

  const result = calcFlooring(shape, boxCoverage, pattern, pricePerBox ? Number(pricePerBox) : undefined);
  const hasArea = result.roomSqFt > 0;
  const wasteAmt = { straight: 10, diagonal: 15, complex: 15 }[pattern];

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Measure your room</h2>
        <ShapeInput onChange={setShape} />
      </div>

      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">2. Box coverage &amp; lay pattern</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Box coverage (from your product label)</label>
          <select
            value={selectedPreset}
            onChange={e => {
              const idx = Number(e.target.value);
              setSelectedPreset(idx);
              if (COMMON_BOX_COVERAGES[idx].value > 0) setBoxCoverage(COMMON_BOX_COVERAGES[idx].value);
            }}
            className="input-field mb-2"
          >
            {COMMON_BOX_COVERAGES.map((c, i) => (
              <option key={i} value={i}>{c.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input type="number" min="1" step="0.5" value={boxCoverage}
              onChange={e => { setBoxCoverage(Number(e.target.value)); setSelectedPreset(0); }}
              className="input-field w-28" />
            <span className="text-sm text-gray-600">sq ft per box</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Find this on the box label or product page.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lay pattern</label>
          <div className="space-y-2">
            {(Object.keys(PATTERN_LABELS) as FlooringPattern[]).map(p => (
              <button key={p} onClick={() => setPattern(p)}
                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${pattern === p ? 'bg-brand-50 border-brand-400 text-brand-800 font-medium' : 'border-gray-200 text-gray-700 hover:border-brand-300'}`}>
                {PATTERN_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per box (optional)</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={pricePerBox}
              onChange={e => setPricePerBox(e.target.value)} className="input-field pl-7" />
          </div>
        </div>
      </div>

      {hasArea && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Flooring Estimate</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{result.boxesNeeded}</p>
              <p className="text-sm text-gray-600 mt-1">boxes</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{result.areaWithWaste.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mt-1">sq ft (w/ waste)</p>
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
            <p>Room area: <span className="font-medium">{result.roomSqFt.toFixed(1)} sq ft</span></p>
            <p>With {wasteAmt}% waste ({pattern}): <span className="font-medium">{result.areaWithWaste.toFixed(1)} sq ft</span></p>
            <p>÷ {boxCoverage} sq ft/box = <span className="font-medium">{result.boxesNeeded} boxes</span> (rounded up)</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Always verify box coverage on your specific product label before ordering. Coverage can vary by manufacturer and product line.</p>
        </div>
      )}
    </div>
  );
}
