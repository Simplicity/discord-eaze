module.exports = {
  extends: ["airbnb-typescript/base", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    allowImportExportEverywhere: true,
    ecmaVersion: 2020,
    sourceType: "module"
  },
  ignorePatterns: ["dist/", "node_modules/"],
  rules: {
    "no-param-reassign": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-underscore-dangle": "off",
    "consistent-return": "off",
    "import/no-cycle": "off",
    "class-methods-use-this": "off"
  }
};
