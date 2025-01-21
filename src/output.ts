import { ArmorPiece, RollType } from './types';

export function displayCombinations(
    bestCombinations: {
      combination: ArmorPiece[];
      statScores: { [stat: string]: number };
      headroom: number;
    }[],
    numCombinations: number,
    stats: string[],
    currentEquipLoad: number,
    rollType: RollType,
    maxEquipLoad: number
  ) {
    if (bestCombinations.length > 0) {
      console.log(`\nTop ${numCombinations} Armor Combinations (Ranked by ${stats.join(", ")}):`);
      for (let i = 0; i < Math.min(numCombinations, bestCombinations.length); i++) {
        const { combination, statScores, headroom } = bestCombinations[i];
        console.log(`\nCombination ${i + 1}:`);
        combination.forEach((piece) => {
          const pieceStats = Object.entries(piece)
            .filter(([key]) => key !== 'name')
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          console.log(`${piece.name} - ${pieceStats}`);
        });
  
        const armorWeight = combination.reduce((sum, piece) => {
          return typeof piece.weight === 'number' ? sum + piece.weight : sum;
        }, 0);
        const totalWeight = armorWeight + currentEquipLoad;
  
        // Calculate weight limits for the roll type
        let maxAllowedWeight: number;
        switch (rollType) {
          case RollType.Light:
            maxAllowedWeight = maxEquipLoad * 0.299;
            break;
          case RollType.Medium:
            maxAllowedWeight = maxEquipLoad * 0.699;
            break;
          case RollType.Heavy:
            maxAllowedWeight = maxEquipLoad * 0.999;
            break;
        }
  
        console.log(`Current Equip Load: ${currentEquipLoad}`);
        console.log(`Armor Weight: ${armorWeight}`);
        console.log(`Total Weight (with current equip load): ${totalWeight}`);
        console.log(`Headroom for ${RollType[rollType]} roll: ${headroom.toFixed(2)} (Max allowed: ${maxAllowedWeight.toFixed(2)})`);
  
        // Log the scores for the specified stats
        for (const stat of stats) {
          console.log(`${stat}: ${statScores[stat]}`);
        }
      }
    } else {
      console.log("No suitable armor combinations found.");
    }
  }