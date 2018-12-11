export interface Stock {
    height: number;
    width: number;
    thickness: number;
    cuttingWidth: number;
    description: string;
}

export interface Part {
    height: number;
    width: number;
    count: number;
    stock: Stock;
    followGrain: boolean;
    description: string;
}

export interface Resultset {
    stock: Stock;
    cuts: Cut[];
    stats: Statistics;
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
