/**
 * @fileoverview Don't ternary expressions to specify CSS classes
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-class-name-ternary.js"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-class-name-ternary", rule, {
	valid: [
		{ code: 'f({className: "foo"})' },
		{ code: `f({className: ['foo']})` },
		{ code: `f({className: {foo: true}})` },
	],

	invalid: [
		{
			code: 'f({className: isDisabled ? "disabled" : ""})',
			errors: [
				{
					message:
						"Conditionals are not accepted as class name value.",
					type: "ConditionalExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: {"disabled": isDisabled}})`,
		},
		{
			code: 'f({fooboo: isDisabled ? "disabled" : ""})',
			options: [
				{
					keywords: ["fooboo"],
				},
			],
			errors: [
				{
					message:
						"Conditionals are not accepted as class name value.",
					type: "ConditionalExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({fooboo: {"disabled": isDisabled}})`,
		},
		{
			code: 'f({className: isDisabled ? "" : "enabled"})',
			errors: [
				{
					message:
						"Conditionals are not accepted as class name value.",
					type: "ConditionalExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: {"enabled": !(isDisabled)}})`,
		},
		{
			code: 'f({className: isDisabled ? "disabled" : "enabled"})',
			errors: [
				{
					message:
						"Conditionals are not accepted as class name value.",
					type: "ConditionalExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: isDisabled ? "disabled" : "enabled"})`,
		},
		{
			code: 'f({className: [isDisabled ? "disabled" : ""]})',
			errors: [
				{
					message:
						"Conditionals are not accepted as class name value.",
					type: "ConditionalExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: [{"disabled": isDisabled}]})`,
		},
		{
			code: `f({className: ["foo", [isDisabled ? "disabled" : ""]]})`,
			errors: [
				{
					message:
						"Conditionals are not accepted as class name value.",
					type: "ConditionalExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo", [{"disabled": isDisabled}]]})`,
		},
		{
			code: `f({className: ["foo", [isDisabled ? foo() : ""]]})`,
			errors: [
				{
					message:
						"Conditionals are not accepted as class name value.",
					type: "ConditionalExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo", [{[foo()]: isDisabled}]]})`,
		},
		{
			code: `f({className: my.done ? "" : " active"})`,
			errors: [
				{
					message:
						"Conditionals are not accepted as class name value.",
					type: "ConditionalExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: {"active": !(my.done)}})`,
		},
	],
});
