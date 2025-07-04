// src/jest.config.js
module.exports = {
  // point back at your frontend/ folder, not src/
  rootDir: '..',

  // run in a browser-like env so React + MUI work
  testEnvironment: 'jsdom',

  // load your jest-dom matchers
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.js'],

  // transform every .js/.jsx through babel-jest
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  // extensions to look for
  moduleFileExtensions: ['js', 'jsx', 'json'],

  // ignore the nested package.json that haste complains about
  modulePathIgnorePatterns: ['<rootDir>/frontend/package.json'],
};
