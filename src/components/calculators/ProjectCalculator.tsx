import { useState } from 'react';
import { useLocalStorage } from '../../lib/useLocalStorage';

type ProjectType = 'patio' | 'driveway' | 'raised-bed' | 'garden-path';

const PROJECTS: Record<ProjectType, { label: string; emoji: string; desc: string }> = {
  'patio':       { label: 'Paver Patio',      emoji: '🧱', desc: 'Gravel base + bedding sand + pavers + edge restraints' },
  'driveway':    { label: 'Gravel Driveway',  emoji: '🚗', desc: '3-layer gravel system (base + middle + surface)' },
  'raised-bed':  { label: 'Raised Garden Bed',emoji: '🌱', desc: 'Fill soil mix: topsoil + compost + perlite' },
  'garden-path': { label: 'Garden Path',      emoji: '🌿', desc: 'Landscape fabric + edging + pea gravel' },
};

function round2(n: number) { return Math.round(n * 100) / 100; }
function cuYd(sqFt: number, inDepth: number) { return round2(sqFt * inDepth / 324); }

export default function ProjectCalculator() {
  const [project, setProject] = useLocalStorage<ProjectType>('proj_type', 'patio');
  const [lengthFt, setLengthFt] = useLocalStorage('proj_length', 12);
  const [widthFt, setWidthFt]   = useLocalStorage('proj_width', 16);

  const area = lengthFt * widthFt;

  // ── Patio calcs ──
  const patioGravel = cuYd(area, 4);      // 4 in gravel base
  const patioSand   = cuYd(area, 1);      // 1 in bedding sand
  const paverSqFt   = area;
  const paverCount  = Math.ceil(area / 0.222 * 1.1); // 4×8 brick, 10% waste
  const edgeLnFt    = Math.ceil(2 * (lengthFt + widthFt) + 4);

  // ── Driveway calcs (3-layer: 4+2+2 in) ──
  const dwBase   = cuYd(area, 4);  // #2/#3 crushed stone
  const dwMiddle = cuYd(area, 2);  // #57 stone
  const dwSurface= cuYd(area, 2);  // crusher run / DGA
  const dwTotalTons = round2((dwBase + dwMiddle + dwSurface) * 1.4);

  // ── Raised bed calcs ──
  const bedDepthIn = 12;
  const totalCuFt  = round2(area * bedDepthIn / 12);
  const topsoilCuYd= round2(totalCuFt * 0.6 / 27);
  const compostCuYd= round2(totalCuFt * 0.3 / 27);
  const perliteCuYd= round2(totalCuFt * 0.1 / 27);
  const bags40lb   = Math.ceil(totalCuFt / 0.67);

  // ── Garden path calcs (3 ft wide default, use length only) ──
  const pathWidth   = 3;
  const pathArea    = pathWidth * lengthFt;
  const pathGravel  = cuYd(pathArea, 2);
  const pathEdgeLnFt= Math.ceil(2 * lengthFt + 2 * pathWidth + 4);

  return (
    <div className="space-y-6">

      {/* Project selector */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Choose your project</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {(Object.entries(PROJECTS) as [ProjectType, typeof PROJECTS[ProjectType]][]).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setProject(key)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${
                project === key
                  ? 'border-brand-500 bg-brand-50 text-brand-800'
                  : 'border-gray-200 hover:border-brand-300 text-gray-700'
              }`}
            >
              <span className="text-2xl">{p.emoji}</span>
              <div>
                <div className="font-semibold text-sm">{p.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">
          2. Enter dimensions
          {project === 'garden-path' && <span className="text-sm font-normal text-gray-500 ml-2">(length only — path width fixed at 3 ft)</span>}
        </h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">{project === 'garden-path' ? 'Path length (ft)' : 'Length (ft)'}</span>
            <input
              type="number" min="1" step="1" value={lengthFt}
              onChange={e => setLengthFt(Number(e.target.value))}
              className="input-field w-28"
            />
          </label>
          {project !== 'garden-path' && (
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">Width (ft)</span>
              <input
                type="number" min="1" step="1" value={widthFt}
                onChange={e => setWidthFt(Number(e.target.value))}
                className="input-field w-28"
              />
            </label>
          )}
        </div>
        {project !== 'garden-path' && (
          <p className="text-sm text-gray-500 mt-2">Total area: <strong>{area.toLocaleString()} sq ft</strong></p>
        )}
        {project === 'garden-path' && (
          <p className="text-sm text-gray-500 mt-2">Total path area: <strong>{pathArea} sq ft</strong></p>
        )}
      </div>

      {/* Results */}
      {project === 'patio' && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 mb-4 text-lg">🧱 Paver Patio — Full Materials List</h2>
          <div className="space-y-3">
            <MaterialRow label="Gravel base (4 in)" value={`${patioGravel} cu yd`} note="Compacted road base or #57 stone" />
            <MaterialRow label="Bedding sand (1 in)" value={`${patioSand} cu yd`} note="Coarse concrete sand — not play sand" />
            <MaterialRow label="Pavers (4×8 in standard)" value={`${paverCount.toLocaleString()} pieces`} note="Includes 10% waste for cuts" />
            <MaterialRow label="Edge restraints" value={`${edgeLnFt} linear ft`} note="Plastic or aluminum edging" />
            <MaterialRow label="Polymeric joint sand" value={`${Math.ceil(area / 80)} bags`} note="~80 sq ft coverage per bag" />
          </div>
          <div className="mt-4 pt-4 border-t border-brand-200 text-sm text-brand-700">
            <strong>Estimated material cost:</strong> ${(patioGravel * 35 + patioSand * 40 + paverCount * 0.65 + edgeLnFt * 0.70).toFixed(0)}–${(patioGravel * 55 + patioSand * 60 + paverCount * 1.20 + edgeLnFt * 1.20).toFixed(0)}
            <span className="text-xs text-brand-600 ml-1">(materials only, varies by region and paver type)</span>
          </div>
        </div>
      )}

      {project === 'driveway' && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 mb-4 text-lg">🚗 Gravel Driveway — 3-Layer Materials List</h2>
          <div className="space-y-3">
            <MaterialRow label="Base layer (4 in) — #2/#3 crushed stone" value={`${dwBase} cu yd`} note={`≈ ${round2(dwBase * 1.4)} tons`} />
            <MaterialRow label="Middle layer (2 in) — #57 stone" value={`${dwMiddle} cu yd`} note={`≈ ${round2(dwMiddle * 1.4)} tons`} />
            <MaterialRow label="Surface layer (2 in) — crusher run / DGA" value={`${dwSurface} cu yd`} note={`≈ ${round2(dwSurface * 1.4)} tons`} />
            <div className="border-t border-brand-200 pt-3">
              <MaterialRow label="Total gravel" value={`${round2(dwBase + dwMiddle + dwSurface)} cu yd`} note={`≈ ${dwTotalTons} tons total`} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-brand-200 text-sm text-brand-700">
            <strong>Estimated material cost:</strong> ${Math.round(dwTotalTons * 18)}–${Math.round(dwTotalTons * 32)}
            <span className="text-xs text-brand-600 ml-1">(materials only, $18–32/ton avg)</span>
          </div>
        </div>
      )}

      {project === 'raised-bed' && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 mb-4 text-lg">🌱 Raised Garden Bed — Soil Fill (12 in deep)</h2>
          <div className="space-y-3">
            <MaterialRow label="Total soil volume" value={`${totalCuFt} cu ft = ${round2(totalCuFt / 27)} cu yd`} note="" />
            <div className="border-t border-brand-200 pt-3">
              <p className="text-sm font-semibold text-brand-800 mb-2">Recommended mix:</p>
              <MaterialRow label="Topsoil (60%)" value={`${topsoilCuYd} cu yd`} note="Bulk or bagged" />
              <MaterialRow label="Compost (30%)" value={`${compostCuYd} cu yd`} note="Aged compost or mushroom compost" />
              <MaterialRow label="Perlite / coarse sand (10%)" value={`${perliteCuYd} cu yd`} note="Improves drainage" />
            </div>
            <div className="border-t border-brand-200 pt-3">
              <MaterialRow label="Bagged option (40 lb bags)" value={`${bags40lb} bags`} note="~0.67 cu ft per 40 lb bag" />
            </div>
          </div>
        </div>
      )}

      {project === 'garden-path' && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 mb-4 text-lg">🌿 Garden Path — Materials List (3 ft wide, 2 in pea gravel)</h2>
          <div className="space-y-3">
            <MaterialRow label="Landscape fabric" value={`${pathArea} sq ft`} note="Cut to size, overlap seams 6 in" />
            <MaterialRow label="Pea gravel (2 in deep)" value={`${pathGravel} cu yd`} note={`≈ ${Math.ceil(pathGravel * 27 / 0.5)} bags of 50 lb`} />
            <MaterialRow label="Plastic edging" value={`${pathEdgeLnFt} linear ft`} note="Both sides of path" />
          </div>
          <div className="mt-4 pt-4 border-t border-brand-200 text-sm text-brand-700">
            <strong>Estimated material cost:</strong> ${Math.round(pathArea * 0.06 + pathGravel * 35 + pathEdgeLnFt * 0.50)}–${Math.round(pathArea * 0.12 + pathGravel * 55 + pathEdgeLnFt * 0.80)}
          </div>
        </div>
      )}

    </div>
  );
}

function MaterialRow({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        {note && <div className="text-xs text-gray-500">{note}</div>}
      </div>
      <div className="text-sm font-bold text-brand-700 whitespace-nowrap">{value}</div>
    </div>
  );
}
