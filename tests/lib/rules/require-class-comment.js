/**
 * @fileoverview Require each class to have a well formed class comment
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/require-class-comment"),
	fixtures = require("../../fixtures/rules/require-class-comment/fixtures"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions: {ecmaVersion: 6}});
ruleTester.run("require-class-comment", rule, {

	valid: [
		"model.foo()",
		{
			code: "/** \n " +
			" * Test\n" +
			" * @return {Test} a test\n" +
			" */\n" +
			"model.subclass(function(){})"
		},
		{
			code: "/** \n " +
			" * Test\n" +
			" * @virtual\n" +
			" * @return {Test} a test\n" +
			" */\n" +
			"model.abstractSubclass(function(){})"
		},
		fixtures.valid.params,
		fixtures.valid.destructuringUnnamed,
		fixtures.valid.destructuringNamed,
		fixtures.valid.twoClasses,
		fixtures.valid.optionalParams,
		fixtures.valid.paramsWithDefaultValue
	],

	invalid: [
		{
			code: "model.subclass(function(){})",
			errors: [
				{
					message: "Missing JSDoc comment.",
					type: "CallExpression"
				}
			]
		},
		{
			code: "model.abstractSubclass(function(){})",
			errors: [
				{
					message: "Missing JSDoc comment.",
					type: "CallExpression"
				}
			]
		},
		{
			code: "model.singleton(function(){})",
			errors: [
				{
					message: "Missing JSDoc comment.",
					type: "CallExpression"
				}
			]
		},
		{
			code: "/** \n " +
			" * Test\n" +
			" * @param foo - another description\n" +
			" */\n" +
			"model.subclass(function(){})",
			errors: [
				{
					message: "Missing JSDoc parameter type for 'foo'.",
					type: "Block"
				}
			]
		},
		{
			code: "/** \n " +
			" * `Test` is \n" +
			" * @return a test\n" +
			" */\n" +
			"model.subclass(function(){})",
			errors: [
				{
					message: "JSDoc description error.",
					type: "Block"
				}
			]
		},
		{
			code: "/** \n " +
			" * `Test`\n" +
			" * @return a test\n" +
			" */\n" +
			"model.abstractSubclass(function(){})",
			errors: [
				{
					message: "Missing JSDoc `virtual` keyword.",
					type: "Block"
				}
			]
		},
		{
			code: "/** \n " +
			" * `Test`\n" +
			" * @virtual\n" +
			" */\n" +
			"model.subclass(function(){})",
			errors: [
				{
					message: "JSDoc `virtual` keyword on a non-abstract class.",
					type: "Block"
				}
			]
		},
		fixtures.invalid.missingDash,
		fixtures.invalid.missingParams,
		fixtures.invalid.missingParamsDestructuring,
		fixtures.invalid.extraParams,
		fixtures.invalid.extraParamsDestructuring,
		fixtures.invalid.duplicateParams,
		fixtures.invalid.duplicateParamsDestructuring,
		fixtures.invalid.innerComment
	]
});
