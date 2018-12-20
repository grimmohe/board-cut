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
    material: Material;
}

export interface Part {
    height: number;
    width: number;
    count: number;
    stock: Stock;
    followGrain: boolean;
    description: string;
}

export class Resultset {
    stock: Stock[] = [];
    cuts: Cut[] = [];
    stats: Statistics = {usedPercentage: 0, wasteArea: null};
}

export interface CuttedPart {
    part: Part;
    turned: boolean;
}

export interface Cut {
    parts: CuttedPart[];
}

export interface Statistics {
    usedPercentage: number;
    wasteArea: number;
}
