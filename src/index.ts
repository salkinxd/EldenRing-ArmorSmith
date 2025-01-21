import { RollType, ArmorPiece } from './types';
import { findArmorCombinations } from './functions';
import { armorData } from './armor-data';
import { askQuestion, getNumberInput, getRollTypeInput, getStringArrayInput } from './input';
import { displayCombinations } from './output';

// Main function
async function main() {
    const maxEquipLoad = await getNumberInput("Enter your maximum equip load: ");
    const currentEquipLoad = await getNumberInput("Enter your current equip load (excluding armor): ");
    const includedTypes = await getStringArrayInput("Enter the armor types to include (e.g., 'helm chest gauntlets legs'), separated by spaces: ");
    const rollType = await getRollTypeInput();
    const stats = await getStringArrayInput("Enter the stats to prioritize (e.g., 'poise negation resistance'), separated by spaces: ");
    const numCombinations = await getNumberInput("How many top combinations do you want to see? ");
    const availabilityFilter = await askQuestion("Enter availability filter ('all', 'Base Game', or 'Shadow of the Erdtree DLC'): ");

    const bestCombinations = findArmorCombinations(
        maxEquipLoad,
        currentEquipLoad,
        includedTypes,
        rollType,
        stats,
        availabilityFilter
    );

    displayCombinations(bestCombinations, numCombinations, stats, currentEquipLoad, rollType, maxEquipLoad);

    process.exit();
}

main();