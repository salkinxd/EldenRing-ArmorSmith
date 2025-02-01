// Roll Types
export enum RollType {
    Light,
    Medium,
    Heavy,
}

// Armor Piece Data
export interface ArmorPiece {
    name: string;
    weight: number;
    available: string;
    [stat: string]: number | string; // Allow any stat property
}

export interface ArmorData {
    helms: ArmorPiece[];
    chests: ArmorPiece[];
    gauntlets: ArmorPiece[];
    legs: ArmorPiece[];
}