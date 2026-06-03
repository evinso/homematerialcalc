import { useState } from 'react';
import WasteSlider from '../ui/WasteSlider';
import { calcPaint } from '../../lib/engine/calculators';
import { PAINT, PAINT_COVERAGE } from '../../lib/engine/constants';
import type { PaintSurface } from '../../lib/engine/constants';

const SURFACE_LABELS: Record<PaintSurface, string> = {
  standard: 'Standard interior (350 sq ft/gal)',
  premium:  'Premium / self-priming (400 sq ft/gal)',
  primer:   'Primer (250 sq ft/gal)',
  textured: 'Textured / rough surface (275 sq ft/gal)',
};

export default function PaintCalculator() {
  const [mode, setMode] = useState<'room' | 'area'>('room');
  const [length, setLength] = useState(12);
  const [width, setWidth]   = useState(12);
  const [height, setHeight] = useState(8);
  const [wallArea, setWallArea] = useState(400);
  const [doors, setDoors]       = useState(1);
  const [windows, setWindows]   = useState(2);
  const [coats, setCoats]       = useState(PAINT.DEFAULT_COATS);
  const [surface, setSurface]   = useState<PaintSurface>(PAINT.DEFAULT_SURFACE);
  const [waste, setWaste]       = useState(PAINT.DEFAULT_WASTE);
  const [pricePerGallon, setPricePerGallon] = useState('');

  const roomWallArea = mode === 'room' ? 2 * (length + width) * height : wallArea;
  const result = calcPaint(roomWallArea, doors, windows, coats, surface, waste,
    pricePerGallon ? Number(pricePerGallon) : undefined);
  const hasArea = roomWallArea > 0;

  return (
    <div className="space-y-6">
      {/* Input mode */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">1. Enter wall area</h2>
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
          {(['room','area'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === m ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-600'}`}>
              {m === 'room' ? 'Room dimensions' : 'Total wall area'}
            </button>
          ))}
        </div>

        {mode === 'room' ? (
          <div className="grid grid-cols-3 gap-3">
            {[['Length (ft)', length, setLength], ['Width (ft)', width, setWidth], ['Ceiling height (ft)', height, setHeight]].map(([label, val, set]) => (
              <div key={label as string}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label as string}</label>
                <input type="number" min="0" step="0.5" value={val as number}
                  onChange={e => (set as (v: number) => void)(Number(e.target.value))}
                  className="input-field" />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total wall area (sq ft)</label>
            <input type="number" min="0" step="1" value={wallArea}
              onChange={e => setWallArea(Number(e.target.value))} className="input-field" />
            <p className="text-xs text-gray-500 mt-1">Measure each wall: length × height, then add together.</p>
          </div>
        )}

        {mode === 'room' && (
          <p className="text-xs text-gray-500 mt-3">
            Wall area: <strong>{(2*(length+width)*height).toFixed(0)} sq ft</strong>
            {' '}(perimeter {2*(length+width)} ft × {height} ft ceiling)
          </p>
        )}
      </div>

      {/* Openings */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Openings to subtract</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doors</label>
            <input type="number" min="0" step="1" value={doors}
              onChange={e => setDoors(Number(e.target.value))} className="input-field" />
            <p className="text-xs text-gray-500 mt-0.5">21 sq ft each (standard 3×7)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Windows</label>
            <input type="number" min="0" step="1" value={windows}
              onChange={e => setWindows(Number(e.target.value))} className="input-field" />
            <p className="text-xs text-gray-500 mt-0.5">15 sq ft each (standard 3×5)</p>
          </div>
        </div>
      </div>

      {/* Paint options */}
      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">3. Paint type, coats &amp; price</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paint type / coverage</label>
          <select value={surface} onChange={e => setSurface(e.target.value as PaintSurface)} className="input-field">
            {(Object.keys(SURFACE_LABELS) as PaintSurface[]).map(k => (
              <option key={k} value={k}>{SURFACE_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of coats</label>
          <div className="flex gap-2">
            {[1,2,3].map(n => (
              <button key={n} onClick={() => setCoats(n)}
                className={`px-6 py-2 rounded-lg border text-sm font-medium transition-colors ${coats === n ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'}`}>
                {n} coat{n > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
        <WasteSlider value={waste} onChange={setWaste} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per gallon (optional)</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={pricePerGallon}
              onChange={e => setPricePerGallon(e.target.value)} className="input-field pl-7" />
          </div>
        </div>
      </div>

      {/* Result */}
      {hasArea && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Paint Estimate</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{result.gallonsNeeded}</p>
              <p className="text-sm text-gray-600 mt-1">gallons</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{result.quartsNeeded}</p>
              <p className="text-sm text-gray-600 mt-1">quarts total</p>
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
            <p>Gross wall area: <span className="font-medium">{result.grossWallArea.toFixed(0)} sq ft</span></p>
            <p>Openings subtracted: <span className="font-medium">{result.openingArea.toFixed(0)} sq ft</span></p>
            <p>Net wall area: <span className="font-medium">{result.netWallArea.toFixed(0)} sq ft</span> × {coats} coat{coats>1?'s':''}</p>
            <p>With {Math.round(waste*100)}% waste: <span className="font-medium">{result.netWithWaste.toFixed(0)} sq ft</span></p>
            <p>÷ {PAINT_COVERAGE[surface]} sq ft/gal = <span className="font-medium">{result.gallonsNeeded} gallons</span></p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Coverage varies by paint brand, surface porosity, and application method. Buy a test quart first for new colors.</p>
        </div>
      )}
    </div>
  );
}
