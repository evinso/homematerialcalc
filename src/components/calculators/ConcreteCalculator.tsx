import { useState } from 'react';
import ShapeInput from '../ui/ShapeInput';
import WasteSlider from '../ui/WasteSlider';
import { calcConcrete } from '../../lib/engine/calculators';
import { CONCRETE, CONCRETE_BAGS } from '../../lib/engine/constants';
import { useLocalStorage } from '../../lib/useLocalStorage';
import type { ConcreteBagSize } from '../../lib/engine/constants';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';

type ProjectType = 'slab' | 'post-hole' | 'footing';

const POST_HOLE_DIAMETERS = [4, 6, 8, 10, 12]; // inches → radius in ft = d/24
const POST_HOLE_DEPTHS    = [24, 36, 42, 48];  // inches

const BAG_SIZES = [40, 50, 60, 80] as ConcreteBagSize[];

export default function ConcreteCalculator() {
  const [projectType, setProjectType] = useState<ProjectType>('slab');
  const [shape, setShape] = useState<EngineShape>({ type: 'rectangle', lengthFt: 0, widthFt: 0 });
  const [thicknessIn, setThicknessIn] = useLocalStorage('concrete_thickness', CONCRETE.DEFAULT_THICKNESS_IN);
  const [bagSize, setBagSize] = useLocalStorage<ConcreteBagSize>('concrete_bag', CONCRETE.DEFAULT_BAG_SIZE);
  const [waste, setWaste] = useLocalStorage('concrete_waste', CONCRETE.DEFAULT_WASTE);
  const [pricePerBag, setPricePerBag] = useLocalStorage('concrete_price', '');

  // Post hole state
  const [holeDiameterIn, setHoleDiameterIn] = useState(6);
  const [holeDepthIn, setHoleDepthIn] = useState(36);
  const [holeCount, setHoleCount] = useState(1);

  const postHoleShape: EngineShape = {
    type: 'circle',
    radiusFt: holeDiameterIn / 24, // diameter in → radius in ft
  };

  const activeShape = projectType === 'post-hole' ? postHoleShape : shape;
  const activeDepth = projectType === 'post-hole' ? holeDepthIn : thicknessIn;

  const singleResult = calcConcrete(activeShape, activeDepth, bagSize, waste, pricePerBag ? Number(pricePerBag) : undefined);
  const totalBags = projectType === 'post-hole' ? singleResult.bagsNeeded * holeCount : singleResult.bagsNeeded;
  const totalCost = pricePerBag ? totalBags * Number(pricePerBag) : undefined;
  const hasVolume = singleResult.volumeCuFt > 0;

  return (
    <div className="space-y-6">
      {/* Project type */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">1. Project type</h2>
        <div className="grid grid-cols-3 gap-2">
          {([['slab','Slab / Pad'],['post-hole','Post Holes'],['footing','Footing']] as [ProjectType, string][]).map(([t, label]) => (
            <button key={t} onClick={() => setProjectType(t)}
              className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                projectType === t ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">2. Dimensions</h2>
        {projectType === 'post-hole' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hole diameter</label>
              <div className="flex flex-wrap gap-2">
                {POST_HOLE_DIAMETERS.map(d => (
                  <button key={d} onClick={() => setHoleDiameterIn(d)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      holeDiameterIn === d ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'
                    }`}>
                    {d}"
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hole depth</label>
              <div className="flex flex-wrap gap-2">
                {POST_HOLE_DEPTHS.map(d => (
                  <button key={d} onClick={() => setHoleDepthIn(d)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      holeDepthIn === d ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'
                    }`}>
                    {d}"
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of holes</label>
              <input type="number" min="1" step="1" value={holeCount}
                onChange={e => setHoleCount(Math.max(1, Number(e.target.value)))}
                className="input-field w-24" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ShapeInput onChange={setShape} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {projectType === 'slab' ? 'Thickness' : 'Depth'}
              </label>
              <div className="flex flex-wrap gap-2">
                {[2,3,4,6,8].map(d => (
                  <button key={d} onClick={() => setThicknessIn(d)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      thicknessIn === d ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'
                    }`}>
                    {d}"
                  </button>
                ))}
                <input type="number" min="1" max="24" step="0.5" value={thicknessIn}
                  onChange={e => setThicknessIn(Number(e.target.value))}
                  className="input-field w-20 text-center" placeholder="in" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Standard slab: 4" · Driveway: 6" · Walkway: 3–4"</p>
            </div>
          </div>
        )}
      </div>

      {/* Bag size + waste + cost */}
      <div className="calculator-card space-y-4">
        <h2 className="font-semibold text-gray-900">3. Bag size, waste &amp; price</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bag size</label>
          <div className="flex gap-2">
            {BAG_SIZES.map(sz => (
              <button key={sz} onClick={() => setBagSize(sz)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  bagSize === sz ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-700 hover:border-brand-400'
                }`}>
                {sz} lb<br/>
                <span className="text-xs opacity-75">{CONCRETE_BAGS[sz].yield_cu_ft} cu ft</span>
              </button>
            ))}
          </div>
        </div>
        <WasteSlider value={waste} onChange={setWaste} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per bag (optional)</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={pricePerBag}
              onChange={e => setPricePerBag(e.target.value)} className="input-field pl-7" />
          </div>
        </div>
      </div>

      {/* Result */}
      {hasVolume && (
        <div className="result-box">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Your Concrete Estimate</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{totalBags}</p>
              <p className="text-sm text-gray-600 mt-1">{bagSize} lb bags{holeCount > 1 ? ` (${holeCount} holes)` : ''}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-brand-700">
                {projectType === 'post-hole'
                  ? (singleResult.volumeCuYd * holeCount).toFixed(3)
                  : singleResult.volumeCuYd.toFixed(3)}
              </p>
              <p className="text-sm text-gray-600 mt-1">cubic yards</p>
            </div>
          </div>
          {totalCost != null && (
            <div className="bg-brand-100 rounded-lg p-3 text-center mb-4">
              <p className="text-sm text-gray-600">Estimated cost</p>
              <p className="text-2xl font-bold text-brand-800">${totalCost.toFixed(2)}</p>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 text-sm space-y-1.5 text-gray-700">
            <p className="font-semibold text-gray-900 mb-2">Calculation breakdown</p>
            {projectType === 'post-hole' ? (
              <>
                <p>Hole volume: π × ({holeDiameterIn/2}")² × {holeDepthIn}" = <span className="font-medium">{singleResult.volumeCuFt.toFixed(3)} cu ft</span></p>
                <p>With {Math.round(waste*100)}% waste: <span className="font-medium">{singleResult.volumeCuFtWithWaste.toFixed(3)} cu ft</span></p>
                <p>Bags per hole: {singleResult.volumeCuFtWithWaste.toFixed(3)} ÷ {CONCRETE_BAGS[bagSize].yield_cu_ft} = <span className="font-medium">{singleResult.bagsNeeded} bags</span></p>
                <p>× {holeCount} holes = <span className="font-medium">{totalBags} bags total</span></p>
              </>
            ) : (
              <>
                <p>Volume: {singleResult.volumeCuFt.toFixed(3)} cu ft ({singleResult.volumeCuYd.toFixed(3)} cu yd)</p>
                <p>With {Math.round(waste*100)}% waste: <span className="font-medium">{singleResult.volumeCuFtWithWaste.toFixed(3)} cu ft</span></p>
                <p>Bags: {singleResult.volumeCuFtWithWaste.toFixed(3)} ÷ {CONCRETE_BAGS[bagSize].yield_cu_ft} cu ft/bag = <span className="font-medium">{totalBags} bags</span> (rounded up)</p>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-3">Always buy a few extra bags — the {Math.round(waste*100)}% overage accounts for spillage and uneven ground. Bag yields per Quikrete specifications.</p>
        </div>
      )}
    </div>
  );
}
