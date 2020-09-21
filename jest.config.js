module.exports = {
	preset: 'ts-jest',
	testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|js)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testEnvironment: 'node',
	collectCoverageFrom: ['src/**/*.{ts,tsx}'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80
		}
	}
};
