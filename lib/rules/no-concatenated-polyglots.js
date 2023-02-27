/**
 * @fileoverview Does not allow polyglot translation to be concatenated
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
		schema: [],
		messages: {
			message: "Replace concatenation of polyglots with template.",
		},
	},
	create(context) {
		return {
			CallExpression: function (node) {
				// Polyglot calls
				if (node.callee.name === "_") {
					// Assume that polyglots are concatenated if parent is + operator
					// Eg. _('text') + _('more text') or _('text') + 'more text' or _('text') + variable
					if (
						node.parent.type === "BinaryExpression" &&
						node.parent.operator === "+"
					) {
						context.report({
							node,
							messageId: "message",
						});
					}
				}
			},
		};
	},
};
