module.exports = {
    extends: ["eslint:recommended", "prettier", "plugin:prettier/recommended"],
  env: {
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script",
  },
    rules: {},
    ignorePatterns: []
};
