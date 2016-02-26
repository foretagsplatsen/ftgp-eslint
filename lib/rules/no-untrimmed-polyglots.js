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

module.exports = function(context) {

	return {
		'CallExpression': function(node) {
			// Polyglot calls
			if (node.callee.name === '_') {

				// Check translatable text for leading/trailing whitespace
				var text = node.arguments && node.arguments[0] && node.arguments[0].value;
				if (text !== undefined && text.match(/^\s+|.*\s+$/)) {
					context.report({
						node: node,
						message: "'{{text}}' has leading/trailing whitespace.",
						data: {
							text: text
						}
					});
				}
			}
		}
	};
};

module.exports.schema = [
	// fill in your schema
];
