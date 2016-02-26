/**
 * @fileoverview No arguments in the define callback should be unused
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-define-unused-dependency"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-define-unused-dependency", rule, {

	valid: [
		{
			code: "define([], function(a) {a();})"
		},
		{
			code: "define([a, b], function(a) { return a+b;})"
		}
	],

	invalid: [
		{
			code: "define([], function(a) {})",
			errors: [
				{
					message: "'a' is defined as dependency but never used",
					type: "Identifier"
				}
			]
		}
	]
});
