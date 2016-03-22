/**
 * @fileoverview Ensure the dependencies are loaded in the correct order
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ensure-dependency-order"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ensure-dependency-order", rule, {

	valid: [
		{
			code: "define()"
		},
		{
			code: "define(['foo'])"
		},
		{
			code: "define(function(){})"
		},
		{
			code: "define(['foo/bar'], function(bar){})"
		},
		{
			code: "define(['foo/bar', 'foo'], function(bar){})"
		},
		{
			code: "define(['foo/bar'], function(barModel){})"
		},
		{
			code: "define(['jquery'], function(jQuery){})",
			options: [{jquery: "jQuery"}]
		},
		{
			code: "define(['widgetjs/core'], function(widgetjs){})",
			options: [{'widgetjs/core': "widgetjs"}]
		},
		{
			code: "define(['foo-test'], function(fooTest){})"
		}
	],

	invalid: [
		{
			code: "define(['foo', 'bar'], function(bar, foo){})",
			errors: [
				{
					message: 'Expected name is "foo" but "bar" was used.',
					type: "Identifier"
				},
				{
					message: 'Expected name is "bar" but "foo" was used.',
					type: "Identifier"
				}
			]
		}
	]
});
