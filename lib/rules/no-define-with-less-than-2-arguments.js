/**
 * @fileoverview All define should at least have 2 arguments
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
				if (node.arguments.length < 2) {
					context.report(node, '`define` must have at least two arguments.');
				}
			}
		}
	};
};

module.exports.schema = [
	// fill in your schema
];
