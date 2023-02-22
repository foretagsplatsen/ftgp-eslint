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

var ruleTester = new RuleTester();
ruleTester.run("no-class-name-useless", rule, {
	valid: [
		{ code: 'f({className: "foo"})' },
		{ code: 'f({className: "foo bar"})' },
		{ code: `f({className: ['foo', {bar: baz}]})` },
		{ code: `f({className: {foo: foobar}})` },
	],

	invalid: [
		{
			code: `f({className: ["foo", "bar"]})`,
			errors: [
				{
					message:
						"Arrays with only literals as elements are useless.",
					type: "ArrayExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: "foo bar"})`,
		},
		{
			code: `f({className: ["foo", 54]})`,
			errors: [
				{
					message:
						"Arrays with only literals as elements are useless.",
					type: "ArrayExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: "foo 54"})`,
		},
		{
			code: `f({className: []})`,
			errors: [
				{
					message: "Empty arrays are useless.",
					type: "ArrayExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
		},
		{
			code: "f({className: [{foo}]})",
			errors: [
				{
					message: "Singleton arrays are useless.",
					type: "ArrayExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: "f({className: {foo}})",
		},
		{
			code: `f({className: {foo: true}})`,
			errors: [
				{
					message: "Literal values are superfluous.",
					type: "ObjectExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo"]})`,
		},
		{
			code: `f({className: {foo: true, bar: baz}})`,
			errors: [
				{
					message: "Literal values are superfluous.",
					type: "ObjectExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo", {bar: baz}]})`,
		},
		{
			code: `f({className: {foo: false}})`,
			errors: [
				{
					message: "Literal values are superfluous.",
					type: "ObjectExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: {}})`,
		},
		{
			code: `f({className: {foo: false, bar: baz}})`,
			errors: [
				{
					message: "Literal values are superfluous.",
					type: "ObjectExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: {bar: baz}})`,
		},
		{
			code: `f({className: {"foo": "bar"}})`,
			errors: [
				{
					message: "Literal values are superfluous.",
					type: "ObjectExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo"]})`,
		},
		{
			code: `f({className: {"foo": 42}})`,
			errors: [
				{
					message: "Literal values are superfluous.",
					type: "ObjectExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo"]})`,
		},
		{
			code: `f({className: ["foo", {}]})`,
			errors: [
				{
					message: "Empty objects are useless.",
					type: "ObjectExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo", ]})`,
		},
		{
			code: `f({className: {}})`,
			errors: [
				{
					message: "Empty objects are useless.",
					type: "ObjectExpression",
				},
			],
			parserOptions: { ecmaVersion: 6 },
		},
		{
			code: `f({className: " foo"})`,
			errors: [
				{
					message: "No leading/trailing space allowed.",
					type: "Literal",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: "foo"})`,
		},
		{
			code: `f({className: {" foo": bar()}})`,
			errors: [
				{
					message: "No leading/trailing space allowed.",
					type: "Literal",
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: {"foo": bar()}})`,
		},
	],
});
