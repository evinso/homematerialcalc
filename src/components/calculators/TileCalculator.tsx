import { useState } from 'react';
import ShapeInput from '../ui/ShapeInput';
import { calcTile } from '../../lib/engine/calculators';
import { TILE, TILE_SIZES } from '../../lib/engine/constants';
import type { TileSize } from '../../lib/engine/constants';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';

export default function TileCalculator() {
  const [shape, setShape]       = useState<EngineShape>({ type: 'rectangle', lengthFt: 0, widthFt: 0 });
  const [tileSize, setTileSize] = useState<TileSize>(TILE.DEFAULT_SIZE);
  const [diagonal, setDiagonal] = useState(false);
  const [pricePerTile, setPricePerTile] = useState('');

  const result = calcTile(shape, tileSize, diagonal, pricePerTile ? Number(pricePerTile) : undefined);
  const hasArea = result.areaSqFt > 0;
  const wasteAmt = diagonal ? 15 : 10;

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Measure your area</h2>
        <ShapeInput onChange={setShape} />
      </div>

      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">2. Tile size &amp; lay pattern</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tile size</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(TILE_SIZES) as TileSize[]).map(size => (
              <button key={size} onClick={() => setTileSize(size)}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium text-left transition-colors ${tileSize === size ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'}`}>
                {TILE_SIZES[size].label}
                <span className={`block text-xs mt-0.5 ${tileSize === size ? 'text-brand-100' : 'text-gray-400'}`}>
                  {TILE_SIZES[size].sqFt} sq ft/tile
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="diagonal" checked={diagonal}
            onChange={e => setDiagonal(e.target.checked)} className="w-4 h-4 accent-brand-600" />
          <label htmlFor="diagonal" className="text-sm text-gray-700">
            Diagonal / pattern lay (+15% waste instead of 10%)
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per tile (optional)</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={pricePerTile}
              onChange={e => setPricePerTile(e.target.value)} className="input-field pl-7" />
          </div>
        </div>
      </div>

      {hasArea && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Tile Estimate</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.tilesNeeded}</p>
              <p className="text-xs text-gray-600 mt-1">tiles</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.thinset50lbBags}</p>
              <p className="text-xs text-gray-600 mt-1">thinset bags (50 lb)</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{result.grout10lbBags}</p>
              <p className="text-xs text-gray-600 mt-1">grout bags (10 lb)</p>
            </div>
          </div>
          {result.costEstimate != null && (
            <div className="bg-brand-100 rounded-lg p-3 text-center mb-4">
              <p className="text-sm text-gray-600">Tile cost estimate</p>
              <p className="text-2xl font-bold text-brand-800">${result.costEstimate.toFixed(2)}</p>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 text-sm space-y-1.5 text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">Calculation breakdown</p>
            <p>Area: <span className="font-medium">{result.areaSqFt.toFixed(1)} sq ft</span></p>
            <p>With {wasteAmt}% waste: <span className="font-medium">{result.areaWithWaste.toFixed(1)} sq ft</span></p>
            <p>Tiles: {result.areaWithWaste.toFixed(1)} ÷ {TILE_SIZES[tileSize].sqFt} sq ft/tile = <span className="font-medium">{result.tilesNeeded} tiles</span></p>
            <p>Thinset: {result.areaWithWaste.toFixed(1)} ÷ 40 sq ft/bag = <span className="font-medium">{result.thinset50lbBags} bags</span></p>
            <p>Grout: {result.areaWithWaste.toFixed(1)} ÷ 50 sq ft/bag = <span className="font-medium">{result.grout10lbBags} bags</span> (est., 1/8" joint)</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Grout coverage varies significantly by tile size and joint width. Thinset coverage assumes a 3/8" notched trowel.</p>
        </div>
      )}
    </div>
  );
}
