import { createInterface } from 'readline';

// Data
interface ArmorPiece {
  name: string;
  weight: number;
  poise: number;
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
    return pieces.filter(piece => piece.weight <= maxWeight);
}

// Function to find armor combinations
function findArmorCombinations(
  availableLoad: number,
  includedTypes: string[],
  rollType: RollType
): ArmorPiece[][] {
  const combinations: { combination: ArmorPiece[]; totalPoise: number }[] = [];

  // Generate combinations recursively
  const generateCombinations = (
    types: string[],
    currentCombination: ArmorPiece[],
    currentIndex: number
  ) => {
    if (currentIndex === types.length) {
      const totalWeight = currentCombination.reduce((sum, piece) => sum + piece.weight, 0);
      const totalPoise = currentCombination.reduce((sum, piece) => sum + piece.poise, 0);

      // Check weight based on roll type
      let isWeightValid = false;
      switch (rollType) {
        case RollType.Light:
          isWeightValid = totalWeight <= availableLoad * 0.299;
          break;
        case RollType.Medium:
          isWeightValid = totalWeight <= availableLoad * 0.699;
          break;
        case RollType.Heavy:
          isWeightValid = totalWeight <= availableLoad * 0.999;
          break;
      }

      if (isWeightValid) {
        combinations.push({ combination: [...currentCombination], totalPoise });
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

    availablePieces = filterArmorPieces(availablePieces, availableLoad);
    for (const piece of availablePieces) {
      generateCombinations(types, [...currentCombination, piece], currentIndex + 1);
    }
  };

  generateCombinations(includedTypes, [], 0);

  // Group combinations by poise
  const combinationsByPoise: { [poise: number]: ArmorPiece[][] } = {};
  for (const { combination, totalPoise } of combinations) {
    if (!combinationsByPoise[totalPoise]) {
      combinationsByPoise[totalPoise] = [];
    }
    combinationsByPoise[totalPoise].push(combination);
  }

  // Find the highest poise
  const highestPoise = Math.max(...Object.keys(combinationsByPoise).map(Number));

  // Return all combinations with the highest poise
  return combinationsByPoise[highestPoise] || [];
}

// Main function
async function main() {
  const maxEquipLoadStr = await askQuestion("Enter your maximum equip load: ");
  const maxEquipLoad = parseFloat(maxEquipLoadStr);

  const currentEquipLoadStr = await askQuestion("Enter your current equip load (excluding armor): ");
  const currentEquipLoad = parseFloat(currentEquipLoadStr);

  const availableLoad = maxEquipLoad - currentEquipLoad;

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
    availableLoad,
    includedTypes,
    rollType
  );

  if (bestCombinations.length > 0) {
    console.log("\nArmor Combinations with Highest Poise:");
    bestCombinations.forEach((combination, index) => {
      console.log(`\nCombination ${index + 1}:`);
      combination.forEach((piece) => {
        console.log(
          `${piece.name} - Weight: ${piece.weight}, Poise: ${piece.poise}`
        );
      });
      const totalWeight = combination.reduce((sum, piece) => sum + piece.weight, 0);
      const totalPoise = combination.reduce((sum, piece) => sum + piece.poise, 0);
      console.log(`Total Weight: ${totalWeight}`);
      console.log(`Total Poise: ${totalPoise}`);
    });
  } else {
    console.log("No suitable armor combinations found.");
  }

  rl.close();
}

main();