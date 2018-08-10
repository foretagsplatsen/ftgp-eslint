/**
 * @fileoverview Only allows to extend `that` with functions
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ensure-only-functions-on-that"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ensure-only-functions-on-that", rule, {

	valid: [
		{
			code: "that.foo = function() {};"
		},
		{
			code: "my.foo = function() {}; that.foo = my.foo;"
		},
		{
			code: "var foo = function() {}; that.foo = foo;"
		},
		{
			code: "function foo(){}; that.foo = foo"
		},
		{
			code: "my.foo = {b : function(){}}; that.foo = my.foo.b"
		},
		{
			code: "var foo = {b : function(){}}; that.foo = foo.b"
		},
		{
			code: "that.foo = 42",
			options: [{regexps: [/42/]}]
		},
		{
			code: "that.foo = 42",
			options: [{regexps: ['42']}]
		}
	],

	invalid: [
		{
			code: "that.foo = 42",
			errors: [
				{
					message: "Assigning anything but a function to `that` is forbidden.",
					type: "Literal"
				}
			]
		},
		{
			code: "function foo(){}; var foo = 42; that.foo = foo",
			errors: [
				{
					message: "Assigning anything but a function to `that` is forbidden.",
					type: "Identifier"
				}
			]
		},
		{
			code: "my.foo = {b : 42}; that.foo = my.foo.b",
			errors: [
				{
					message: "Assigning anything but a function to `that` is forbidden.",
					type: "MemberExpression"
				}
			]
		},
		{
			code: "var foo = {b : 42}; that.foo = foo.b",
			errors: [
				{
					message: "Assigning anything but a function to `that` is forbidden.",
					type: "MemberExpression"
				}
			]
		},
		{
			code: "that.foo = 42",
			options: [{regexps: [/45/]}],
			errors: [
				{
					message: "Assigning anything but a function to `that` is forbidden.",
					type: "Literal"
				}
			]
		}
	]
});
