/**
 * @fileoverview All implementations of my.initialize should perform a super call.
 * @author Nicolas Petton & Benjamin Van Ryseghem
 * @copyright 2016 Nicolas Petton & Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ensure-super-calls-in-initialize"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ensure-super-calls-in-initialize", rule, {

	valid: [
		{
			code: "my.initialize = function(spec) {my.super(spec);}"
		},
		{
			code: "my.initialize = function(spec) {var a = 1; my.super(spec); return a;}"
		}
	],

	invalid: [
		{
			code: "my.initialize = function(spec) {}",
			errors: [
				{
					message: "super call not performed in `my.initialize`.",
					type: "ExpressionStatement"
				}
			]
		},
		{
			code: "my.initialize = function(spec) {var a = 1; return a;}",
			errors: [
				{
					message: "super call not performed in `my.initialize`.",
					type: "ExpressionStatement"
				}
			]
		},
		{
			code: "my.initialize = function(spec) {my.super();}",
			errors: [
				{
					message: "spec argument missing from super call.",
					type: "CallExpression"
				}
			]
		}
	]
});
