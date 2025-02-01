module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transformIgnorePatterns: [
    "node_modules/(?!chalk)/" // Tell Jest to transform chalk
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Add this mapping
  },
};