import { findArmorCombinations } from './functions';
import {
    initializeReadline,
    closeReadline,
    getValidNumberInput,
    getValidRollTypeInput,
    getValidArmorTypesInput,
    getValidStatsInput,
    getValidNumberInRangeInput,
    getValidAvailabilityInput
} from './input';
import { displayCombinations } from './output';

// Main function
async function main() {
    initializeReadline();
    const maxEquipLoad = await getValidNumberInput("Enter your maximum equip load: ");
    const currentEquipLoad = await getValidNumberInput("Enter your current equip load (excluding armor): ");
    const includedTypes = await getValidArmorTypesInput();
    const rollType = await getValidRollTypeInput();
    const stats = await getValidStatsInput();
    const numCombinations = await getValidNumberInRangeInput("How many top combinations do you want to see? ", 1, 100);
    const availabilityFilter = await getValidAvailabilityInput();

    const bestCombinations = findArmorCombinations(
        maxEquipLoad,
        currentEquipLoad,
        includedTypes,
        rollType,
        stats,
        availabilityFilter
    );

    displayCombinations(bestCombinations, numCombinations, stats, currentEquipLoad, rollType, maxEquipLoad, availabilityFilter);

    closeReadline();
}

main();