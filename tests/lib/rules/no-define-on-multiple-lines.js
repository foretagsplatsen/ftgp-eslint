/**
 * @fileoverview define arguments should start on the correct line
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-define-on-multiple-lines"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-define-on-multiple-lines", rule, {

	valid: [
		{
			code: "define([], function(){});"
		},
		{
			code: "define( [],function(){});"
		},
		{
			code: "define([\n" +
			"], function(){\n" +
			"});"
		}
	],

	invalid: [
		{
			code: "define(\n[], function(){})",

			errors: [
				{
					message: "define dependency array should start on the same line that the `define` statement.",
					type: "CallExpression"
				}
			]
		},
		{
			code: "define([],\nfunction(){})",

			errors: [
				{
					message: "define callback should be define on the same line that the dependency array.",
					type: "CallExpression"
				}
			]
		}
	]
});
