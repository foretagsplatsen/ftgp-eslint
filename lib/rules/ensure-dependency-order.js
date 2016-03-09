/**
 * @fileoverview Ensure the dependencies are loaded in the correct order
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
	var MESSAGE = "Expected name is \"{{expected}}\" but \"{{name}}\".";
	var options = context.options;
	var aliases = options[0];

	function getNameFromPath(path) {
		var segments = path.value.split("/");
		return segments.pop();
	}

	function match(name, fileName) {
		if (aliases && aliases[fileName]) {
			return aliases[fileName] === name;
		}

		return name.indexOf(fileName) === 0;
	}

	return {
		'CallExpression': function(node) {
			if (node.callee.name === 'define') {
				var array = null;
				var callback = null;

				node.arguments.forEach(function(argument) {
					if (argument.type === "ArrayExpression") {
						array = argument;
					}
					if (argument.type === "FunctionExpression") {
						callback = argument;
					}
				});

				if (!array || !callback) {
					return;
				}

				callback.params.forEach(function(arg, index) {
					var name = arg.name;
					var correspondingPath = array.elements[index];
					var correspondingName = getNameFromPath(correspondingPath);

					if (!match(name, correspondingName)) {
						context.report({
							node: arg,
							message: MESSAGE,
							data: {
								name: name,
								expected: correspondingName
							}
						})
					}
				})
			}
		}
	};

};

module.exports.schema = [
	{
		"type": "object",
		"additionalProperties": true
	}
];
