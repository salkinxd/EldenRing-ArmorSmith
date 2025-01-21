// Roll Types
export enum RollType {
    Light,
    Medium,
    Heavy,
}

// Data
export interface ArmorPiece {
    name: string;
    weight: number;
    available: string; // Add "available" property
    [stat: string]: number | string; // Allow any stat property
}

export interface ArmorData {
    helms: ArmorPiece[];
    chests: ArmorPiece[];
    gauntlets: ArmorPiece[];
    legs: ArmorPiece[];
}