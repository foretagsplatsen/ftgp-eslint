/**
 * @fileoverview The path in `define` only goes down
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-dot-dot-in-define"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-dot-dot-in-define", rule, {

	valid: [
		{
			code: 'define(["./foo"]);'
		},
		{
			code: 'define(["./././foo"]);'
		},
		{
			code: 'define(["bar/./foo"]);'
		}
	],

	invalid: [
		{
			code: "define([\"../foo\"])",
			errors: [
				{
					message: "No `..` allowed in the define paths.",
					type: "Literal"
				}
			]
		},
		{
			code: "define([\"/bar/../foo\"])",
			errors: [
				{
					message: "No `..` allowed in the define paths.",
					type: "Literal"
				}
			]
		},
		{
			code: "define([\"bar/..\"])",
			errors: [
				{
					message: "No `..` allowed in the define paths.",
					type: "Literal"
				}
			]
		}
	]
});
