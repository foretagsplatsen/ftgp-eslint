/**
 * @fileoverview Don't use space-separated string to specify CSS classes in an array
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/only-single-class-name-in-array"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

const errors = [
	{
		messageId: "message",
		type: "Literal",
	},
];

ruleTester.run("only-single-class-name-in-array", rule, {
	valid: [
		{ code: `f({className: ["foo"]})` },
		{ code: `f({className: 'foo bar'})` },
		{
			code: `f({cssClass: 'foo bar'})`,
			options: [{ keywords: ["cssClass"] }],
		},
	],

	invalid: [
		{
			code: `f({className: ["foo bar"]})`,
			errors,
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo", "bar"]})`,
		},
		{
			code: `f({cssClass: ["foo bar"]})`,
			options: [{ keywords: ["cssClass"] }],
			errors,
			parserOptions: { ecmaVersion: 6 },
			output: `f({cssClass: ["foo", "bar"]})`,
		},
	],
});
