export interface Material {
  description: string;
  thickness: number;
  cuttingWidth: number;
}

export interface Stock {
  description: string;
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
  countLeft?: number;
  stock: Stock;
  followGrain: boolean;
  description: string;
}

export class Resultset {
  usedStock: UsedStock[] = [];
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

export interface HowToFit {
  usable: boolean;
  turned: boolean;
  position: Position;
}
