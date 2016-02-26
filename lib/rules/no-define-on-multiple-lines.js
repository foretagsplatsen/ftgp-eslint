/**
 * @fileoverview define arguments should start on the correct line
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
			if (node.callee.name === 'define') {
				if (node.arguments[0].loc.start.line !== node.callee.loc.end.line) {
					context.report({
						node: node,
						loc: node.arguments[0].loc.start,
						message: 'define dependency array should start on the same line that the `define` statement.'
					});
					return;
				}

				if (node.arguments.length !== 2) {
					return;
				}

				if (node.arguments[1].loc.start.line !== node.arguments[0].loc.end.line) {
					context.report({
						node: node,
						loc: node.arguments[1].loc.end,
						message: 'define callback should be define on the same line that the dependency array.'
					});
				}
			}
		}
	};

};

module.exports.schema = [
	// fill in your schema
];
