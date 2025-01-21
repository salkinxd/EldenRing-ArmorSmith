import { createInterface } from 'readline';

// Data (You'll need to fill this in with actual game data)
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

// Load your armor data from a JSON file or define it directly in the code
const armorData: ArmorData = require('./armorData.json'); 

// Roll Types
enum RollType {
  Light,
  Medium,
  Heavy,
}

// User Input Interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask the user a question
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to filter armor pieces based on user preferences
function filterArmorPieces(pieces: ArmorPiece[], maxWeight: number): ArmorPiece[] {
    return pieces.filter(piece => piece.weight <= maxWeight);
}

// Function to find the best armor combination
function findBestArmorCombination(
  availableLoad: number,
  includedTypes: string[],
  rollType: RollType
): ArmorPiece[] | null {
  let bestCombination: ArmorPiece[] | null = null;
  let bestPoise = -1;

  // Generate all possible combinations based on includedTypes
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

      if (isWeightValid && totalPoise > bestPoise) {
        bestPoise = totalPoise;
        bestCombination = [...currentCombination];
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
  return bestCombination;
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

  const bestCombination = findBestArmorCombination(
    availableLoad,
    includedTypes,
    rollType
  );

  if (bestCombination) {
    console.log("\nBest Armor Combination:");
    bestCombination.forEach((piece) => {
      console.log(
        `${piece.name} - Weight: ${piece.weight}, Poise: ${piece.poise}`
      );
    });
    const totalWeight = bestCombination.reduce((sum, piece) => sum + piece.weight, 0);
    const totalPoise = bestCombination.reduce((sum, piece) => sum + piece.poise, 0);
    console.log(`Total Weight: ${totalWeight}`);
    console.log(`Total Poise: ${totalPoise}`);
  } else {
    console.log("No suitable armor combination found.");
  }

  rl.close();
}

main();