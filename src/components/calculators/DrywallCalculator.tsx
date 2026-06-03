import { useState } from 'react';
import WasteSlider from '../ui/WasteSlider';
import { calcDrywall } from '../../lib/engine/calculators';
import { DRYWALL, DRYWALL_SHEETS } from '../../lib/engine/constants';
import type { DrywallSheet } from '../../lib/engine/constants';

export default function DrywallCalculator() {
  const [mode, setMode]       = useState<'room' | 'area'>('room');
  const [length, setLength]   = useState(12);
  const [width, setWidth]     = useState(12);
  const [height, setHeight]   = useState(8);
  const [wallArea, setWallArea] = useState(400);
  const [doors, setDoors]       = useState(1);
  const [windows, setWindows]   = useState(2);
  const [sheetSize, setSheetSize] = useState<DrywallSheet>(DRYWALL.DEFAULT_SHEET);
  const [waste, setWaste]       = useState(DRYWALL.DEFAULT_WASTE);
  const [pricePerSheet, setPricePerSheet] = useState('');

  const roomWallArea = mode === 'room' ? 2 * (length + width) * height : wallArea;
  const result = calcDrywall(roomWallArea, doors, windows, sheetSize, waste,
    pricePerSheet ? Number(pricePerSheet) : undefined);
  const hasArea = roomWallArea > 0;

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">1. Wall area</h2>
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
                  onChange={e => (set as (v: number) => void)(Number(e.target.value))} className="input-field" />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total wall area (sq ft)</label>
            <input type="number" min="0" step="1" value={wallArea}
              onChange={e => setWallArea(Number(e.target.value))} className="input-field" />
          </div>
        )}
        {mode === 'room' && (
          <p className="text-xs text-gray-500 mt-2">
            Wall area: <strong>{(2*(length+width)*height).toFixed(0)} sq ft</strong>
          </p>
        )}
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Openings to subtract</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doors</label>
            <input type="number" min="0" step="1" value={doors}
              onChange={e => setDoors(Number(e.target.value))} className="input-field" />
            <p className="text-xs text-gray-500 mt-0.5">21 sq ft each</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Windows</label>
            <input type="number" min="0" step="1" value={windows}
              onChange={e => setWindows(Number(e.target.value))} className="input-field" />
            <p className="text-xs text-gray-500 mt-0.5">15 sq ft each</p>
          </div>
        </div>
      </div>

      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">3. Sheet size, waste &amp; price</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sheet size</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(DRYWALL_SHEETS) as DrywallSheet[]).map(s => (
              <button key={s} onClick={() => setSheetSize(s)}
                className={`py-2.5 px-2 rounded-lg border text-sm font-medium transition-colors ${sheetSize === s ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'}`}>
                {DRYWALL_SHEETS[s].label}
              </button>
            ))}
          </div>
        </div>
        <WasteSlider value={waste} onChange={setWaste} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per sheet (optional)</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={pricePerSheet}
              onChange={e => setPricePerSheet(e.target.value)} className="input-field pl-7" />
          </div>
        </div>
      </div>

      {hasArea && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Drywall Estimate</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.sheetsNeeded}</p>
              <p className="text-xs text-gray-600 mt-1">sheets</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.jointCompoundGallons}</p>
              <p className="text-xs text-gray-600 mt-1">joint compound (gal)</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.tapeRolls}</p>
              <p className="text-xs text-gray-600 mt-1">tape rolls (75 ft)</p>
            </div>
          </div>
          {result.costEstimate != null && (
            <div className="bg-brand-100 rounded-lg p-3 text-center mb-4">
              <p className="text-sm text-gray-600">Sheet cost estimate</p>
              <p className="text-2xl font-bold text-brand-800">${result.costEstimate.toFixed(2)}</p>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 text-sm space-y-1.5 text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">Calculation breakdown</p>
            <p>Gross wall area: <span className="font-medium">{result.grossWallArea.toFixed(0)} sq ft</span></p>
            <p>Openings: <span className="font-medium">−{result.openingArea.toFixed(0)} sq ft</span></p>
            <p>Net area: <span className="font-medium">{result.netWallArea.toFixed(0)} sq ft</span></p>
            <p>With {Math.round(waste*100)}% waste: <span className="font-medium">{result.areaWithWaste.toFixed(0)} sq ft</span></p>
            <p>Sheets: {result.areaWithWaste.toFixed(0)} ÷ {DRYWALL_SHEETS[sheetSize].sqFt} sq ft/sheet = <span className="font-medium">{result.sheetsNeeded} sheets</span></p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Joint compound and tape estimates cover 3 coats. Actual usage varies with experience level and application method.</p>
        </div>
      )}
    </div>
  );
}
