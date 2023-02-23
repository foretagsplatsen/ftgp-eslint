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

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

const errors = [
	{
		messageId: "message",
		type: "ConditionalExpression",
	},
];

ruleTester.run("no-class-name-ternary", rule, {
	valid: [
		{ code: 'f({className: "foo"})' },
		{ code: `f({className: ['foo']})` },
		{ code: `f({className: {foo: true}})` },
	],

	invalid: [
		{
			code: 'f({className: isDisabled ? "disabled" : ""})',
			errors,
			output: `f({className: {"disabled": isDisabled}})`,
		},
		{
			code: 'f({fooboo: isDisabled ? "disabled" : ""})',
			options: [
				{
					keywords: ["fooboo"],
				},
			],
			errors,
			output: `f({fooboo: {"disabled": isDisabled}})`,
		},
		{
			code: 'f({className: isDisabled ? "" : "enabled"})',
			errors,
			output: `f({className: {"enabled": !(isDisabled)}})`,
		},
		{
			code: 'f({className: isDisabled ? "disabled" : "enabled"})',
			errors,
			output: `f({className: isDisabled ? "disabled" : "enabled"})`,
		},
		{
			code: 'f({className: [isDisabled ? "disabled" : ""]})',
			errors,
			output: `f({className: [{"disabled": isDisabled}]})`,
		},
		{
			code: `f({className: ["foo", [isDisabled ? "disabled" : ""]]})`,
			errors,
			output: `f({className: ["foo", [{"disabled": isDisabled}]]})`,
		},
		{
			code: `f({className: ["foo", [isDisabled ? foo() : ""]]})`,
			errors,
			output: `f({className: ["foo", [{[foo()]: isDisabled}]]})`,
		},
		{
			code: `f({className: my.done ? "" : " active"})`,
			errors,
			output: `f({className: {"active": !(my.done)}})`,
		},
	],
});
