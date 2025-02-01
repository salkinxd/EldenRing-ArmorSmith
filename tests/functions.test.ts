import { calculateStatScores, findArmorCombinations, filterArmorPieces } from '../src/functions';
import { ArmorPiece, RollType } from '../src/types';
import { armorData } from '../src/armor-data';

describe('Armor Optimizer Functions', () => {
  const mockArmorPiece: ArmorPiece = {
    name: 'Mock Armor',
    weight: 5,
    available: 'Base Game',
    poise: 10,
    physical: 5,
    vsStrike: 5,
    vsSlash: 5,
    vsPierce: 5,
    magic: 5,
    fire: 5,
    lightning: 5,
    holy: 5,
    immunity: 5,
    robustness: 5,
    focus: 5,
    vitality: 5,
  };

  describe('calculateStatScores', () => {
    it('should calculate stat scores correctly for a given combination and stats', () => {
      const combination = [mockArmorPiece];
      const stats = ['poise', 'negation', 'resistance'];
      const expectedScores = {
        poise: 10,
        negation: 40,
        resistance: 20
      };
      const result = calculateStatScores(combination, stats);
      expect(result).toEqual(expectedScores);
    });
  });

  describe('findArmorCombinations', () => {
    it('should return sorted armor combinations based on stats and headroom', () => {
      const maxEquipLoad = 50;
      const currentEquipLoad = 10;
      const includedTypes = ['helm', 'chest'];
      const rollType = RollType.Medium;
      const stats = ['poise'];
      const availabilityFilter = 'all';

      const result = findArmorCombinations(
        maxEquipLoad,
        currentEquipLoad,
        includedTypes,
        rollType,
        stats,
        availabilityFilter
      );
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].statScores.poise).toBeGreaterThanOrEqual(result[1].statScores.poise);
    });
  });
  
  describe('filterArmorPieces', () => {
    it('should filter armor pieces based on max weight and availability', () => {
      const maxWeight = 5;
      const availabilityFilter = 'Base Game';

      const result = filterArmorPieces(armorData.helms, maxWeight, availabilityFilter);
      expect(result.every(piece => piece.weight <= maxWeight && piece.available.toLowerCase() === availabilityFilter.toLowerCase())).toBeTruthy();
    });
  });
});