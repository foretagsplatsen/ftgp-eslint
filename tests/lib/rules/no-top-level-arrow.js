/**
 * @fileoverview Don't use fat arrow to define top-level functions
 * @author Damien Cassou
 * @copyright 2023 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-top-level-arrow.js"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 8,
		sourceType: "module"
	}
});

const errors = [
	{
		message: "Prefer the function keyword to define top-level functions.",
		type: "VariableDeclaration"
	}
];

ruleTester.run("no-top-level-arrow", rule, {
	valid: [
		{ code: 'function foo() {}' },
		{ code: 'describe("foo", () => {})' },
		{ code: 'const foo = 3;' },
		{ code: 'let foo;' },
		{ code: 'const foo = 3, bar = 4;' },
	],

	invalid: [
		{
			code: `const foo = (a) => {return a;}`,
			errors,
			output: `function foo(a) {return a;}`
		},
		{
			code: `const foo = (a) => f(a)`,
			errors,
			output: `function foo(a) {return f(a);}`
		},
		{
			code: `export const foo = () => {}`,
			errors,
			output: `export function foo() {}`
		},
		{
			code: `const foo = async () => {await bar();}`,
			errors,
			output: `async function foo() {await bar();}`
		},
		{
			code: `const foo = () => {}, bar = 3`,
			errors,
			output: `function foo() {};\nconst bar = 3`
		},
		{
			code: `let foo = () => {}`,
			errors,
			output: `function foo() {}`
		},
		{
			code: `var foo = () => {}`,
			errors,
			output: `function foo() {}`
		},
	]
});
