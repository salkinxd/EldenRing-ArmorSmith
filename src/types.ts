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
    poise: number;
    physical: number;
    vsStrike: number;
    vsSlash: number;
    vsPierce: number;
    magic: number;
    fire: number;
    lightning: number;
    holy: number;
    immunity: number;
    robustness: number;
    focus: number;
    vitality: number;
}

export interface ArmorData {
    helms: ArmorPiece[];
    chests: ArmorPiece[];
    gauntlets: ArmorPiece[];
    legs: ArmorPiece[];
}

// Valid stat names
export const validStats = [
    "poise",
    "negation", // Composite stat
    "resistance", // Composite stat
    "physical",
    "vsStrike",
    "vsSlash",
    "vsPierce",
    "magic",
    "fire",
    "lightning",
    "holy",
    "immunity",
    "robustness",
    "focus",
    "vitality"
];