import { createInterface } from 'readline';

// Data
interface ArmorPiece {
  name: string;
  weight: number;
  [stat: string]: number | string; // Allow any stat property
}

interface ArmorData {
  helms: ArmorPiece[];
  chests: ArmorPiece[];
  gauntlets: ArmorPiece[];
  legs: ArmorPiece[];
}

const armorData: ArmorData = require('./armorData.json');

// Roll Types
enum RollType {
  Light,
  Medium,
  Heavy,
}

// User Input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to filter armor pieces
function filterArmorPieces(pieces: ArmorPiece[], maxWeight: number): ArmorPiece[] {
    return pieces.filter(piece => typeof piece.weight === 'number' && piece.weight <= maxWeight);
}

// Corrected function to calculate stat scores
function calculateStatScores(combination: ArmorPiece[], stats: string[]): { [stat: string]: number } {
  const scores: { [stat: string]: number } = {};

  for (const stat of stats) {
    scores[stat] = 0;
    for (const piece of combination) {
      // Access sub-stats for damage negation and resistance
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
function findArmorCombinations(
  maxEquipLoad: number,
  currentEquipLoad: number,
  includedTypes: string[],
  rollType: RollType,
  stats: string[]
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
    availablePieces = filterArmorPieces(availablePieces, maxAllowedArmorWeight);
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

// Main function
async function main() {
  const maxEquipLoadStr = await askQuestion("Enter your maximum equip load: ");
  const maxEquipLoad = parseFloat(maxEquipLoadStr);

  const currentEquipLoadStr = await askQuestion("Enter your current equip load (excluding armor): ");
  const currentEquipLoad = parseFloat(currentEquipLoadStr);

  const includedTypesStr = await askQuestion(
    "Enter the armor types to include (e.g., 'helm chest gauntlets legs'), separated by spaces: "
  );
  const includedTypes = includedTypesStr.toLowerCase().split(" ");

  const rollTypeStr = await askQuestion("Enter your desired roll type (light, medium, heavy): ");
  let rollType: RollType;
  switch (rollTypeStr.toLowerCase()) {
    case "light":
      rollType = RollType.Light;
      break;
    case "medium":
      rollType = RollType.Medium;
      break;
    case "heavy":
      rollType = RollType.Heavy;
      break;
    default:
      console.log("Invalid roll type. Defaulting to medium.");
      rollType = RollType.Medium;
  }

  const statsStr = await askQuestion(
    "Enter the stats to prioritize (e.g., 'poise negation resistance'), separated by spaces: "
  );
  const stats = statsStr.toLowerCase().split(" ");

  const numCombinationsStr = await askQuestion("How many top combinations do you want to see? ");
  const numCombinations = parseInt(numCombinationsStr, 10);

  const bestCombinations = findArmorCombinations(
    maxEquipLoad,
    currentEquipLoad,
    includedTypes,
    rollType,
    stats
  );

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
      console.log(`Headroom for ${rollTypeStr} roll: ${headroom.toFixed(2)} (Max allowed: ${maxAllowedWeight.toFixed(2)})`);

      // Log the scores for the specified stats
      for (const stat of stats) {
        console.log(`${stat}: ${statScores[stat]}`);
      }
    };
  } else {
    console.log("No suitable armor combinations found.");
  }

  rl.close();
}

main();