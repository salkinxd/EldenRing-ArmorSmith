import { createInterface } from 'readline';

// Data
interface ArmorPiece {
  name: string;
  weight: number;
  poise: number;
  phy: number;
  vsStrike: number;
  vsSlash: number;
  vsPierce: number;
  magic: number;
  fire: number;
  ligt: number;
  holy: number;
  immunity: number;
  robustness: number;
  focus: number;
  vitality: number;
}

interface ArmorData {
  helms: ArmorPiece[];
  chests: ArmorPiece[];
  gauntlets: ArmorPiece[];
  legs: ArmorPiece[];
}

// Load your armor data
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
    return pieces.filter(piece => piece.weight <= maxWeight);
}

// Function to calculate stat scores
function calculateStatScores(combination: ArmorPiece[]): { negationScore: number; resistanceScore: number } {
  let negationScore = 0;
  let resistanceScore = 0;

  for (const piece of combination) {
    negationScore += piece.phy + piece.vsStrike + piece.vsSlash + piece.vsPierce +
                     piece.magic + piece.fire + piece.ligt + piece.holy;
    resistanceScore += piece.immunity + piece.robustness + piece.focus + piece.vitality;
  }

  return { negationScore, resistanceScore };
}

// Function to find armor combinations
function findArmorCombinations(
  maxEquipLoad: number,
  currentEquipLoad: number,
  includedTypes: string[],
  rollType: RollType
): { combination: ArmorPiece[]; totalPoise: number; headroom: number; negationScore: number; resistanceScore: number }[] {
  const combinations: { combination: ArmorPiece[]; totalPoise: number; headroom: number; negationScore: number; resistanceScore: number }[] = [];

  // Generate combinations recursively
  const generateCombinations = (
    types: string[],
    currentCombination: ArmorPiece[],
    currentIndex: number
  ) => {
    if (currentIndex === types.length) {
      const armorWeight = currentCombination.reduce((sum, piece) => sum + piece.weight, 0);
      const totalWeight = armorWeight + currentEquipLoad;
      const totalPoise = currentCombination.reduce((sum, piece) => sum + piece.poise, 0);

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
        const { negationScore, resistanceScore } = calculateStatScores(currentCombination);
        combinations.push({ combination: [...currentCombination], totalPoise, headroom, negationScore, resistanceScore });
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

  // Group combinations by poise
  const combinationsByPoise: { [poise: number]: { combination: ArmorPiece[]; headroom: number; negationScore: number; resistanceScore: number }[] } = {};
  for (const { combination, totalPoise, headroom, negationScore, resistanceScore } of combinations) {
    if (!combinationsByPoise[totalPoise]) {
      combinationsByPoise[totalPoise] = [];
    }
    combinationsByPoise[totalPoise].push({ combination, headroom, negationScore, resistanceScore });
  }

  // Find the highest poise
  const highestPoise = Math.max(...Object.keys(combinationsByPoise).map(Number));

  // Get combinations with the highest poise
  const highestPoiseCombinations = combinationsByPoise[highestPoise] || [];

  // Sort combinations with the highest poise by weighted score (descending)
  highestPoiseCombinations.sort((a, b) => {
    const scoreA = (2 * a.negationScore) + a.resistanceScore + a.headroom;
    const scoreB = (2 * b.negationScore) + b.resistanceScore + b.headroom;
    return scoreB - scoreA;
  });

  // Return sorted combinations with the highest poise
  return highestPoiseCombinations.map(c => ({ ...c, totalPoise: highestPoise }));
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

  const bestCombinations = findArmorCombinations(
    maxEquipLoad,
    currentEquipLoad,
    includedTypes,
    rollType
  );

  if (bestCombinations.length > 0) {
    console.log("\nArmor Combinations with Highest Poise (Ranked by Weighted Score):");
    for (const { combination, totalPoise, headroom, negationScore, resistanceScore } of bestCombinations) {
      console.log(`\nCombination:`);
      combination.forEach((piece) => {
        console.log(
          `${piece.name} - Weight: ${piece.weight}, Poise: ${piece.poise}, Phy: ${piece.phy}, VS Strike: ${piece.vsStrike}, VS Slash: ${piece.vsSlash}, VS Pierce: ${piece.vsPierce}, Magic: ${piece.magic}, Fire: ${piece.fire}, Lightning: ${piece.ligt}, Holy: ${piece.holy}, Immunity: ${piece.immunity}, Robustness: ${piece.robustness}, Focus: ${piece.focus}, Vitality: ${piece.vitality}`
        );
      });

      const armorWeight = combination.reduce((sum, piece) => sum + piece.weight, 0);
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
      console.log(`Total Poise: ${totalPoise}`);
      console.log(`Headroom for ${rollTypeStr} roll: ${headroom.toFixed(2)} (Max allowed: ${maxAllowedWeight.toFixed(2)})`);
      console.log(`Negation Score: ${negationScore}`);
      console.log(`Resistance Score: ${resistanceScore}`);
    };
  } else {
    console.log("No suitable armor combinations found.");
  }

  rl.close();
}

main();