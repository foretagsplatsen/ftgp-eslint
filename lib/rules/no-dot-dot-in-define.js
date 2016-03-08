/**
 * @fileoverview The path in `define` only goes down
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

	var MESSAGE = 'No `..` allowed in the define paths.';

	return {
		'CallExpression': function(node) {
			if (node.callee.name === 'define') {

				var array = null;

				node.arguments.forEach(function(argument) {
					if (argument.type === "ArrayExpression") {
						array = argument;
					}
				});

				if (!array) {
					return;
				}

				array.elements.forEach(function(path) {
					var index = path.value.indexOf("..");
					if (index !== -1) {
						context.report({
							node: path,
							loc: {
								line: path.loc.start.line,
								column: path.loc.start.column + index
							},
							message: MESSAGE
						})
					}
				})
			}
		}
	};

};

module.exports.schema = [
	// fill in your schema
];
