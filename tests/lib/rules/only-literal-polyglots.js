/**
 * @fileoverview Only literals should be polyglots
 * @author Damien Cassou
 * @copyright 2016 Damien Cassou. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/only-literal-polyglots"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("only-literal-polyglots", rule, {
	valid: [
		{
			code: "_('A literal is ok');",
		},
	],

	invalid: [
		{
			code: "_()",
			errors: [
				{
					messageId: "one-argument",
					type: "CallExpression",
				},
			],
		},
		{
			code: "_(myvar)",
			errors: [
				{
					messageId: "no-variable",
					type: "CallExpression",
				},
			],
		},
		{
			code: "_('foo' + 'bar')",
			errors: [
				{
					messageId: "no-concatenation",
					type: "CallExpression",
				},
			],
		},
		{
			code: "_('foo' || 'bar')",
			errors: [
				{
					messageId: "no-concatenation",
					type: "CallExpression",
				},
			],
		},
		{
			code: "_('foo' - 'bar')",
			errors: [
				{
					messageId: "fishy",
					type: "CallExpression",
				},
			],
		},
		{
			code: "_(my.bar)",
			errors: [
				{
					messageId: "no-member-translation",
					type: "CallExpression",
				},
			],
		},
		{
			code: "_('foo' ? 'bar' : 'baz')",
			errors: [
				{
					messageId: "unknown-type",
					type: "CallExpression",
					data: { type: "ConditionalExpression" },
				},
			],
		},
	],
});
