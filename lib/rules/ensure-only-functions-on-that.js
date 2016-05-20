/**
 * @fileoverview Only allows to extend `that` with functions
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

	var MESSAGE = "Assigning anything but a function to `that` is forbidden.";
	var assignments = {};
	var privateFunctions = {};
	var options = context.options;
	var regexps = options[0] && options[0].regexps;

	//--------------------------------------------------------------------------
	// Helpers
	//--------------------------------------------------------------------------

	function deepResolveType(node) {
		var sourceCode = context.getSourceCode();
		var key = sourceCode.getText(node);
		var assignement = assignments[key];
		if (!assignement) {
			return node;
		}

		if (node.type === "MemberExpression") {
			return deepResolveType(assignement.right);
		}

		if (node.type === "Identifier") {
			return deepResolveType(assignement.init);
		}

		return node
	}

	function deepFindObject(node, path) {
		if (path.length === 0) {
			return node;
		}

		if (node.type === "ObjectExpression") {
			var key = path[0];
			var newPath = path.slice(1);

			var matching = null;

			node.properties.forEach(function(child) {
				if (child.key.name === key.name) {
					matching = child;
				}
			});

			if (matching) {
				return deepFindObject(matching.value, newPath);
			} else {
				return null;
			}
		}

		return node
	}

	function deepResolveReceiver(node, rest) {
		if (!node) {
			return null;
		}

		rest = rest || {
			head: null,
			tail: []
		};

		var sourceCode = context.getSourceCode();
		var key = sourceCode.getText(node);
		var assignement = assignments[key];

		if (assignement) {
			rest.head = node;
			return rest;
		}

		rest.tail.unshift(node.property);
		return deepResolveReceiver(node.object, rest);
	}

	function isComplexMemberValid(node) {
		var resolved = deepResolveReceiver(node);

		if (!resolved) {
			return false;
		}

		var knownPart = deepResolveType(resolved.head);

		if (!knownPart) {
			return false;
		}

		if (knownPart.type === "CallExpression") {
			// Since we only expose functions publicly,
			// we are sure we are attaching a function
			return true;
		}

		if (knownPart.type === "ObjectExpression") {
			var final = deepFindObject(knownPart, resolved.tail);
			return isValid(final);
		}

		return false;
	}

	function isValid(node) {

		if (!node) {
			return false;
		}

		if (regexps) {
			var sourceCode = context.getSourceCode();
			var key = sourceCode.getText(node);

			var match = regexps.some(function(regexp) {
				return key.match(regexp);
			});

			if (match) {
				return true;
			}
		}

		var resolved = deepResolveType(node);

		if (!resolved) {
			debugger;
		}

		if (resolved.type === "FunctionExpression") {
			return true;
		}

		if (resolved.type === "MemberExpression") {
			return isComplexMemberValid(node);
		}

		if (resolved.type === "Identifier") {
			return !!privateFunctions[resolved.name];
		}

		return false;
	}

	//--------------------------------------------------------------------------
	// Public
	//--------------------------------------------------------------------------

	return {
		"Program:exit": function() {
			var keys = Object.keys(assignments);
			keys.forEach(function(key) {
				var node = assignments[key];
				var left = node.left;

				if (left && left.type === "MemberExpression" && left.object.name === "that") {
					var right = node.right;
					var valid = isValid(right);

					if (!valid) {
						context.report({
							node: right,
							message: MESSAGE
						})
					}
				}
			});
		},

		"FunctionDeclaration": function(node) {
			privateFunctions[node.id.name] = node;
		},

		"VariableDeclarator": function(node) {
			delete privateFunctions[node.id.name];
			assignments[node.id.name] = node;
		},

		"AssignmentExpression": function(node) {
			var left = node.left;
			var sourceCode = context.getSourceCode();
			var key = sourceCode.getText(left);
			assignments[key] = node;
		}
	};

};

module.exports.schema = [
	{
		"type": "object",
		"properties": {
			"regexps": {
				"type": "array"
			}
		},
		"additionalProperties": false
	}
];
