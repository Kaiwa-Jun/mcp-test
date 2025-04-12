const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // next.config.jsとテスト環境用の.envファイルが配置されたディレクトリへのパス
  dir: "./",
});

// Jestに渡すカスタム設定
const customJestConfig = {
  // テストファイルのパターンを指定
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  // テスト環境のセットアップモジュール
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // テスト対象から除外するディレクトリ
  moduleNameMapper: {
    // aliasの設定（Next.jsの@/importに対応）
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  // カバレッジの設定
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 30,
      statements: 25,
    },
  },
};

// createJestConfigはNext.jsの設定からカスタムの設定を読み取り、
// Next.jsとJest間で互換性のある設定を作成します
module.exports = createJestConfig(customJestConfig);
