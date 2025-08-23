module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/__tests__/**",
    "!src/__mocks__/**",
    "!src/index.ts",
  ],
  coverageReporters: ["text", "lcov", "html"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testTimeout: 10000,
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
};