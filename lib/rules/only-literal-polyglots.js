/**
 * @fileoverview Only literals should be polyglots
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
	meta: {
		type: "problem",
		messages: {
			"one-argument": "Polyglot should have at least one argument",
			"no-variable": "No variable should be passed. Inline `{{text}}`",
			"no-concatenation":
				"Replace concatenation of polyglots with template",
			fishy: "It looks like there is something fishy with the polyglot",
			"no-member-translation":
				"Translating a member looks like a bad idea. Maybe a switch case could do it?",
			"no-invocation-translation":
				"Result of invokation should not be translated. The invoked function could return the translation directly maybe?",
			"unknown-type": "Unknown Type: {{type}}",
		},
		schema: [],
	},
	create(context) {
		function checkPolyglotArgument(argument, node) {
			if (!argument) {
				context.report({
					node,
					messageId: "one-argument",
				});
				return;
			}

			switch (argument.type) {
				case "Identifier":
					context.report({
						node,
						messageId: "no-variable",
						data: { text: argument.name },
					});
					break;
				case "BinaryExpression":
				case "LogicalExpression":
					if (argument.operator === "+") {
						context.report({
							node,
							messageId: "no-concatenation",
						});
					} else if (argument.operator === "||") {
						context.report({
							node,
							messageId: "no-concatenation",
						});
					} else {
						context.report({
							node,
							messageId: "fishy",
						});
					}
					break;
				case "MemberExpression":
					context.report({
						node,
						messageId: "no-member-translation",
					});
					break;
				case "CallExpression":
					context.report({
						node,
						messageId: "no-invocation-translation",
					});
					break;
				case "Literal":
					// A 'Literal' is the only acceptable argument type
					break;
				default:
					context.report({
						node,
						messageId: "unknown-type",
						data: { type: argument.type },
					});
					break;
			}
		}

		return {
			CallExpression(node) {
				// Polyglot calls
				if (node.callee.name === "_") {
					checkPolyglotArgument(node.arguments[0], node);
				}
			},
		};
	},
};

module.exports.schema = [
	{
		type: "object",
		additionalProperties: false,
	},
];
