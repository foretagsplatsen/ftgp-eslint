/**
 * @fileoverview Don't use arrays inside arrays to specify CSS classes
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-class-name-array-nesting"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

const error = {
	messageId: "message",
	type: "ArrayExpression",
};

ruleTester.run("no-class-name-array-nesting", rule, {
	valid: [
		{ code: 'f({className: "foo"})' },
		{ code: `f({className: ['foo']})` },
		{
			code: `f({cssClass: ['foo']})`,
			options: [{ keywords: ["cssClass"] }],
		},
	],

	invalid: [
		{
			code: `f({className: ["foo", ["bar"]]})`,
			errors: [error],
			output: `f({className: ["foo", "bar"]})`,
		},
		{
			code: `f({className: ["foo", ["bar"], ["baz"]]})`,
			errors: [error, error],
			output: `f({className: ["foo", "bar", "baz"]})`,
		},
		{
			code: `f({cssClass: ["foo", ["bar"]]})`,
			options: [{ keywords: ["cssClass"] }],
			errors: [error],
			output: `f({cssClass: ["foo", "bar"]})`,
		},
	],
});
