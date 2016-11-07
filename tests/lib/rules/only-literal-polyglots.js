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
			code: "_('A literal is ok');"
		}
	],

	invalid: [
		{
			code: "_()",
			errors: [
				{
					message: "Polyglot should have at least one argument",
					type: "CallExpression"
				}
			]
		},
		{
			code: "_(myvar)",
			errors: [
				{
					message: "No variable should be passed. Inline `myvar`",
					type: "CallExpression"
				}
			]
		},
		{
			code: "_('foo' + 'bar')",
			errors: [
				{
					message: "Replace concatenation of polyglots with template",
					type: "CallExpression"
				}
			]
		},
		{
			code: "_('foo' || 'bar')",
			errors: [
				{
					message: "Replace concatenation of polyglots with template",
					type: "CallExpression"
				}
			]
		},
		{
			code: "_('foo' - 'bar')",
			errors: [
				{
					message: "It looks like there is something fishy with the polyglot",
					type: "CallExpression"
				}
			]
		},
		{
			code: "_(my.bar)",
			errors: [
				{
					message: "Translating a member looks like a bad idea. Maybe a switch case could do it?",
					type: "CallExpression"
				}
			]
		},
		{
			code: "_('foo' ? 'bar' : 'baz')",
			errors: [
				{
					message: "Unknown Type: ConditionalExpression",
					type: "CallExpression"
				}
			]
		}
	]
});
