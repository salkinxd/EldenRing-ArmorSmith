import {
  getValidNumberInput,
  getValidRollTypeInput,
  getValidArmorTypesInput,
  getValidStatsInput,
  getValidNumberInRangeInput,
  getValidAvailabilityInput,
  askQuestion
} from '../src/input.js';
import { validStats, RollType } from '../src/types.js';

// Mock the readline interface for testing
jest.mock('readline', () => ({
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn().mockImplementation((_query, callback) => {
      callback(mockInputs.shift()); // Provide the mock input value from the array
    }),
    close: jest.fn(),
  }),
}));

let mockInputs: string[];

describe('Input Validation Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getValidNumberInput', () => {
    it('should return a number when given a valid number input', async () => {
      mockInputs = ['10'];
      const result = await getValidNumberInput('Enter a number: ');
      expect(result).toBe(10);
    });

    it('should reject an invalid input and prompt again', async () => {
      mockInputs = ['abc', '20'];
      console.log = jest.fn(); // Mock console.log to avoid unnecessary output
      const result = await getValidNumberInput('Enter a number: ');
      expect(result).toBe(20);
    });
  });

  describe('getValidRollTypeInput', () => {
      it('should return RollType.Light for input "light"', async () => {
        mockInputs = ['light'];
        const result = await getValidRollTypeInput();
        expect(result).toBe(RollType.Light);
      });
    
      it('should return RollType.Medium for input "medium"', async () => {
        mockInputs = ['medium'];
        const result = await getValidRollTypeInput();
        expect(result).toBe(RollType.Medium);
      });
    
      it('should return RollType.Heavy for input "heavy"', async () => {
        mockInputs = ['heavy'];
        const result = await getValidRollTypeInput();
        expect(result).toBe(RollType.Heavy);
      });
    
      it('should reject an invalid input and prompt again', async () => {
        mockInputs = ['invalid', 'light'];
        console.log = jest.fn(); // Mock console.log
        const result = await getValidRollTypeInput();
        expect(result).toBe(RollType.Light);
      });
    });
    
    describe('getValidArmorTypesInput', () => {
      it('should return an array of valid armor types', async () => {
        mockInputs = ['helm chest gauntlets legs'];
        const result = await getValidArmorTypesInput();
        expect(result).toEqual(['helm', 'chest', 'gauntlets', 'legs']);
      });
  
      it('should reject invalid armor types and prompt again', async () => {
        mockInputs = ['invalid', 'helm chest'];
        console.log = jest.fn(); // Mock console.log
        const result = await getValidArmorTypesInput();
        expect(result).toEqual(['helm', 'chest']);
      });
    });
    
    describe('getValidStatsInput', () => {
      it('should return an array of valid stats', async () => {
        mockInputs = ['poise negation resistance'];
        const result = await getValidStatsInput();
        expect(result).toEqual(['poise', 'negation', 'resistance']);
      });
  
      it('should reject invalid stats and prompt again', async () => {
        mockInputs = ['invalid', 'poise physical'];
        console.log = jest.fn(); // Mock console.log
        const result = await getValidStatsInput();
        expect(result).toEqual(['poise', 'physical']);
      });
    });
  
    describe('getValidNumberInRangeInput', () => {
      it('should return a number within the specified range', async () => {
        mockInputs = ['5'];
        const result = await getValidNumberInRangeInput('Enter a number between 1 and 10: ', 1, 10);
        expect(result).toBe(5);
      });
  
      it('should reject a number outside the range and prompt again', async () => {
        mockInputs = ['15', '7'];
        console.log = jest.fn(); // Mock console.log
        const result = await getValidNumberInRangeInput('Enter a number between 1 and 10: ', 1, 10);
        expect(result).toBe(7);
      });
    });
  
    describe('getValidAvailabilityInput', () => {
      it('should return "all" for input "all"', async () => {
        mockInputs = ['all'];
        const result = await getValidAvailabilityInput();
        expect(result).toBe('all');
      });
  
      it('should return "base game" for input "base game"', async () => {
        mockInputs = ['base game'];
        const result = await getValidAvailabilityInput();
        expect(result).toBe('base game');
      });
  
      it('should return "shadow of the erdtree dlc" for input "shadow of the erdtree dlc"', async () => {
        mockInputs = ['shadow of the erdtree dlc'];
        const result = await getValidAvailabilityInput();
        expect(result).toBe('shadow of the erdtree dlc');
      });
  
      it('should reject an invalid input and prompt again', async () => {
        mockInputs = ['invalid', 'base game'];
        console.log = jest.fn(); // Mock console.log
        const result = await getValidAvailabilityInput();
        expect(result).toBe('base game');
      });
    });
});