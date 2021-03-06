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

var changeCase = require("change-case");

module.exports = function(context) {
	var MESSAGE = "Expected name is \"{{expected}}\" but \"{{name}}\" was used.";
	var MISMATCH_MESSAGE = "More arguments that dependencies. Something is wrong.";
	var options = context.options;
	var aliases = options[0];

	function getNameFromPath(path) {
		if (aliases && aliases[path]) {
			return aliases[path];
		}

		var segments = path.split("/");
		return changeCase.camel(segments.pop());
	}

	function match(actualName, possibleName) {
		if (possibleName.constructor === Array) {
			return possibleName.some(function(name) {
				return match(actualName, name)
			})
		} else {
			return actualName.indexOf(possibleName) === 0;
		}
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

					if (!correspondingPath) {
						context.report({
							node: arg,
							message: MISMATCH_MESSAGE
						});
						return;
					}

					var correspondingName = getNameFromPath(correspondingPath.value);

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
