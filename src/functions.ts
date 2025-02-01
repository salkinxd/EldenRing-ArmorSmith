import { ArmorPiece, RollType } from './types';
import { armorData } from './armor-data';

// Function to filter armor pieces
export function filterArmorPieces(pieces: ArmorPiece[], maxWeight: number, availabilityFilter: string): ArmorPiece[] {
    return pieces.filter(piece =>
        piece.weight <= maxWeight &&
        (availabilityFilter === 'all' || piece.available.toLowerCase() === availabilityFilter.toLowerCase())
    );
}

// Function to calculate stat scores
export function calculateStatScores(combination: ArmorPiece[], stats: string[]): { [stat: string]: number } {
    const scores: { [stat: string]: number } = {};

    for (const stat of stats) {
        scores[stat] = 0;
        for (const piece of combination) {
            // Use a switch statement to handle each stat correctly
            switch (stat) {
                case 'poise':
                    scores[stat] += piece.poise;
                    break;
                case 'physical':
                    scores[stat] += piece.physical;
                    break;
                case 'vsStrike':
                    scores[stat] += piece.vsStrike;
                    break;
                case 'vsSlash':
                    scores[stat] += piece.vsSlash;
                    break;
                case 'vsPierce':
                    scores[stat] += piece.vsPierce;
                    break;
                case 'magic':
                    scores[stat] += piece.magic;
                    break;
                case 'fire':
                    scores[stat] += piece.fire;
                    break;
                case 'lightning':
                    scores[stat] += piece.lightning;
                    break;
                case 'holy':
                    scores[stat] += piece.holy;
                    break;
                case 'immunity':
                    scores[stat] += piece.immunity;
                    break;
                case 'robustness':
                    scores[stat] += piece.robustness;
                    break;
                case 'focus':
                    scores[stat] += piece.focus;
                    break;
                case 'vitality':
                    scores[stat] += piece.vitality;
                    break;
                case 'negation':
                    scores[stat] += piece.physical + piece.vsStrike + piece.vsSlash + piece.vsPierce +
                                     piece.magic + piece.fire + piece.lightning + piece.holy;
                    break;
                case 'resistance':
                    scores[stat] += piece.immunity + piece.robustness + piece.focus + piece.vitality;
                    break;
            }
        }
    }

    return scores;
}

// Function to find armor combinations
export function findArmorCombinations(
    maxEquipLoad: number,
    currentEquipLoad: number,
    includedTypes: string[],
    rollType: RollType,
    stats: string[],
    availabilityFilter: string
): { combination: ArmorPiece[]; statScores: { [stat: string]: number }; headroom: number }[] {
    const combinations: { combination: ArmorPiece[]; statScores: { [stat: string]: number }; headroom: number }[] = [];

    // Generate combinations recursively
    const generateCombinations = (
        types: string[],
        currentCombination: ArmorPiece[],
        currentIndex: number
    ) => {
        if (currentIndex === types.length) {
            const armorWeight = currentCombination.reduce((sum, piece) => sum + piece.weight, 0);
            const totalWeight = armorWeight + currentEquipLoad;

            // Check weight based on roll type
            let isWeightValid = false;
            let maxAllowedWeight: number;
            switch (rollType) {
                case RollType.Light:
                    maxAllowedWeight = maxEquipLoad * 0.299;
                    isWeightValid = totalWeight <= maxAllowedWeight;
                    break;
                case RollType.Medium:
                    maxAllowedWeight = maxEquipLoad * 0.699;
                    isWeightValid = totalWeight <= maxAllowedWeight;
                    break;
                case RollType.Heavy:
                    maxAllowedWeight = maxEquipLoad * 0.999;
                    isWeightValid = totalWeight <= maxAllowedWeight;
                    break;
            }

            if (isWeightValid) {
                const headroom = maxAllowedWeight - totalWeight;
                const statScores = calculateStatScores(currentCombination, stats);
                combinations.push({ combination: [...currentCombination], statScores, headroom });
            }
            return;
        }

        const currentType = types[currentIndex];
        let availablePieces: ArmorPiece[] = [];

        switch (currentType) {
            case 'helm':
                availablePieces = armorData.helms;
                break;
            case 'chest':
                availablePieces = armorData.chests;
                break;
            case 'gauntlets':
                availablePieces = armorData.gauntlets;
                break;
            case 'legs':
                availablePieces = armorData.legs;
                break;
        }

        const maxAllowedArmorWeight = maxEquipLoad - currentEquipLoad;
        availablePieces = filterArmorPieces(availablePieces, maxAllowedArmorWeight, availabilityFilter);
        for (const piece of availablePieces) {
            generateCombinations(types, [...currentCombination, piece], currentIndex + 1);
        }
    };

    generateCombinations(includedTypes, [], 0);

    // Sort combinations by the specified stats
    combinations.sort((a, b) => {
        for (const stat of stats) {
            const scoreA = a.statScores[stat] || 0;
            const scoreB = b.statScores[stat] || 0;
            if (scoreA !== scoreB) {
                return scoreB - scoreA; // Sort descending
            }
        }
        return b.headroom - a.headroom;
    });

    return combinations;
}