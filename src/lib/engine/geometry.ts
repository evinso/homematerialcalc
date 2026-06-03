import { CONVERSIONS } from './constants';

export type ShapeInput =
  | { type: 'rectangle'; lengthFt: number; widthFt: number }
  | { type: 'circle';    radiusFt: number }
  | { type: 'triangle';  baseFt: number; heightFt: number }
  | { type: 'irregular'; shapes: ShapeInput[] };

/** Returns area in square feet. */
export function computeAreaSqFt(shape: ShapeInput): number {
  switch (shape.type) {
    case 'rectangle':
      return shape.lengthFt * shape.widthFt;
    case 'circle':
      return Math.PI * shape.radiusFt ** 2;
    case 'triangle':
      return 0.5 * shape.baseFt * shape.heightFt;
    case 'irregular':
      return shape.shapes.reduce((sum, s) => sum + computeAreaSqFt(s), 0);
  }
}

/** Returns volume in cubic feet given area (sq ft) and depth (inches). */
export function computeVolumeCuFt(areaSqFt: number, depthIn: number): number {
  return areaSqFt * (depthIn / CONVERSIONS.IN_PER_FT);
}

/** Converts cubic feet to cubic yards. */
export function cuFtToCuYd(cuFt: number): number {
  return cuFt / CONVERSIONS.CU_FT_PER_CU_YD;
}

/** Converts feet + inches to decimal feet. */
export function feetInchesToFt(feet: number, inches = 0): number {
  return feet + inches / CONVERSIONS.IN_PER_FT;
}

/** Converts meters to feet. */
export function metersToFt(m: number): number {
  return m * CONVERSIONS.FT_PER_METER;
}
