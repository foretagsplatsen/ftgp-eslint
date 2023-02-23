/**
 * @fileoverview Don't over-complicate expressions to specify CSS classes
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-class-name-useless.js"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-class-name-useless", rule, {
	valid: [
		{ code: 'f({className: "foo"})' },
		{ code: 'f({className: "foo bar"})' },
		{ code: `f({className: ['foo', {bar: baz}]})` },
		{ code: `f({className: {foo: foobar}})` },
		{
			code: `f({cssClass: {foo: foobar}})`,
			options: [{ keywords: ["cssClass"] }],
		},
	],

	invalid: [
		{
			code: `f({className: ["foo", "bar"]})`,
			errors: [
				{
					messageId: "array-with-only-literals",
					type: "ArrayExpression",
				},
			],
			output: `f({className: "foo bar"})`,
		},
		{
			code: `f({className: ["foo", 54]})`,
			errors: [
				{
					messageId: "array-with-only-literals",
					type: "ArrayExpression",
				},
			],
			output: `f({className: "foo 54"})`,
		},
		// eslint-disable-next-line eslint-plugin/consistent-output -- The rule doesn't have any fix in this case
		{
			code: `f({className: []})`,
			errors: [
				{
					messageId: "empty-array",
					type: "ArrayExpression",
				},
			],
		},
		{
			code: "f({className: [{foo}]})",
			errors: [
				{
					messageId: "singleton",
					type: "ArrayExpression",
				},
			],
			output: "f({className: {foo}})",
		},
		{
			code: `f({className: {foo: true}})`,
			errors: [
				{
					messageId: "superfluous-literal",
					type: "ObjectExpression",
				},
			],
			output: `f({className: ["foo"]})`,
		},
		{
			code: `f({className: {foo: true, bar: baz}})`,
			errors: [
				{
					messageId: "superfluous-literal",
					type: "ObjectExpression",
				},
			],
			output: `f({className: ["foo", {bar: baz}]})`,
		},
		{
			code: `f({className: {foo: false}})`,
			errors: [
				{
					messageId: "superfluous-literal",
					type: "ObjectExpression",
				},
			],
			output: `f({className: {}})`,
		},
		{
			code: `f({className: {foo: false, bar: baz}})`,
			errors: [
				{
					messageId: "superfluous-literal",
					type: "ObjectExpression",
				},
			],
			output: `f({className: {bar: baz}})`,
		},
		{
			code: `f({className: {"foo": "bar"}})`,
			errors: [
				{
					messageId: "superfluous-literal",
					type: "ObjectExpression",
				},
			],
			output: `f({className: ["foo"]})`,
		},
		{
			code: `f({className: {"foo": 42}})`,
			errors: [
				{
					messageId: "superfluous-literal",
					type: "ObjectExpression",
				},
			],
			output: `f({className: ["foo"]})`,
		},
		{
			code: `f({className: ["foo", {}]})`,
			errors: [
				{
					messageId: "empty-object",
					type: "ObjectExpression",
				},
			],
			output: `f({className: ["foo", ]})`,
		},
		// eslint-disable-next-line eslint-plugin/consistent-output -- The rule doesn't have any fix in this case
		{
			code: `f({className: {}})`,
			errors: [
				{
					messageId: "empty-object",
					type: "ObjectExpression",
				},
			],
		},
		{
			code: `f({className: " foo"})`,
			errors: [
				{
					messageId: "leading-trailing-space",
					type: "Literal",
				},
			],
			output: `f({className: "foo"})`,
		},
		{
			code: `f({className: {" foo": bar()}})`,
			errors: [
				{
					messageId: "leading-trailing-space",
					type: "Literal",
				},
			],
			output: `f({className: {"foo": bar()}})`,
		},
		{
			code: `f({cssClass: ["foo", "bar"]})`,
			options: [{ keywords: ["cssClass"] }],
			errors: [
				{
					messageId: "array-with-only-literals",
					type: "ArrayExpression",
				},
			],
			output: `f({cssClass: "foo bar"})`,
		},
	],
});
