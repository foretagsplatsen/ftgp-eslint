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
ruleTester.run("only-single-class-name-in-array", rule, {
	valid: [
		{ code: `f({className: ["foo"]})` },
		{ code: `f({className: 'foo bar'})` },
	],

	invalid: [
		{
			code: `f({className: ["foo bar"]})`,
			errors: [
				{
					message: "Only one class per string allowed inside an array.",
					type: "Literal"
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo", "bar"]})`
		},
	]
});
