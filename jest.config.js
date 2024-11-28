module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': 'ts-jest', // This ensures that Jest knows how to process TypeScript files
    },
  };