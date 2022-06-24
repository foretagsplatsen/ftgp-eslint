/**
 * @fileoverview Simplify tests by avoiding some usages of expect()
 * @author Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/no-single-expect-in-then-or-should"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const MESSAGE_THEN = "A single expect() in a then() can be rewritten with a should().";
const MESSAGE_SHOULD = "A single expect() in a then() can be rewritten with a should().";

const thenError = {message: MESSAGE_THEN, type: "CallExpression"};
const shouldError = {message: MESSAGE_SHOULD, type: "CallExpression"};

let ruleTester = new RuleTester();
let parserOptions = { ecmaVersion: 6 };

ruleTester.run("no-single-expect-in-then-or-should", rule, {
	valid: [
		{code: "this.f()",},
		{
			code: "cy.then(() => {expect()})",
			parserOptions
		},
		{
			code: "then((foo) => {expect(foo).to.be.true})",
			parserOptions
		},
		{
			code: "this.then(() => {expect(); expect();})",
			parserOptions
		},
		{
			code: "this.then(() => {f();})",
			parserOptions
		},
		{
			code: "this.then(() => {f().expect();})",
			parserOptions
		},
		{
			code: "cy.then((foo) => {expect(bar).to.be.true})",
			parserOptions
		},
		{
			code: "cy.should((foo) => {expect(bar).to.be.true})",
			parserOptions
		},
	],

	invalid: [
		{
			code: "cy.then((foo) => {expect(foo).to.be.true})",
			errors: [thenError],
			parserOptions,
			output: 'cy.should("be.true")'
		},
		{
			code: "cy.should((foo) => {expect(foo).to.be.true})",
			errors: [shouldError],
			parserOptions,
			output: 'cy.should("be.true")'
		},
		{
			code: "cy.foo().bar().then((val) => {expect(val).to.have.length(1)})",
			errors: [thenError],
			parserOptions,
			output: 'cy.foo().bar().should("have.length", 1)'
		},
		{
			code: 'cy.bar().then((val) => {expect(val).not.to.have.attr("checked")})',
			errors: [thenError],
			parserOptions,
			output: 'cy.bar().should("not.have.attr", "checked")'
		},
		{
			code: 'cy.then((url) => {expect(url).match("checked")})',
			errors: [thenError],
			parserOptions,
			output: 'cy.should("match", "checked")'
		}
	],
});
