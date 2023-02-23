/**
 * @fileoverview Don't use string templates with spaces to specify CSS classes
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-class-name-template"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

const errors = [
	{
		messageId: "message",
		type: "TemplateLiteral",
	},
];

ruleTester.run("no-class-name-template", rule, {
	valid: [
		{ code: 'f({className: "foo"})' },
		{ code: `f({className: 'foo'})` },
		{ code: `f({cssClass: 'foo'})`, options: [{ keywords: ["cssClass"] }] },
		{ code: "f({className: `foo-${plip}`})" },
	],

	invalid: [
		{
			code: "f({className: `foo bar`})",
			errors,
			output: `f({className: ["foo", "bar"]})`,
		},
		{
			code: "f({className: `foo ${plip}`})",
			errors,
			output: `f({className: ["foo", plip]})`,
		},
		{
			code: "f({className: `foo bar-${plip}`})",
			errors,
			output: 'f({className: ["foo", `bar-${plip}`]})',
		},
		{
			code: "f({className: `foo ${plip}-bar`})",
			errors,
			output: 'f({className: ["foo", `${plip}-bar`]})',
		},
		{
			code: "f({className: `foo bar-${plip}-baz`})",
			errors,
			output: 'f({className: ["foo", `bar-${plip}-baz`]})',
		},
		{
			code: "f({className: `foo bar-${plip}-baz plop`})",
			errors,
			output: 'f({className: ["foo", `bar-${plip}-baz`, "plop"]})',
		},
		{
			code: "f({className: `${plip}\n\t${plop}`})",
			errors,
			output: "f({className: [plip, plop]})",
		},
		{
			code: 'f({className: `foo ${isDisabled ? "disabled" : ""}`})',
			errors,
			output: `f({className: ["foo", isDisabled ? "disabled" : ""]})`,
		},
		{
			code: 'f({fooboo: `foo ${isDisabled ? "disabled" : ""}`})',
			options: [
				{
					keywords: ["fooboo"],
				},
			],
			errors,
			output: `f({fooboo: ["foo", isDisabled ? "disabled" : ""]})`,
		},
		{
			code: 'f({fooboo: [`foo ${isDisabled ? "disabled" : ""}`]})',
			options: [
				{
					keywords: ["fooboo"],
				},
			],
			errors,
			output: `f({fooboo: [["foo", isDisabled ? "disabled" : ""]]})`,
		},
		{
			code: "f({cssClass: `foo bar`})",
			options: [{ keywords: ["cssClass"] }],
			errors,
			output: `f({cssClass: ["foo", "bar"]})`,
		},
	],
});
