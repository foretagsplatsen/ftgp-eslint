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

module.exports = function (context) {
	function checkPolyglotArgument(argument, node) {
		if (!argument) {
			context.report(node, "Polyglot should have at least one argument");
			return;
		}

		switch (argument.type) {
			case "Identifier":
				context.report(
					node,
					"No variable should be passed. Inline `{{text}}`",
					{ text: argument.name }
				);
				break;
			case "BinaryExpression":
			case "LogicalExpression":
				if (argument.operator === "+") {
					context.report(
						node,
						"Replace concatenation of polyglots with template"
					);
				} else if (argument.operator === "||") {
					context.report(
						node,
						"Replace concatenation of polyglots with template"
					);
				} else {
					context.report(
						node,
						"It looks like there is something fishy with the polyglot"
					);
				}
				break;
			case "MemberExpression":
				context.report(
					node,
					"Translating a member looks like a bad idea. Maybe a switch case could do it?"
				);
				break;
			case "CallExpression":
				context.report(
					node,
					"Result of invokation should not be translated. The invoked function could return the translation directly maybe?"
				);
				break;
			case "Literal":
				// A 'Literal' is the only acceptable argument type
				break;
			default:
				context.report(node, "Unknown Type: " + argument.type);
				break;
		}
	}

	return {
		CallExpression: function (node) {
			// Polyglot calls
			if (node.callee.name === "_") {
				checkPolyglotArgument(node.arguments[0], node);
			}
		},
	};
};

module.exports.schema = [
	{
		type: "object",
		additionalProperties: false,
	},
];
