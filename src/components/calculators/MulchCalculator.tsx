import { useState, useEffect, useRef } from 'react';
import ShapeInput from '../ui/ShapeInput';
import WasteSlider from '../ui/WasteSlider';
import ShareButton from '../ui/ShareButton';
import UnitToggle, { mToFt } from '../ui/UnitToggle';
import { calcMulch } from '../../lib/engine/calculators';
import { MULCH } from '../../lib/engine/constants';
import { useLocalStorage } from '../../lib/useLocalStorage';
import { getUrlParam, setUrlParams } from '../../lib/useUrlParams';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';

const DEPTH_OPTIONS = [1, 2, 3, 4, 6];

export default function MulchCalculator() {
  const initL = Number(getUrlParam('l') ?? 0);
  const initW = Number(getUrlParam('w') ?? 0);
  const [metric, setMetric] = useLocalStorage('mulch_metric', false);

  const [shape, setShape] = useState<EngineShape>({ type: 'rectangle', lengthFt: initL, widthFt: initW });

  function handleMetricToggle(isMetric: boolean) {
    setMetric(isMetric);
  }
  const [depthIn, setDepthIn] = useLocalStorage('mulch_depth', Number(getUrlParam('d') ?? MULCH.DEFAULT_DEPTH_IN));
  const [waste, setWaste] = useLocalStorage('mulch_waste', Number(getUrlParam('waste') ?? MULCH.DEFAULT_WASTE));
  const [pricePerBag, setPricePerBag] = useLocalStorage('mulch_price', getUrlParam('price') ?? '');

  const result = calcMulch(shape, depthIn, waste, pricePerBag ? Number(pricePerBag) : undefined);
  const hasArea = result.areaSqFt > 0;

  // Sync current values to URL when result changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!hasArea) return;
    const s = shape as any;
    setUrlParams({
      l: s.lengthFt ?? 0,
      w: s.widthFt ?? 0,
      d: depthIn,
      waste,
      ...(pricePerBag ? { price: pricePerBag } : {}),
    });
  }, [shape, depthIn, waste, pricePerBag]);

  return (
    <div className="space-y-6">
      {/* Shape */}
      <div className="calculator-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">1. Measure your area</h2>
          <UnitToggle metric={metric} onToggle={handleMetricToggle} />
        </div>
        {metric && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
            Enter dimensions in meters — converted to feet automatically
          </p>
        )}
        <ShapeInput onChange={setShape} initLFt={initL} initWFt={initW} />
      </div>

      {/* Depth */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Choose depth</h2>
        <div className="flex flex-wrap gap-2">
          {DEPTH_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => setDepthIn(d)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                depthIn === d
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'border-gray-300 text-gray-700 hover:border-brand-400'
              }`}
            >
              {d}"
            </button>
          ))}
          <input
            type="number" min="1" max="12" step="0.5"
            value={depthIn}
            onChange={e => setDepthIn(Number(e.target.value))}
            className="input-field w-20 text-center"
            placeholder="in"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          2–3" for existing beds · 3–4" for new beds · 1–2" for top-dress
        </p>
      </div>

      {/* Waste + cost */}
      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">3. Adjust &amp; price (optional)</h2>
        <WasteSlider value={waste} onChange={setWaste} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price per 2 cu ft bag (optional)
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="number" min="0" step="0.01" placeholder="0.00"
              value={pricePerBag}
              onChange={e => setPricePerBag(e.target.value)}
              className="input-field pl-7"
            />
          </div>
        </div>
      </div>

      {/* Result */}
      {hasArea && (
        <div className="result-box">
          <div className="flex items-start justify-between mb-3 gap-3">
            <h2 className="font-bold text-brand-800 text-lg">Your Mulch Estimate</h2>
            <ShareButton />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{result.bagsNeeded}</p>
              <p className="text-sm text-gray-600 mt-1">2 cu ft bags</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{result.volumeCuYdWithWaste.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">cubic yards (bulk)</p>
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
            <p>Bags: {result.volumeCuYdWithWaste.toFixed(2)} cu yd × 13.5 bags/cu yd = <span className="font-medium">{result.bagsNeeded} bags</span> (rounded up)</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Results are estimates. Confirm quantities with your supplier — actual coverage varies by material moisture and ground unevenness.
          </p>
        </div>
      )}
    </div>
  );
}
