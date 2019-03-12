export interface Material {
  description?: string;
  thickness: number;
  cuttingWidth: number;
}

export interface Stock {
  description?: string;
  height: number;
  width: number;
  count: number;
  countLeft?: number;
  material: Material;
}

export interface Part {
  height: number;
  width: number;
  count: number;
  stock: Stock;
  followGrain: boolean;
  description?: string;
}

export class Resultset {
  usedStock: UsedStock[] = [];
  stockArea?: number;
  partsArea?: number;
  usageRatio?: number;
}

export interface UsedStock {
  usedParts: UsedPart[];
  stock: Stock;
  usedArea: Position;
}

export interface UsedPart {
  turned: boolean;
  part: Part;
  position: Position;
}

export interface Position {
  x: number;
  y: number;
}

export interface Statistics {
  usedPercentage: number;
  wasteArea: number;
}

export type Direction = 'x' | 'y';
