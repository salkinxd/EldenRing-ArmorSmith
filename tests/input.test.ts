import {
    getValidNumberInput,
    getValidRollTypeInput,
    getValidArmorTypesInput,
    getValidStatsInput,
    getValidNumberInRangeInput,
    getValidAvailabilityInput,
  } from '../src/input';
  import { validStats, RollType } from '../src/types';
  
  // Mock the readline interface for testing
  jest.mock('readline', () => ({
    createInterface: jest.fn().mockReturnValue({
      question: jest.fn().mockImplementation((_query, callback) => {
        callback(mockInput); // Provide the mock input value
      }),
      close: jest.fn(),
    }),
  }));
  
  let mockInput: string;
  
  describe('Input Validation Functions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getValidNumberInput', () => {
      it('should return a number when given a valid number input', async () => {
        mockInput = '10';
        const result = await getValidNumberInput('Enter a number: ');
        expect(result).toBe(10);
      });
  
      it('should reject an invalid input', async () => {
        mockInput = 'abc';
        console.log = jest.fn(); // Mock console.log to avoid unnecessary output
        const promise = getValidNumberInput('Enter a number: ');
        await expect(promise).rejects.toThrow();
      });
    });
  
    describe('getValidRollTypeInput', () => {
      it('should return RollType.Light for input "light"', async () => {
        mockInput = 'light';
        const result = await getValidRollTypeInput();
        expect(result).toBe(RollType.Light);
      });
  
      it('should return RollType.Medium for input "medium"', async () => {
        mockInput = 'medium';
        const result = await getValidRollTypeInput();
        expect(result).toBe(RollType.Medium);
      });
  
      it('should return RollType.Heavy for input "heavy"', async () => {
        mockInput = 'heavy';
        const result = await getValidRollTypeInput();
        expect(result).toBe(RollType.Heavy);
      });
    });
  
    describe('getValidArmorTypesInput', () => {
      it('should return an array of valid armor types', async () => {
        mockInput = 'helm chest gauntlets legs';
        const result = await getValidArmorTypesInput();
        expect(result).toEqual(['helm', 'chest', 'gauntlets', 'legs']);
      });
    });
  
    describe('getValidStatsInput', () => {
      it('should return an array of valid stats', async () => {
        mockInput = 'poise negation resistance';
        const result = await getValidStatsInput();
        expect(result).toEqual(['poise', 'negation', 'resistance']);
      });
    });
  
    describe('getValidNumberInRangeInput', () => {
      it('should return a number within the specified range', async () => {
        mockInput = '5';
        const result = await getValidNumberInRangeInput('Enter a number between 1 and 10: ', 1, 10);
        expect(result).toBe(5);
      });
    });
  
    describe('getValidAvailabilityInput', () => {
      it('should return "all" for input "all"', async () => {
        mockInput = 'all';
        const result = await getValidAvailabilityInput();
        expect(result).toBe('all');
      });
  
      it('should return "base game" for input "base game"', async () => {
        mockInput = 'base game';
        const result = await getValidAvailabilityInput();
        expect(result).toBe('base game');
      });
  
      it('should return "shadow of the erdtree dlc" for input "shadow of the erdtree dlc"', async () => {
        mockInput = 'shadow of the erdtree dlc';
        const result = await getValidAvailabilityInput();
        expect(result).toBe('shadow of the erdtree dlc');
      });
    });
  });