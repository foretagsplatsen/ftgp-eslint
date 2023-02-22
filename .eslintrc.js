module.exports = {
	extends: [
		"eslint:recommended",
		"prettier",
		"plugin:prettier/recommended",
		"plugin:eslint-plugin/recommended",
	],
	env: {
		es2021: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "script",
	},
	rules: {
		"object-shorthand": ["error", "properties"],
	},
	ignorePatterns: [],
};
