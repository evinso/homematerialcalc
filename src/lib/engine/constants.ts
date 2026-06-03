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

// ─── Paint ────────────────────────────────────────────────────────────────────
export type PaintSurface = keyof typeof PAINT_COVERAGE;
export const PAINT_COVERAGE = {
  'standard':  350, // sq ft per gallon per coat — Sherwin-Williams / BM avg
  'premium':   400,
  'primer':    250,
  'textured':  275,
} as const;

export const PAINT = {
  DEFAULT_SURFACE: 'standard' as PaintSurface,
  DEFAULT_COATS: 2,
  DEFAULT_WASTE: 0.10,
  DOOR_SQ_FT: 21,    // standard 3×7 interior door
  WINDOW_SQ_FT: 15,  // standard 3×5 window
} as const;

// ─── Flooring ─────────────────────────────────────────────────────────────────
export type FlooringPattern = 'straight' | 'diagonal' | 'complex';
export const FLOORING_WASTE: Record<FlooringPattern, number> = {
  straight: 0.10, // NWFA guidelines
  diagonal: 0.15,
  complex:  0.15,
};

export const FLOORING = {
  DEFAULT_PATTERN: 'straight' as FlooringPattern,
  DEFAULT_BOX_COVERAGE_SQ_FT: 20,
} as const;

// ─── Tile ─────────────────────────────────────────────────────────────────────
export type TileSize = keyof typeof TILE_SIZES;
export const TILE_SIZES = {
  '4x4':   { sqFt: 0.111, label: '4" × 4"'  },
  '6x6':   { sqFt: 0.250, label: '6" × 6"'  },
  '12x12': { sqFt: 1.000, label: '12" × 12"' },
  '18x18': { sqFt: 2.250, label: '18" × 18"' },
  '24x24': { sqFt: 4.000, label: '24" × 24"' },
  '3x6':   { sqFt: 0.125, label: '3" × 6" (subway)' },
  '4x16':  { sqFt: 0.444, label: '4" × 16" (subway)' },
} as const;

export const TILE = {
  DEFAULT_SIZE: '12x12' as TileSize,
  WASTE_STRAIGHT: 0.10, // TCNA Handbook
  WASTE_DIAGONAL: 0.15,
  THINSET_50LB_SQ_FT: 40,  // 3/8" notched trowel, manufacturer avg
  GROUT_10LB_SQ_FT:   50,  // sanded, 1/8" joint, 12×12 tile
} as const;

// ─── Drywall ──────────────────────────────────────────────────────────────────
export type DrywallSheet = keyof typeof DRYWALL_SHEETS;
export const DRYWALL_SHEETS = {
  '4x8':  { sqFt: 32, label: '4 × 8 ft (32 sq ft)'  },
  '4x12': { sqFt: 48, label: '4 × 12 ft (48 sq ft)' },
  '4x16': { sqFt: 64, label: '4 × 16 ft (64 sq ft)' },
} as const;

export const DRYWALL = {
  DEFAULT_SHEET: '4x8' as DrywallSheet,
  DEFAULT_WASTE: 0.12,
  JOINT_COMPOUND_1GAL_SQ_FT: 100,  // 3 coats, USG avg
  TAPE_75FT_SHEETS_PER_ROLL: 3,    // per 4×8 sheet
  DOOR_SQ_FT: 21,
  WINDOW_SQ_FT: 15,
} as const;
