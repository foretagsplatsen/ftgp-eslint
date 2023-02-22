/**
 * @fileoverview All implementations of my.initialize should perform a super call.
 * @author Nicolas Petton & Benjamin Van Ryseghem
 * @copyright 2016 Nicolas Petton & Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function isInitializeMethod(node) {
	var expression = node.expression;
	return (
		expression.type === "AssignmentExpression" &&
		expression.left.type === "MemberExpression" &&
		expression.left.object.name === "my" &&
		expression.left.property.name === "initialize"
	);
}

function isSuperCall(node) {
	var callee = node.callee;
	return (
		callee.type === "MemberExpression" &&
		callee.object.name === "my" &&
		callee.property.name === "super"
	);
}

module.exports = {
	meta: {
		type: "problem",
		schema: [],
		messages: {
			"missing-spec": "`spec` argument missing.",
			"missing-super-call":
				"super call not performed in `my.initialize`.",
			"missing-spec-in-super": "spec argument missing from super call.",
		},
	},
	create(context) {
		var requireSuperCall = false;
		var superCallNode = null;

		return {
			ExpressionStatement: function (node) {
				if (isInitializeMethod(node)) {
					requireSuperCall = true;
				}
			},
			CallExpression: function (node) {
				if (!requireSuperCall) {
					return;
				}

				if (isSuperCall(node)) {
					superCallNode = node;
				}
			},
			"ExpressionStatement:exit": function (node) {
				if (isInitializeMethod(node)) {
					var argParams = node.expression.right.params;
					if (argParams.length === 0) {
						context.report({
							node,
							messageId: "missing-spec",
						});
					} else {
						var specArgName =
							node.expression.right.params.length &&
							node.expression.right.params[0].name;
						if (requireSuperCall && !superCallNode) {
							context.report({
								node,
								messageId: "missing-super-call",
							});
						} else if (
							superCallNode.arguments.length !== 1 ||
							superCallNode.arguments[0].name !== specArgName
						) {
							context.report({
								node: superCallNode,
								messageId: "missing-spec-in-super",
							});
						}
					}
					requireSuperCall = false;
					superCallNode = null;
				}
			},
		};
	},
};
