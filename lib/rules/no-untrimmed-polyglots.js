/**
 * @fileoverview Polyglot strings should be trimmed
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
		messages: { message: "'{{text}}' has leading/trailing whitespace." },
	},
	create(context) {
		return {
			CallExpression: function (node) {
				// Polyglot calls
				if (node.callee.name === "_") {
					// Check translatable text for leading/trailing whitespace
					var text =
						node.arguments &&
						node.arguments[0] &&
						node.arguments[0].value;
					if (text !== undefined && text.match(/^\s+|.*\s+$/)) {
						context.report({
							node,
							messageId: "message",
							data: { text },
						});
					}
				}
			},
		};
	},
};
