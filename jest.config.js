module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/**/*.test.js', '<rootDir>/**/*.spec.js', '<rootDir>/__tests__/**/*.js'],
  testPathIgnorePatterns: ['/node_modules/', '/frontend/', '/redis-mongo-flow/'],
  transform: {},
  clearMocks: true,
  verbose: true,
  forceExit: true,
  haste: {
    ignorePattern: 'frontend'
  }
};
