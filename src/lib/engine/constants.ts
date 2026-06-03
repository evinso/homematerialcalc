// Single source-of-truth — values come from docs/constants.md. Never hardcode elsewhere.

export const CONVERSIONS = {
  CU_FT_PER_CU_YD: 27,
  CU_IN_PER_CU_FT: 1_728,
  LBS_PER_TON: 2_000,
  SQ_FT_PER_SQ_YD: 9,
  IN_PER_FT: 12,
  FT_PER_METER: 3.281,
  SQ_FT_PER_SQ_METER: 10.764,
} as const;

// ─── Mulch ────────────────────────────────────────────────────────────────────
export const MULCH = {
  BAG_YIELD_CU_FT: 2,
  BAGS_PER_CU_YD: 13.5,   // 27 ÷ 2
  DEFAULT_DEPTH_IN: 3,
  DEFAULT_WASTE: 0.05,
} as const;

// ─── Gravel / Crushed Stone ───────────────────────────────────────────────────
export type GravelType = keyof typeof GRAVEL_DENSITIES;
export const GRAVEL_DENSITIES = {
  'pea-gravel':         { tons: 1.40, lbs: 2_800 },
  'crushed-stone-3_4':  { tons: 1.40, lbs: 2_800 },
  'crushed-limestone':  { tons: 1.50, lbs: 3_000 },
  'river-rock':         { tons: 1.35, lbs: 2_700 },
  'decomposed-granite': { tons: 1.35, lbs: 2_700 },
} as const;

export const GRAVEL = {
  DEFAULT_TYPE: 'crushed-stone-3_4' as GravelType,
  DEFAULT_DEPTH_IN: 2,
  DEFAULT_WASTE: 0.10,
} as const;

// ─── Topsoil ──────────────────────────────────────────────────────────────────
export const TOPSOIL = {
  DENSITY_TONS_PER_CU_YD: 1.10,
  BAG_40LB_YIELD_CU_FT: 0.75,
  BAG_1CUFT_YIELD_CU_FT: 1.0,
  BAGS_40LB_PER_CU_YD: 36,   // 27 ÷ 0.75
  DEFAULT_DEPTH_IN: 4,
  DEFAULT_WASTE: 0.05,
} as const;

// ─── Sand ─────────────────────────────────────────────────────────────────────
export type SandType = keyof typeof SAND_DENSITIES;
export const SAND_DENSITIES = {
  'all-purpose': { tons: 1.35, lbs: 2_700 },
  'paver':       { tons: 1.35, lbs: 2_700 },
  'play':        { tons: 1.30, lbs: 2_600 },
  'mason':       { tons: 1.30, lbs: 2_600 },
} as const;

export const SAND = {
  DEFAULT_TYPE: 'all-purpose' as SandType,
  BAG_50LB_YIELD_CU_FT: 0.50,
  BAGS_50LB_PER_CU_YD: 54,   // 27 ÷ 0.5
  DEFAULT_DEPTH_IN: 1,
  DEFAULT_WASTE: 0.10,
} as const;

// ─── Sod ──────────────────────────────────────────────────────────────────────
export const SOD = {
  PIECE_SQ_FT: 2.67,          // 16" × 24"
  PIECES_PER_PALLET: 170,
  PALLET_SQ_FT: 450,          // 170 × 2.67 ≈ 450
  DEFAULT_WASTE_STRAIGHT: 0.05,
  DEFAULT_WASTE_IRREGULAR: 0.10,
} as const;

// ─── Concrete ─────────────────────────────────────────────────────────────────
export type ConcreteBagSize = keyof typeof CONCRETE_BAGS;
export const CONCRETE_BAGS = {
  40: { yield_cu_ft: 0.30,  bags_per_cu_yd: 90 },
  50: { yield_cu_ft: 0.375, bags_per_cu_yd: 72 },
  60: { yield_cu_ft: 0.45,  bags_per_cu_yd: 60 },
  80: { yield_cu_ft: 0.60,  bags_per_cu_yd: 45 },
} as const;

export const CONCRETE = {
  DEFAULT_BAG_SIZE: 80 as ConcreteBagSize,
  DEFAULT_THICKNESS_IN: 4,
  DEFAULT_WASTE: 0.10,
} as const;
