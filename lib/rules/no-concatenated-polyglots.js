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

module.exports = function (context) {
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
						node: node,
						message:
							"Replace concatenation of polyglots with template.",
					});
				}
			}
		},
	};
};

module.exports.schema = [
	// fill in your schema
];
