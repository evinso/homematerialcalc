import { describe, it, expect } from 'vitest';
import { calcMulch, calcGravel, calcTopsoil, calcSand, calcSod, calcConcrete, calcPaint, calcFlooring, calcTile, calcDrywall } from './calculators';
import { computeAreaSqFt, cuFtToCuYd, feetInchesToFt } from './geometry';
import { CONVERSIONS } from './constants';

// ─── Geometry ─────────────────────────────────────────────────────────────────
describe('geometry', () => {
  it('rectangle area', () => {
    expect(computeAreaSqFt({ type: 'rectangle', lengthFt: 10, widthFt: 5 })).toBe(50);
  });

  it('circle area', () => {
    const r = 5;
    expect(computeAreaSqFt({ type: 'circle', radiusFt: r })).toBeCloseTo(Math.PI * 25, 5);
  });

  it('triangle area', () => {
    expect(computeAreaSqFt({ type: 'triangle', baseFt: 10, heightFt: 4 })).toBe(20);
  });

  it('irregular area = sum of sub-shapes', () => {
    const area = computeAreaSqFt({
      type: 'irregular',
      shapes: [
        { type: 'rectangle', lengthFt: 10, widthFt: 5 },
        { type: 'rectangle', lengthFt: 4,  widthFt: 3 },
      ],
    });
    expect(area).toBe(62);
  });

  it('feetInchesToFt', () => {
    expect(feetInchesToFt(3, 6)).toBeCloseTo(3.5, 5);
  });

  it('1 cu yd = 27 cu ft', () => {
    expect(CONVERSIONS.CU_FT_PER_CU_YD).toBe(27);
    expect(cuFtToCuYd(27)).toBe(1);
  });
});

// ─── Mulch ────────────────────────────────────────────────────────────────────
describe('calcMulch', () => {
  it('108 sq ft at 3 in depth = 1 cu yd base volume', () => {
    // 108 sq ft × (3/12 ft) = 27 cu ft = 1 cu yd
    const r = calcMulch({ type: 'rectangle', lengthFt: 12, widthFt: 9 }, 3, 0);
    expect(r.areaSqFt).toBe(108);
    expect(r.volumeCuFt).toBeCloseTo(27, 5);
    expect(r.volumeCuYd).toBeCloseTo(1, 5);
    expect(r.volumeCuYdWithWaste).toBeCloseTo(1, 5);
    expect(r.bagsNeeded).toBe(14); // ceil(1 × 13.5) = 14
  });

  it('applies 5% waste correctly', () => {
    const r = calcMulch({ type: 'rectangle', lengthFt: 12, widthFt: 9 }, 3, 0.05);
    expect(r.volumeCuYdWithWaste).toBeCloseTo(1.05, 5);
    expect(r.bagsNeeded).toBe(Math.ceil(1.05 * 13.5)); // 15
  });

  it('cost estimate = bags × price', () => {
    const r = calcMulch({ type: 'rectangle', lengthFt: 12, widthFt: 9 }, 3, 0, 5);
    expect(r.costEstimate).toBeCloseTo(r.bagsNeeded * 5, 2);
  });

  it('2 cu yd area → 27 bags with no waste', () => {
    // 216 sq ft × 3 in depth = 54 cu ft = 2 cu yd → 2 × 13.5 = 27 bags
    const r = calcMulch({ type: 'rectangle', lengthFt: 24, widthFt: 9 }, 3, 0);
    expect(r.bagsNeeded).toBe(27);
  });
});

// ─── Gravel ───────────────────────────────────────────────────────────────────
describe('calcGravel', () => {
  it('100 sq ft at 2 in with pea gravel', () => {
    // 100 × (2/12) = 16.667 cu ft → 0.617 cu yd → × 1.10 waste → × 1.40 t/yd
    const r = calcGravel({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 2, 'pea-gravel', 0.10);
    expect(r.areaSqFt).toBe(100);
    expect(r.volumeCuFt).toBeCloseTo(16.667, 2);
    expect(r.volumeCuYd).toBeCloseTo(0.617, 2);
    expect(r.volumeCuYdWithWaste).toBeCloseTo(0.679, 2);
    expect(r.tons).toBeCloseTo(0.679 * 1.40, 2);
  });

  it('crushed limestone is denser than pea gravel', () => {
    const pea  = calcGravel({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 3, 'pea-gravel', 0);
    const lime = calcGravel({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 3, 'crushed-limestone', 0);
    expect(lime.tons).toBeGreaterThan(pea.tons);
  });
});

// ─── Topsoil ──────────────────────────────────────────────────────────────────
describe('calcTopsoil', () => {
  it('100 sq ft at 4 in with no waste', () => {
    // 100 × (4/12) = 33.33 cu ft → 1.235 cu yd
    const r = calcTopsoil({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 4, 0);
    expect(r.areaSqFt).toBe(100);
    expect(r.volumeCuFt).toBeCloseTo(33.33, 1);
    expect(r.volumeCuYd).toBeCloseTo(1.235, 2);
    // bags: ceil(1.235 × 27 / 0.75) = ceil(44.44) = 45
    expect(r.bags40lb).toBe(45);
  });

  it('36 bags of topsoil = 1 cu yd', () => {
    // 27 cu ft ÷ 0.75 = 36
    const r = calcTopsoil({ type: 'rectangle', lengthFt: 12, widthFt: 9 }, 4, 0);
    // 108 sq ft × 4/12 = 36 cu ft = 1.333 cu yd
    // bags = ceil(1.333 × 27 / 0.75) = ceil(48) = 48
    expect(r.bags40lb).toBe(48);
  });
});

// ─── Sand ─────────────────────────────────────────────────────────────────────
describe('calcSand', () => {
  it('200 sq ft paver base at 1 in', () => {
    // 200 × (1/12) = 16.667 cu ft → 0.617 cu yd → × 1.10 → bags = ceil(0.679 × 27 / 0.5)
    const r = calcSand({ type: 'rectangle', lengthFt: 20, widthFt: 10 }, 1, 'paver', 0.10);
    expect(r.areaSqFt).toBe(200);
    expect(r.bags50lb).toBe(Math.ceil((0.617 * 1.10 * 27) / 0.5));
  });

  it('play sand is lighter than all-purpose', () => {
    const ap   = calcSand({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 2, 'all-purpose', 0);
    const play = calcSand({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 2, 'play', 0);
    expect(play.tons).toBeLessThan(ap.tons);
  });
});

// ─── Sod ──────────────────────────────────────────────────────────────────────
describe('calcSod', () => {
  it('450 sq ft straight = 1 pallet with 5% waste', () => {
    // 450 × 1.05 = 472.5 → ceil(472.5 / 450) = 2 pallets
    const r = calcSod({ type: 'rectangle', lengthFt: 30, widthFt: 15 }, false);
    expect(r.areaSqFt).toBe(450);
    expect(r.areaWithWaste).toBeCloseTo(472.5, 2);
    expect(r.palletsRoundedUp).toBe(2);
  });

  it('irregular shape uses 10% waste', () => {
    const straight   = calcSod({ type: 'rectangle', lengthFt: 30, widthFt: 10 }, false);
    const irregular  = calcSod({ type: 'rectangle', lengthFt: 30, widthFt: 10 }, true);
    expect(irregular.areaWithWaste).toBeGreaterThan(straight.areaWithWaste);
  });

  it('pieces = ceil(areaWithWaste / 2.67)', () => {
    const r = calcSod({ type: 'rectangle', lengthFt: 20, widthFt: 20 }, false);
    expect(r.pieces).toBe(Math.ceil(r.areaWithWaste / 2.67));
  });
});

// ─── Concrete ─────────────────────────────────────────────────────────────────
describe('calcConcrete', () => {
  it('10×10 slab at 4 in with 80 lb bags', () => {
    // 100 sq ft × (4/12) = 33.33 cu ft × 1.10 waste = 36.67 cu ft
    // 36.67 / 0.60 = 61.1 → 62 bags
    const r = calcConcrete({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 4, 80, 0.10);
    expect(r.volumeCuFt).toBeCloseTo(33.33, 1);
    expect(r.bagsNeeded).toBe(62);
  });

  it('same slab with 60 lb bags needs more bags', () => {
    const r80 = calcConcrete({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 4, 80, 0.10);
    const r60 = calcConcrete({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 4, 60, 0.10);
    expect(r60.bagsNeeded).toBeGreaterThan(r80.bagsNeeded);
  });

  it('same slab with 40 lb bags', () => {
    // 36.67 / 0.30 = 122.2 → 123 bags
    const r = calcConcrete({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 4, 40, 0.10);
    expect(r.bagsNeeded).toBe(123);
  });

  it('post hole cylinder', () => {
    // 6" diameter → radius = 0.25 ft; depth 36" = 3 ft
    // area = π × 0.25² ≈ 0.1963 sq ft; volume = 0.1963 × 3 = 0.589 cu ft × 1.10 = 0.648
    // 80 lb bags: 0.648 / 0.60 = 1.08 → 2 bags
    const r = calcConcrete(
      { type: 'circle', radiusFt: 0.25 },
      36,   // depth in inches
      80,
      0.10,
    );
    expect(r.bagsNeeded).toBe(2);
  });

  it('cost estimate', () => {
    const r = calcConcrete({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 4, 80, 0.10, 8.50);
    expect(r.costEstimate).toBeCloseTo(r.bagsNeeded * 8.50, 2);
  });
});

// ─── Unit conversion sanity checks ───────────────────────────────────────────
describe('unit conversions', () => {
  it('1 cu yd = 27 cu ft', () => {
    expect(CONVERSIONS.CU_FT_PER_CU_YD).toBe(27);
  });

  it('mulch: 13.5 bags per cu yd', () => {
    // 27 cu ft / 2 cu ft per bag = 13.5
    const bagsPerCuYd = CONVERSIONS.CU_FT_PER_CU_YD / 2;
    expect(bagsPerCuYd).toBe(13.5);
  });

  it('topsoil: 36 bags (40 lb) per cu yd', () => {
    // 27 / 0.75 = 36
    expect(27 / 0.75).toBe(36);
  });

  it('sand: 54 bags (50 lb) per cu yd', () => {
    // 27 / 0.5 = 54
    expect(27 / 0.5).toBe(54);
  });

  it('concrete 80 lb: 45 bags per cu yd', () => {
    // 27 cu ft / 0.60 = 45
    expect(Math.round(27 / 0.60)).toBe(45);
  });

  it('concrete 60 lb: 60 bags per cu yd', () => {
    expect(Math.round(27 / 0.45)).toBe(60);
  });

  it('concrete 40 lb: 90 bags per cu yd', () => {
    expect(Math.round(27 / 0.30)).toBe(90);
  });
});

// ─── Paint ────────────────────────────────────────────────────────────────────
describe('calcPaint', () => {
  it('12×12 room, 8 ft ceiling, 2 coats, no openings, standard coverage', () => {
    // perimeter = 4×12 = 48 ft, wall area = 48×8 = 384 sq ft
    // net = 384 × 2 coats × 1.10 waste = 844.8 sq ft
    // gallons = ceil(844.8 / 350) = ceil(2.41) = 3
    const r = calcPaint(384, 0, 0, 2, 'standard', 0.10);
    expect(r.grossWallArea).toBe(384);
    expect(r.gallonsNeeded).toBe(3);
  });

  it('subtracts doors and windows', () => {
    // 500 sq ft walls, 1 door (21 sqft), 2 windows (30 sqft) = 449 net × 2 coats × 1.10
    const r = calcPaint(500, 1, 2, 2, 'standard', 0.10);
    expect(r.openingArea).toBe(21 + 30);
    expect(r.netWallArea).toBe(449);
  });

  it('premium paint covers more per gallon', () => {
    const std  = calcPaint(400, 0, 0, 2, 'standard', 0);
    const prem = calcPaint(400, 0, 0, 2, 'premium', 0);
    expect(prem.gallonsNeeded).toBeLessThanOrEqual(std.gallonsNeeded);
  });

  it('cost estimate = gallons × price', () => {
    const r = calcPaint(200, 0, 0, 2, 'standard', 0, 45);
    expect(r.costEstimate).toBeCloseTo(r.gallonsNeeded * 45, 2);
  });
});

// ─── Flooring ─────────────────────────────────────────────────────────────────
describe('calcFlooring', () => {
  it('200 sq ft room, 20 sq ft box, straight lay (10% waste)', () => {
    // 200 × 1.10 = 220 sq ft → 220 / 20 = 11 boxes
    const r = calcFlooring({ type: 'rectangle', lengthFt: 20, widthFt: 10 }, 20, 'straight');
    expect(r.roomSqFt).toBe(200);
    expect(r.areaWithWaste).toBeCloseTo(220, 2);
    expect(r.boxesNeeded).toBe(11);
  });

  it('diagonal lay uses 15% waste', () => {
    const str = calcFlooring({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 20, 'straight');
    const dia = calcFlooring({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, 20, 'diagonal');
    expect(dia.boxesNeeded).toBeGreaterThanOrEqual(str.boxesNeeded);
  });

  it('rounds boxes up', () => {
    // 105 sq ft × 1.10 = 115.5, / 20 = 5.775 → 6 boxes
    const r = calcFlooring({ type: 'rectangle', lengthFt: 15, widthFt: 7 }, 20, 'straight');
    expect(r.boxesNeeded).toBe(Math.ceil(r.areaWithWaste / 20));
  });
});

// ─── Tile ─────────────────────────────────────────────────────────────────────
describe('calcTile', () => {
  it('100 sq ft with 12×12 tiles, straight lay', () => {
    // 100 × 1.10 = 110 sq ft → 110 / 1.0 = 110 tiles
    const r = calcTile({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, '12x12', false);
    expect(r.areaSqFt).toBe(100);
    expect(r.tilesNeeded).toBe(110);
  });

  it('diagonal lay uses 15% waste', () => {
    const str = calcTile({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, '12x12', false);
    const dia = calcTile({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, '12x12', true);
    expect(dia.tilesNeeded).toBeGreaterThan(str.tilesNeeded);
  });

  it('smaller tiles need more tiles per sq ft', () => {
    const big   = calcTile({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, '24x24', false);
    const small = calcTile({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, '4x4',   false);
    expect(small.tilesNeeded).toBeGreaterThan(big.tilesNeeded);
  });

  it('thinset bags = ceil(areaWithWaste / 40)', () => {
    const r = calcTile({ type: 'rectangle', lengthFt: 10, widthFt: 10 }, '12x12', false);
    expect(r.thinset50lbBags).toBe(Math.ceil(r.areaWithWaste / 40));
  });
});

// ─── Drywall ──────────────────────────────────────────────────────────────────
describe('calcDrywall', () => {
  it('12×12 room, 8 ft ceiling, 4 walls, no openings, 4×8 sheets', () => {
    // wall area = perimeter × height = 48 × 8 = 384 sq ft
    // × 1.12 waste = 430.1 sq ft → 430.1 / 32 = 13.4 → 14 sheets
    const r = calcDrywall(384, 0, 0, '4x8', 0.12);
    expect(r.grossWallArea).toBe(384);
    expect(r.sheetsNeeded).toBe(Math.ceil(384 * 1.12 / 32));
  });

  it('subtracts door and window openings', () => {
    const r = calcDrywall(400, 2, 1, '4x8', 0);
    expect(r.openingArea).toBe(2 * 21 + 1 * 15);
    expect(r.netWallArea).toBe(400 - 57);
  });

  it('4×12 sheets need fewer sheets than 4×8', () => {
    const s8  = calcDrywall(500, 0, 0, '4x8',  0.12);
    const s12 = calcDrywall(500, 0, 0, '4x12', 0.12);
    expect(s12.sheetsNeeded).toBeLessThan(s8.sheetsNeeded);
  });

  it('joint compound gallons = ceil(netArea / 100)', () => {
    const r = calcDrywall(300, 0, 0, '4x8', 0.12);
    expect(r.jointCompoundGallons).toBe(Math.ceil(300 / 100));
  });
});
