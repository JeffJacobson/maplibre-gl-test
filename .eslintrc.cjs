module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:jsdoc/recommended-typescript",
    "prettier",
  ],
  overrides: [],
  ignorePatterns: ["dist", "*.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
    // ecmaVersion: "latest",
    // sourceType: "module",
  },
  plugins: ["@typescript-eslint", "jsdoc"],
  rules: {},
};
