import {
  MULCH, GRAVEL, GRAVEL_DENSITIES, TOPSOIL, SAND, SAND_DENSITIES,
  SOD, CONCRETE, CONCRETE_BAGS, CONVERSIONS,
  PAINT, PAINT_COVERAGE, FLOORING, FLOORING_WASTE,
  TILE, TILE_SIZES, DRYWALL, DRYWALL_SHEETS,
  LUMBER, LUMBER_NOMINAL_SIZES, PAVER, PAVER_SIZES,
  type GravelType, type SandType, type ConcreteBagSize,
  type PaintSurface, type FlooringPattern, type TileSize, type DrywallSheet,
  type LumberSize, type PaverSize,
} from './constants';
import { computeAreaSqFt, computeVolumeCuFt, cuFtToCuYd, type ShapeInput } from './geometry';

function applyWaste(qty: number, waste: number): number {
  return Math.round(qty * (1 + waste) * 1e10) / 1e10;
}

function roundUp(n: number): number {
  return Math.ceil(n);
}

// ─── Mulch ────────────────────────────────────────────────────────────────────
export interface MulchResult {
  areaSqFt: number;
  volumeCuFt: number;
  volumeCuYd: number;
  volumeCuYdWithWaste: number;
  bagsNeeded: number;
  costEstimate?: number;
}

export function calcMulch(
  shape: ShapeInput,
  depthIn: number = MULCH.DEFAULT_DEPTH_IN,
  wasteFactor: number = MULCH.DEFAULT_WASTE,
  pricePerBag?: number,
): MulchResult {
  const areaSqFt = computeAreaSqFt(shape);
  const volumeCuFt = computeVolumeCuFt(areaSqFt, depthIn);
  const volumeCuYd = cuFtToCuYd(volumeCuFt);
  const volumeCuYdWithWaste = applyWaste(volumeCuYd, wasteFactor);
  const bagsNeeded = roundUp(volumeCuYdWithWaste * MULCH.BAGS_PER_CU_YD);
  return {
    areaSqFt,
    volumeCuFt,
    volumeCuYd,
    volumeCuYdWithWaste,
    bagsNeeded,
    costEstimate: pricePerBag != null ? bagsNeeded * pricePerBag : undefined,
  };
}

// ─── Gravel ───────────────────────────────────────────────────────────────────
export interface GravelResult {
  areaSqFt: number;
  volumeCuFt: number;
  volumeCuYd: number;
  volumeCuYdWithWaste: number;
  tons: number;
  costEstimate?: number;
}

export function calcGravel(
  shape: ShapeInput,
  depthIn: number = GRAVEL.DEFAULT_DEPTH_IN,
  stoneType: GravelType = GRAVEL.DEFAULT_TYPE,
  wasteFactor: number = GRAVEL.DEFAULT_WASTE,
  pricePerTon?: number,
): GravelResult {
  const areaSqFt = computeAreaSqFt(shape);
  const volumeCuFt = computeVolumeCuFt(areaSqFt, depthIn);
  const volumeCuYd = cuFtToCuYd(volumeCuFt);
  const volumeCuYdWithWaste = applyWaste(volumeCuYd, wasteFactor);
  const density = GRAVEL_DENSITIES[stoneType].tons;
  const tons = volumeCuYdWithWaste * density;
  return {
    areaSqFt,
    volumeCuFt,
    volumeCuYd,
    volumeCuYdWithWaste,
    tons,
    costEstimate: pricePerTon != null ? tons * pricePerTon : undefined,
  };
}

// ─── Topsoil ──────────────────────────────────────────────────────────────────
export interface TopsoilResult {
  areaSqFt: number;
  volumeCuFt: number;
  volumeCuYd: number;
  volumeCuYdWithWaste: number;
  tons: number;
  bags40lb: number;
  costEstimate?: number;
}

export function calcTopsoil(
  shape: ShapeInput,
  depthIn: number = TOPSOIL.DEFAULT_DEPTH_IN,
  wasteFactor: number = TOPSOIL.DEFAULT_WASTE,
  pricePerCuYd?: number,
): TopsoilResult {
  const areaSqFt = computeAreaSqFt(shape);
  const volumeCuFt = computeVolumeCuFt(areaSqFt, depthIn);
  const volumeCuYd = cuFtToCuYd(volumeCuFt);
  const volumeCuYdWithWaste = applyWaste(volumeCuYd, wasteFactor);
  const tons = volumeCuYdWithWaste * TOPSOIL.DENSITY_TONS_PER_CU_YD;
  const bags40lb = roundUp((volumeCuYdWithWaste * CONVERSIONS.CU_FT_PER_CU_YD) / TOPSOIL.BAG_40LB_YIELD_CU_FT);
  return {
    areaSqFt,
    volumeCuFt,
    volumeCuYd,
    volumeCuYdWithWaste,
    tons,
    bags40lb,
    costEstimate: pricePerCuYd != null ? volumeCuYdWithWaste * pricePerCuYd : undefined,
  };
}

// ─── Sand ─────────────────────────────────────────────────────────────────────
export interface SandResult {
  areaSqFt: number;
  volumeCuFt: number;
  volumeCuYd: number;
  volumeCuYdWithWaste: number;
  tons: number;
  bags50lb: number;
  costEstimate?: number;
}

export function calcSand(
  shape: ShapeInput,
  depthIn: number = SAND.DEFAULT_DEPTH_IN,
  sandType: SandType = SAND.DEFAULT_TYPE,
  wasteFactor: number = SAND.DEFAULT_WASTE,
  pricePerTon?: number,
): SandResult {
  const areaSqFt = computeAreaSqFt(shape);
  const volumeCuFt = computeVolumeCuFt(areaSqFt, depthIn);
  const volumeCuYd = cuFtToCuYd(volumeCuFt);
  const volumeCuYdWithWaste = applyWaste(volumeCuYd, wasteFactor);
  const density = SAND_DENSITIES[sandType].tons;
  const tons = volumeCuYdWithWaste * density;
  const bags50lb = roundUp((volumeCuYdWithWaste * CONVERSIONS.CU_FT_PER_CU_YD) / SAND.BAG_50LB_YIELD_CU_FT);
  return {
    areaSqFt,
    volumeCuFt,
    volumeCuYd,
    volumeCuYdWithWaste,
    tons,
    bags50lb,
    costEstimate: pricePerTon != null ? tons * pricePerTon : undefined,
  };
}

// ─── Sod ──────────────────────────────────────────────────────────────────────
export interface SodResult {
  areaSqFt: number;
  areaWithWaste: number;
  pieces: number;
  pallets: number;
  palletsRoundedUp: number;
  costEstimate?: number;
}

export function calcSod(
  shape: ShapeInput,
  irregular = false,
  pricePerPallet?: number,
): SodResult {
  const wasteFactor = irregular ? SOD.DEFAULT_WASTE_IRREGULAR : SOD.DEFAULT_WASTE_STRAIGHT;
  const areaSqFt = computeAreaSqFt(shape);
  const areaWithWaste = applyWaste(areaSqFt, wasteFactor);
  const pieces = roundUp(areaWithWaste / SOD.PIECE_SQ_FT);
  const pallets = areaWithWaste / SOD.PALLET_SQ_FT;
  const palletsRoundedUp = roundUp(pallets);
  return {
    areaSqFt,
    areaWithWaste,
    pieces,
    pallets,
    palletsRoundedUp,
    costEstimate: pricePerPallet != null ? palletsRoundedUp * pricePerPallet : undefined,
  };
}

// ─── Concrete ─────────────────────────────────────────────────────────────────
export interface ConcreteResult {
  volumeCuFt: number;
  volumeCuYd: number;
  volumeCuFtWithWaste: number;
  bagsNeeded: number;
  bagSize: ConcreteBagSize;
  costEstimate?: number;
}

export function calcConcrete(
  shape: ShapeInput,
  thicknessIn: number = CONCRETE.DEFAULT_THICKNESS_IN,
  bagSize: ConcreteBagSize = CONCRETE.DEFAULT_BAG_SIZE,
  wasteFactor: number = CONCRETE.DEFAULT_WASTE,
  pricePerBag?: number,
): ConcreteResult {
  const areaSqFt = computeAreaSqFt(shape);
  const volumeCuFt = computeVolumeCuFt(areaSqFt, thicknessIn);
  const volumeCuYd = cuFtToCuYd(volumeCuFt);
  const volumeCuFtWithWaste = applyWaste(volumeCuFt, wasteFactor);
  const bagYield = CONCRETE_BAGS[bagSize].yield_cu_ft;
  const bagsNeeded = roundUp(volumeCuFtWithWaste / bagYield);
  return {
    volumeCuFt,
    volumeCuYd,
    volumeCuFtWithWaste,
    bagsNeeded,
    bagSize,
    costEstimate: pricePerBag != null ? bagsNeeded * pricePerBag : undefined,
  };
}

// ─── Paint ────────────────────────────────────────────────────────────────────
export interface PaintResult {
  grossWallArea: number;
  openingArea: number;
  netWallArea: number;
  netWithWaste: number;
  gallonsNeeded: number;
  quartsNeeded: number;
  costEstimate?: number;
}

export function calcPaint(
  wallAreaSqFt: number,
  doors: number = 0,
  windows: number = 0,
  coats: number = PAINT.DEFAULT_COATS,
  surface: PaintSurface = PAINT.DEFAULT_SURFACE,
  wasteFactor: number = PAINT.DEFAULT_WASTE,
  pricePerGallon?: number,
): PaintResult {
  const openingArea = doors * PAINT.DOOR_SQ_FT + windows * PAINT.WINDOW_SQ_FT;
  const netWallArea = Math.max(0, wallAreaSqFt - openingArea) * coats;
  const netWithWaste = applyWaste(netWallArea, wasteFactor);
  const coverage = PAINT_COVERAGE[surface];
  const gallonsNeeded = Math.max(1, Math.ceil(netWithWaste / coverage));
  const quartsNeeded = Math.ceil((netWithWaste / coverage) * 4);
  return {
    grossWallArea: wallAreaSqFt,
    openingArea,
    netWallArea: netWallArea / coats,
    netWithWaste,
    gallonsNeeded,
    quartsNeeded,
    costEstimate: pricePerGallon != null ? gallonsNeeded * pricePerGallon : undefined,
  };
}

// ─── Flooring ─────────────────────────────────────────────────────────────────
export interface FlooringResult {
  roomSqFt: number;
  areaWithWaste: number;
  boxesNeeded: number;
  boxCoverageSqFt: number;
  costEstimate?: number;
}

export function calcFlooring(
  shape: ShapeInput,
  boxCoverageSqFt: number = FLOORING.DEFAULT_BOX_COVERAGE_SQ_FT,
  pattern: FlooringPattern = FLOORING.DEFAULT_PATTERN,
  pricePerBox?: number,
): FlooringResult {
  const roomSqFt = computeAreaSqFt(shape);
  const waste = FLOORING_WASTE[pattern];
  const areaWithWaste = applyWaste(roomSqFt, waste);
  const boxesNeeded = roundUp(areaWithWaste / boxCoverageSqFt);
  return {
    roomSqFt,
    areaWithWaste,
    boxesNeeded,
    boxCoverageSqFt,
    costEstimate: pricePerBox != null ? boxesNeeded * pricePerBox : undefined,
  };
}

// ─── Tile ─────────────────────────────────────────────────────────────────────
export interface TileResult {
  areaSqFt: number;
  areaWithWaste: number;
  tilesNeeded: number;
  thinset50lbBags: number;
  grout10lbBags: number;
  costEstimate?: number;
}

export function calcTile(
  shape: ShapeInput,
  tileSize: TileSize = TILE.DEFAULT_SIZE,
  diagonal = false,
  pricePerTile?: number,
): TileResult {
  const areaSqFt = computeAreaSqFt(shape);
  const waste = diagonal ? TILE.WASTE_DIAGONAL : TILE.WASTE_STRAIGHT;
  const areaWithWaste = applyWaste(areaSqFt, waste);
  const sqFtPerTile = TILE_SIZES[tileSize].sqFt;
  const tilesNeeded = roundUp(areaWithWaste / sqFtPerTile);
  const thinset50lbBags = roundUp(areaWithWaste / TILE.THINSET_50LB_SQ_FT);
  const grout10lbBags = roundUp(areaWithWaste / TILE.GROUT_10LB_SQ_FT);
  return {
    areaSqFt,
    areaWithWaste,
    tilesNeeded,
    thinset50lbBags,
    grout10lbBags,
    costEstimate: pricePerTile != null ? tilesNeeded * pricePerTile : undefined,
  };
}

// ─── Drywall ──────────────────────────────────────────────────────────────────
export interface DrywallResult {
  grossWallArea: number;
  openingArea: number;
  netWallArea: number;
  areaWithWaste: number;
  sheetsNeeded: number;
  jointCompoundGallons: number;
  tapeRolls: number;
  sheetSize: DrywallSheet;
  costEstimate?: number;
}

export function calcDrywall(
  wallAreaSqFt: number,
  doors: number = 0,
  windows: number = 0,
  sheetSize: DrywallSheet = DRYWALL.DEFAULT_SHEET,
  wasteFactor: number = DRYWALL.DEFAULT_WASTE,
  pricePerSheet?: number,
): DrywallResult {
  const openingArea = doors * DRYWALL.DOOR_SQ_FT + windows * DRYWALL.WINDOW_SQ_FT;
  const netWallArea = Math.max(0, wallAreaSqFt - openingArea);
  const areaWithWaste = applyWaste(netWallArea, wasteFactor);
  const sheetSqFt = DRYWALL_SHEETS[sheetSize].sqFt;
  const sheetsNeeded = roundUp(areaWithWaste / sheetSqFt);
  const jointCompoundGallons = roundUp(netWallArea / DRYWALL.JOINT_COMPOUND_1GAL_SQ_FT);
  const tapeRolls = roundUp(sheetsNeeded / DRYWALL.TAPE_75FT_SHEETS_PER_ROLL);
  return {
    grossWallArea: wallAreaSqFt,
    openingArea,
    netWallArea,
    areaWithWaste,
    sheetsNeeded,
    jointCompoundGallons,
    tapeRolls,
    sheetSize,
    costEstimate: pricePerSheet != null ? sheetsNeeded * pricePerSheet : undefined,
  };
}

// ─── Lumber ───────────────────────────────────────────────────────────────────
export interface LumberResult {
  boardFeet: number;
  boardFeetWithWaste: number;
  piecesNeeded: number;
  lengthFt: number;
  costEstimate?: number;
}

export function calcLumber(
  pieces: number,
  size: LumberSize,
  lengthFt: number,
  wasteFactor: number = LUMBER.DEFAULT_WASTE,
  pricePerBoardFt?: number,
): LumberResult {
  const { thickness, width } = LUMBER_NOMINAL_SIZES[size];
  const boardFeet = (pieces * thickness * width * lengthFt) / 12;
  const boardFeetWithWaste = applyWaste(boardFeet, wasteFactor);
  return {
    boardFeet,
    boardFeetWithWaste,
    piecesNeeded: pieces,
    lengthFt,
    costEstimate: pricePerBoardFt != null ? boardFeetWithWaste * pricePerBoardFt : undefined,
  };
}

// ─── Paver ────────────────────────────────────────────────────────────────────
export interface PaverResult {
  areaSqFt: number;
  areaWithWaste: number;
  paversNeeded: number;
  sandCuYd: number;
  gravelCuYd: number;
  costEstimate?: number;
}

export function calcPaver(
  shape: ShapeInput,
  paverSize: PaverSize,
  wasteFactor: number = PAVER.DEFAULT_WASTE,
  pricePerPaver?: number,
): PaverResult {
  const areaSqFt = computeAreaSqFt(shape);
  const areaWithWaste = applyWaste(areaSqFt, wasteFactor);
  const { widthIn, lengthIn } = PAVER_SIZES[paverSize];
  const paverSqFt = (widthIn * lengthIn) / 144;
  const paversNeeded = roundUp(areaWithWaste / paverSqFt);
  const sandCuYd = cuFtToCuYd(computeVolumeCuFt(areaWithWaste, PAVER.SAND_BASE_DEPTH_IN));
  const gravelCuYd = cuFtToCuYd(computeVolumeCuFt(areaWithWaste, PAVER.GRAVEL_BASE_DEPTH_IN));
  return {
    areaSqFt,
    areaWithWaste,
    paversNeeded,
    sandCuYd,
    gravelCuYd,
    costEstimate: pricePerPaver != null ? paversNeeded * pricePerPaver : undefined,
  };
}
