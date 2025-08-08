/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['.d.ts', '.ts'], //Each test suite will only run once in dist/**/*.js format TS files will not be tested as they are a developement format
	setupFilesAfterEnv: ['<rootDir>/dist/test/setupTests.js'],
};
