import { useState, useEffect, useRef } from 'react';
import ShareButton from '../ui/ShareButton';
import { useLocalStorage } from '../../lib/useLocalStorage';
import { getUrlParam, setUrlParams } from '../../lib/useUrlParams';

type InsulationType = 'batt-fiberglass' | 'batt-rockwool' | 'blown-fiberglass' | 'blown-cellulose' | 'spray-foam';
type Location = 'attic' | 'wall' | 'crawlspace' | 'basement';

const TYPE_LABELS: Record<InsulationType, string> = {
  'batt-fiberglass':  'Fiberglass batts (rolls)',
  'batt-rockwool':    'Mineral wool / rock wool batts',
  'blown-fiberglass': 'Blown-in fiberglass (loose fill)',
  'blown-cellulose':  'Blown-in cellulose (loose fill)',
  'spray-foam':       'Spray foam (professional)',
};

// R-value per inch for each type
const R_PER_INCH: Record<InsulationType, number> = {
  'batt-fiberglass':  3.2,
  'batt-rockwool':    3.8,
  'blown-fiberglass': 2.7,
  'blown-cellulose':  3.6,
  'spray-foam':       6.5,
};

// Recommended total R-value by location (zone 4-5 US average)
const RECOMMENDED_R: Record<Location, number> = {
  attic: 49, wall: 21, crawlspace: 19, basement: 15,
};

// Coverage per bag (blown) or sq ft per roll (batts)
// Batts: 1 bag = ~40 sq ft at 3.5 in (R-13); blown: 1 bag = varies
const BAGS_LABEL: Record<InsulationType, string> = {
  'batt-fiberglass':  'rolls / packages',
  'batt-rockwool':    'packages',
  'blown-fiberglass': 'bags (25 lb)',
  'blown-cellulose':  'bags (30 lb)',
  'spray-foam':       'board-feet (pro install)',
};

const COVERAGE_PER_UNIT: Record<InsulationType, number> = {
  'batt-fiberglass':  40,   // sq ft per roll (R-13)
  'batt-rockwool':    40,
  'blown-fiberglass': 25,   // sq ft per bag at recommended depth
  'blown-cellulose':  30,
  'spray-foam':       1,    // 1 board-ft per board-ft (linear)
};

export default function InsulationCalculator() {
  const [areaSqFt, setAreaSqFt] = useLocalStorage('ins_area', Number(getUrlParam('area') ?? 800));
  const [insType, setInsType] = useLocalStorage<InsulationType>('ins_type', (getUrlParam('t') as InsulationType | null) ?? 'blown-cellulose');
  const [location, setLocation] = useLocalStorage<Location>('ins_loc', (getUrlParam('loc') as Location | null) ?? 'attic');
  const [targetR, setTargetR] = useState(RECOMMENDED_R[location]);

  useEffect(() => { setTargetR(RECOMMENDED_R[location]); }, [location]);

  const rPerInch = R_PER_INCH[insType];
  const inchesNeeded = targetR / rPerInch;
  const coveragePerUnit = COVERAGE_PER_UNIT[insType];
  const unitsNeeded = insType === 'spray-foam'
    ? Math.ceil(areaSqFt * inchesNeeded)
    : Math.ceil((areaSqFt / coveragePerUnit) * 1.1);

  const hasInput = areaSqFt > 0;

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!hasInput) return;
    setUrlParams({ area: areaSqFt, t: insType, loc: location });
  }, [areaSqFt, insType, location]);

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Area to insulate</h2>
        <label className="flex flex-col gap-1 max-w-xs">
          <span className="text-sm text-gray-600">Square footage</span>
          <input type="number" min="0" step="10" value={areaSqFt}
            onChange={e => setAreaSqFt(Number(e.target.value))} className="input-field" />
        </label>
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Location</h2>
        <div className="grid grid-cols-2 gap-2">
          {(['attic','wall','crawlspace','basement'] as Location[]).map(loc => (
            <button key={loc} onClick={() => setLocation(loc)}
              className={`py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                location === loc ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-gray-200 text-gray-700 hover:border-brand-300'
              }`}>
              {loc} <span className="text-xs font-normal">(R-{RECOMMENDED_R[loc]})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">3. Insulation type</h2>
        <select value={insType} onChange={e => setInsType(e.target.value as InsulationType)} className="input-field">
          {(Object.keys(TYPE_LABELS) as InsulationType[]).map(k => (
            <option key={k} value={k}>{TYPE_LABELS[k]} — R-{R_PER_INCH[k]}/inch</option>
          ))}
        </select>
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm text-gray-600 whitespace-nowrap">Target R-value:</label>
          <input type="number" min="1" max="100" step="1" value={targetR}
            onChange={e => setTargetR(Number(e.target.value))}
            className="input-field w-24 text-center" />
          <span className="text-xs text-gray-400">(recommended: R-{RECOMMENDED_R[location]})</span>
        </div>
      </div>

      {hasInput && (
        <div className="result-box">
          <div className="flex items-start justify-between mb-3 gap-3">
            <h2 className="font-bold text-brand-800 text-lg">Your Insulation Estimate</h2>
            <ShareButton />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{unitsNeeded}</p>
              <p className="text-sm text-gray-600 mt-1">{BAGS_LABEL[insType]}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{inchesNeeded.toFixed(1)}"</p>
              <p className="text-sm text-gray-600 mt-1">depth needed</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-sm space-y-1.5 text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">Calculation breakdown</p>
            <p>Area: <span className="font-medium">{areaSqFt.toLocaleString()} sq ft</span></p>
            <p>Target R-value: <span className="font-medium">R-{targetR}</span></p>
            <p>R per inch ({TYPE_LABELS[insType].split(' ')[0]}): <span className="font-medium">{rPerInch}</span></p>
            <p>Depth needed: R-{targetR} ÷ {rPerInch}/inch = <span className="font-medium">{inchesNeeded.toFixed(1)} inches</span></p>
            {insType !== 'spray-foam' && <p>Units: {areaSqFt} sq ft ÷ {coveragePerUnit} sq ft/unit × 1.10 = <span className="font-medium">{unitsNeeded} {BAGS_LABEL[insType]}</span></p>}
          </div>
        </div>
      )}
    </div>
  );
}
