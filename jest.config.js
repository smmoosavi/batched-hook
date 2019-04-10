module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '(/test/.*\\.test.tsx?)$',
  collectCoverage: true,
  setupFilesAfterEnv: [
    './test/setupTest.ts'
  ],
};
