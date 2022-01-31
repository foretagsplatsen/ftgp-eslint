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

var ruleTester = new RuleTester();
ruleTester.run("no-class-name-template", rule, {
    valid: [
		{ code: "f({className: \"foo\"})" },
		{ code: `f({className: 'foo'})` },
		{
			code: "f({className: `foo-${plip}`})",
			parserOptions: { ecmaVersion: 6 },
		},
    ],

    invalid: [
		{
			code: "f({className: `foo bar`})",
			parserOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			output: `f({className: ["foo", "bar"]})`
		},
		{
			code: "f({className: `foo ${plip}`})",
			parserOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			output: `f({className: ["foo", plip]})`
		},
		{
			code: "f({className: `foo bar-${plip}`})",
			parserOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			output: 'f({className: ["foo", `bar-${plip}`]})'
		},
		{
			code: "f({className: `foo ${plip}-bar`})",
			parserOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			output: 'f({className: ["foo", `${plip}-bar`]})'
		},
		{
			code: "f({className: `foo bar-${plip}-baz`})",
			parserOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			output: 'f({className: ["foo", `bar-${plip}-baz`]})'
		},
		{
			code: "f({className: `foo bar-${plip}-baz plop`})",
			parserOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			output: 'f({className: ["foo", `bar-${plip}-baz`, "plop"]})'
		},
		{
			code: "f({className: `${plip}\n\t${plop}`})",
			parserOptions: { ecmaVersion: 6 },
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			output: 'f({className: [plip, plop]})'
		},
		{
			code: "f({className: `foo ${isDisabled ? \"disabled\" : \"\"}`})",
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({className: ["foo", isDisabled ? "disabled" : ""]})`
		},
		{
			code: "f({fooboo: `foo ${isDisabled ? \"disabled\" : \"\"}`})",
			options: [
				{
					keywords: ["fooboo"]
				}
			],
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({fooboo: ["foo", isDisabled ? "disabled" : ""]})`
		},
		{
			code: "f({fooboo: [`foo ${isDisabled ? \"disabled\" : \"\"}`]})",
			options: [
				{
					keywords: ["fooboo"]
				}
			],
			errors: [
				{
					message: "Template strings with multiple classes are not accepted as class name value.",
					type: "TemplateLiteral"
				},
			],
			parserOptions: { ecmaVersion: 6 },
			output: `f({fooboo: [["foo", isDisabled ? "disabled" : ""]]})`
		} ,
    ]
});
