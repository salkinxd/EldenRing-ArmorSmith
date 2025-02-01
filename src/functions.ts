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
      scores[stat] += getStatValue(piece, stat);
    }
  }

  return scores;
}

function getStatValue(piece: ArmorPiece, stat: string): number {
  switch (stat) {
    case 'poise':
      return piece.poise;
    case 'physical':
      return piece.physical;
    case 'vsStrike':
      return piece.vsStrike;
    case 'vsSlash':
      return piece.vsSlash;
    case 'vsPierce':
      return piece.vsPierce;
    case 'magic':
      return piece.magic;
    case 'fire':
      return piece.fire;
    case 'lightning':
      return piece.lightning;
    case 'holy':
      return piece.holy;
    case 'immunity':
      return piece.immunity;
    case 'robustness':
      return piece.robustness;
    case 'focus':
      return piece.focus;
    case 'vitality':
      return piece.vitality;
    case 'negation':
      return piece.physical + piece.vsStrike + piece.vsSlash + piece.vsPierce +
        piece.magic + piece.fire + piece.lightning + piece.holy;
    case 'resistance':
      return piece.immunity + piece.robustness + piece.focus + piece.vitality;
    default:
      return 0;
  }
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

  // Use a generator function to yield combinations
  function* generateCombinations(types: string[], currentCombination: ArmorPiece[], currentIndex: number): Generator<{ combination: ArmorPiece[]; statScores: { [stat: string]: number }; headroom: number }> {
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
        yield { combination: [...currentCombination], statScores, headroom };
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
      yield* generateCombinations(types, [...currentCombination, piece], currentIndex + 1);
    }
  }

  // Collect combinations in an array
  for (const combination of generateCombinations(includedTypes, [], 0)) {
    combinations.push(combination);
  }

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