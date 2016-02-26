/**
 * @fileoverview All define should at least have 2 arguments
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-define-with-less-than-2-arguments"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-define-with-less-than-2-arguments", rule, {

	valid: [
		{
			code: 'define([], function(){});'
		},
		{
			code: 'define("name", [], function(){});'
		}
	],

	invalid: [
		{
			code: "define(function(){});",
			errors: [
				{
					message: "`define` must have at least two arguments.",
					type: "CallExpression"
				}
			]
		}
	]
});
