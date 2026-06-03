import {
  MULCH, GRAVEL, GRAVEL_DENSITIES, TOPSOIL, SAND, SAND_DENSITIES,
  SOD, CONCRETE, CONCRETE_BAGS, CONVERSIONS,
  type GravelType, type SandType, type ConcreteBagSize,
} from './constants';
import { computeAreaSqFt, computeVolumeCuFt, cuFtToCuYd, type ShapeInput } from './geometry';

function applyWaste(qty: number, waste: number): number {
  return qty * (1 + waste);
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
