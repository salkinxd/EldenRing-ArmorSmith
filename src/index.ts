import { RollType } from './types';
import { findArmorCombinations } from './functions';
import {
    initializeReadline,
    closeReadline,
    getValidNumberInput,
    getValidRollTypeInput,
    getValidArmorTypesInput,
    getValidStatsInput,
    getValidNumberInRangeInput,
    getValidAvailabilityInput,
} from './input';
import { displayCombinations } from './output';

// Main function
async function main() {
    initializeReadline();

    // Import chalk and figlet dynamically
    const chalk = (await import('chalk')).default;
    const figlet = (await import('figlet')).default;

    // ASCII Art Title
    const textArt = figlet.textSync('Elden Ring - Armor Optimizer', {
        horizontalLayout: 'full',
    });

    // Display ASCII Art Title
    console.log(chalk.blue(textArt));

    // Add a horizontal line
    console.log(chalk.blue('━'.repeat(process.stdout.columns)));

    const maxEquipLoad = await getValidNumberInput(
        chalk.green('Enter your maximum equip load: ')
    );
    const currentEquipLoad = await getValidNumberInput(
        chalk.green('Enter your current equip load (excluding armor): ')
    );
    const includedTypes = await getValidArmorTypesInput();
    const rollType = await getValidRollTypeInput();
    const stats = await getValidStatsInput();
    const numCombinations = await getValidNumberInRangeInput(
        chalk.green('How many top combinations do you want to see? '),
        1,
        100
    );
    const availabilityFilter = await getValidAvailabilityInput();

    const bestCombinations = findArmorCombinations(
        maxEquipLoad,
        currentEquipLoad,
        includedTypes,
        rollType,
        stats,
        availabilityFilter
    );

    // Add a horizontal line
    console.log(chalk.blue('━'.repeat(process.stdout.columns)));

    await displayCombinations(
        bestCombinations,
        numCombinations,
        stats,
        currentEquipLoad,
        rollType,
        maxEquipLoad,
        availabilityFilter,
        chalk
    );

    closeReadline();
}

main();