import { ArmorPiece, RollType, ArmorData } from './types';
import { armorData } from './armor-data'; // Import armorData

// Function to filter armor pieces
export function filterArmorPieces(pieces: ArmorPiece[], maxWeight: number, availabilityFilter: string): ArmorPiece[] {
    return pieces.filter(piece =>
        typeof piece.weight === 'number' &&
        piece.weight <= maxWeight &&
        (availabilityFilter === 'all' || piece.available.toLowerCase() === availabilityFilter.toLowerCase()) // Case-insensitive comparison
    );
}

// Function to calculate stat scores
export function calculateStatScores(combination: ArmorPiece[], stats: string[]): { [stat: string]: number } {
    const scores: { [stat: string]: number } = {};

    for (const stat of stats) {
        scores[stat] = 0;
        for (const piece of combination) {
            if (stat === 'negation') {
                scores[stat] += (piece['phy'] as number || 0) + (piece['vsStrike'] as number || 0) +
                    (piece['vsSlash'] as number || 0) + (piece['vsPierce'] as number || 0) +
                    (piece['magic'] as number || 0) + (piece['fire'] as number || 0) +
                    (piece['ligt'] as number || 0) + (piece['holy'] as number || 0);
            } else if (stat === 'resistance') {
                scores[stat] += (piece['immunity'] as number || 0) + (piece['robustness'] as number || 0) +
                    (piece['focus'] as number || 0) + (piece['vitality'] as number || 0);
            } else if (typeof piece[stat] === 'number') {
                scores[stat] += piece[stat] as number;
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
            const armorWeight = currentCombination.reduce((sum, piece) => {
                return typeof piece.weight === 'number' ? sum + piece.weight : sum;
            }, 0);
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