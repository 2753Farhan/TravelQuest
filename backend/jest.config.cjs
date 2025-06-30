module.exports = {
  preset: 'ts-jest/presets/default-esm', 
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'], 
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@use-cases/(.*)$': '<rootDir>/src/use-cases/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  globals: {
    'ts-jest': {
      useESM: true, 
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};