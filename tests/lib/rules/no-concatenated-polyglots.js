/**
 * @fileoverview Does not allow polyglot translation to be concatenated
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-concatenated-polyglots"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

const error = {
	messageId: "message",
	type: "CallExpression",
};

ruleTester.run("no-concatenated-polyglots", rule, {
	valid: [
		{
			code: "_('text')",
		},
		{
			code: "_('text more text')",
		},
	],

	invalid: [
		{
			code: "_('text') + 'more text'",
			errors: [error],
		},
		{
			code: "_('text') + _('more text')",
			errors: [error, error],
		},
		{
			code: "_('text') + more;",
			errors: [error],
		},
	],
});
