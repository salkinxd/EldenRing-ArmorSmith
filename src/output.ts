import { ArmorPiece, RollType } from './types';

export async function displayCombinations(
  bestCombinations: {
    combination: ArmorPiece[];
    statScores: { [stat: string]: number };
    headroom: number;
  }[],
  numCombinations: number,
  stats: string[],
  currentEquipLoad: number,
  rollType: RollType,
  maxEquipLoad: number,
  availabilityFilter: string,
  chalk: any
) {
  if (bestCombinations.length > 0) {
    console.log(chalk.yellow(`\nTop ${numCombinations} Armor Combinations (Ranked by ${stats.join(", ")}, availability: ${availabilityFilter}):`));
    for (let i = 0; i < Math.min(numCombinations, bestCombinations.length); i++) {
      const { combination, statScores, headroom } = bestCombinations[i];
      console.log(chalk.yellow(`\nCombination ${i + 1}:`));
      // Add a line
      console.log(chalk.blue('-'.repeat(process.stdout.columns)));
      combination.forEach((piece) => {
        console.log(
          chalk.cyan(`${piece.name}`) +
          ` - Weight: ${piece.weight}, ` +
          `Poise: ${piece.poise}, ` +
          `Physical: ${piece.physical}, ` +
          `VS Strike: ${piece.vsStrike}, ` +
          `VS Slash: ${piece.vsSlash}, ` +
          `VS Pierce: ${piece.vsPierce}, ` +
          `Magic: ${piece.magic}, ` +
          `Fire: ${piece.fire}, ` +
          `Lightning: ${piece.lightning}, ` +
          `Holy: ${piece.holy}, ` +
          `Immunity: ${piece.immunity}, ` +
          `Robustness: ${piece.robustness}, ` +
          `Focus: ${piece.focus}, ` +
          `Vitality: ${piece.vitality}, ` +
          `Available: ${piece.available}`
        );
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

      console.log(chalk.magenta(`Current Equip Load: ${currentEquipLoad}`));
      console.log(chalk.magenta(`Armor Weight: ${armorWeight}`));
      console.log(chalk.magenta(`Total Weight (with current equip load): ${totalWeight}`));
      console.log(chalk.magenta(`Headroom for ${RollType[rollType]} roll: ${headroom.toFixed(2)} (Max allowed: ${maxAllowedWeight.toFixed(2)})`));

      // Log the scores for the specified stats
      for (const stat of stats) {
        console.log(chalk.green(`${stat}: ${statScores[stat]}`));
      }
      // Add a line
      console.log(chalk.blue('-'.repeat(process.stdout.columns)));
    };
  } else {
    console.log(chalk.red("No suitable armor combinations found."));
  }
}