/**
 * @fileoverview All polyglot should be translated
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-untranslated-polyglots"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-untranslated-polyglots", rule, {

	valid: [

		// give me some code that won't trigger a warning
	],

	invalid: [
		{
			code: "_('foo')",
			options: [
				{
					translations: require("../../fixtures/rules/no-untranslated-polyglots/swedish.js"),
					language: "sv-SE"
				}
			],
			errors: [
				{
					message: "'foo' is not translatable.",
					type: "CallExpression"
				}
			]
		}
	]
});
