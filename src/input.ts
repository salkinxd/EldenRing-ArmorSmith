import { createInterface, Interface } from 'readline';
import { RollType, validStats } from './types.js';

// User Input
let rl: Interface;

export function initializeReadline(): void {
  rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function closeReadline(): void {
  rl.close();
}

export async function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    if (!rl) {
      initializeReadline();
    }
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Input validation functions
export async function getValidNumberInput(question: string): Promise<number> {
  const chalk = (await import('chalk')).default;
  while (true) {
    const input = await askQuestion(chalk.green(question));
    const num = parseFloat(input);
    if (!isNaN(num)) {
      return num;
    }
    console.log(chalk.red('Invalid input. Please enter a number.'));
  }
}

export async function getValidRollTypeInput(): Promise<RollType> {
  const chalk = (await import('chalk')).default;
  while (true) {
    const rollTypeStr = await askQuestion(
      chalk.green('Enter your desired roll type (light, medium, heavy): ')
    );
    switch (rollTypeStr.toLowerCase()) {
      case 'light':
        return RollType.Light;
      case 'medium':
        return RollType.Medium;
      case 'heavy':
        return RollType.Heavy;
      default:
        console.log(
          chalk.red(
            "Invalid roll type. Please enter 'light', 'medium', or 'heavy'."
          )
        );
    }
  }
}

export async function getValidArmorTypesInput(): Promise<string[]> {
  const chalk = (await import('chalk')).default;
  const validArmorTypes = ['helm', 'chest', 'gauntlets', 'legs'];
  while (true) {
    const typesStr = await askQuestion(
      chalk.green(
        "Enter the armor types to include (e.g., 'helm chest gauntlets legs'), separated by spaces: "
      )
    );
    const types = typesStr.toLowerCase().split(' ');
    const invalidTypes = types.filter(
      (type) => !validArmorTypes.includes(type)
    );
    if (invalidTypes.length === 0) {
      return types;
    } else {
      console.log(
        chalk.red(`Invalid armor type(s): ${invalidTypes.join(', ')}`)
      );
      console.log(
        chalk.red(`Valid armor types are: ${validArmorTypes.join(', ')}`)
      );
    }
  }
}

export async function getValidStatsInput(): Promise<string[]> {
  const chalk = (await import('chalk')).default;
  while (true) {
    const statsStr = await askQuestion(
      chalk.green(
        `Enter the stats to prioritize (e.g., 'poise negation resistance'), separated by spaces.\n` +
          `Available stats: ${validStats.join(', ')} \n`
      )
    );
    const stats = statsStr.toLowerCase().split(' ');

    // Check if all entered stats are valid
    const areStatsValid = stats.every((stat) => validStats.includes(stat));

    if (areStatsValid) {
      return stats;
    }

    console.log(
      chalk.red(
        `Invalid stat entered. Please enter valid stats from the available list: ${validStats.join(
          ', '
        )}`
      )
    );
  }
}

export async function getValidNumberInRangeInput(
  question: string,
  min: number,
  max: number
): Promise<number> {
  const chalk = (await import('chalk')).default;
  while (true) {
    const input = await askQuestion(chalk.green(question));
    const num = parseInt(input, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      return num;
    }
    console.log(
      chalk.red(`Invalid input. Please enter a number between ${min} and ${max}.`)
    );
  }
}

export async function getValidAvailabilityInput(): Promise<string> {
  const chalk = (await import('chalk')).default;
  while (true) {
    const availability = await askQuestion(
      chalk.green(
        "Enter availability filter ('all', 'Base Game', or 'Shadow of the Erdtree DLC'): "
      )
    );
    if (
      ['all', 'base game', 'shadow of the erdtree dlc'].includes(
        availability.toLowerCase()
      )
    ) {
      return availability.toLowerCase();
    }
    console.log(
      chalk.red(
        "Invalid availability. Please enter 'all', 'Base Game', or 'Shadow of the Erdtree DLC'."
      )
    );
  }
}