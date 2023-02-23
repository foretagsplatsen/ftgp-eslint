/**
 * @fileoverview Polyglot strings should be trimmed
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-untrimmed-polyglots"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-untrimmed-polyglots", rule, {
	valid: [
		{
			code: "_('foo')",
		},
		{
			code: "_('foo bar')",
		},
	],

	invalid: [
		{
			code: "_(' foo')",
			errors: [
				{
					messageId: "message",
					type: "CallExpression",
					data: { text: " foo" },
				},
			],
		},
		{
			code: "_('foo ')",
			errors: [
				{
					messageId: "message",
					type: "CallExpression",
					data: { text: "foo " },
				},
			],
		},
		{
			code: "_(' foo ')",
			errors: [
				{
					messageId: "message",
					type: "CallExpression",
					data: { text: " foo " },
				},
			],
		},
	],
});
