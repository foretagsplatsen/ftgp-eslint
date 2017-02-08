/**
 * @fileoverview Require each class to have a well formed class comment
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

var doctrine = require('doctrine');

var keywords = ['subclass', 'abstractSubclass', 'singleton'];
var virtualKeywords = ['abstractSubclass'];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

	// variables should be defined here

	//--------------------------------------------------------------------------
	// Helpers
	//--------------------------------------------------------------------------

	var params = [];
	var register = false;

	var options = context.options[0] || {},
		prefer = options.prefer || {},
		comments = [],
		sourceCode = context.getSourceCode(),

		requireParamDescription = options.requireParamDescription !== false,
		preferType = options.preferType || {},
		checkPreferType = Object.keys(preferType).length !== 0;

	function isDescriptionValid(description) {
		if (!description) {
			return false;
		}
		return !description.match(/\`\ is$/gi);
	}

	/**
	 * Report the error message
	 * @param {ASTNode} node node to report
	 * @returns {void}
	 */
	function report(node) {
		context.report({
			node: node,
			message: 'Missing JSDoc comment.'
		});
	}

	/**
	 * Check if type should be validated based on some exceptions
	 * @param {Object} type JSDoc tag
	 * @returns {boolean} True if it can be validated
	 * @private
	 */
	function canTypeBeValidated(type) {
		return type !== 'UndefinedLiteral' && // {undefined} as there is no name property available.
			type !== 'NullLiteral' && // {null}
			type !== 'NullableLiteral' && // {?}
			type !== 'FunctionType' && // {function(a)}
			type !== 'AllLiteral'; // {*}
	}

	/**
	 * Extract the current and expected type based on the input type object
	 * @param {Object} type JSDoc tag
	 * @returns {Object} current and expected type object
	 * @private
	 */
	function getCurrentExpectedTypes(type) {
		var currentType;
		var expectedType;

		if (type.name) {
			currentType = type.name;
		} else if (type.expression) {
			currentType = type.expression.name;
		}

		expectedType = currentType && preferType[currentType];

		return {
			currentType: currentType,
			expectedType: expectedType
		};
	}

	/**
	 * Check if return tag type is void or undefined
	 * @param {Object} jsdocNode JSDoc node
	 * @param {Object} type JSDoc tag
	 * @returns {void}
	 * @private
	 */
	function validateType(jsdocNode, type) {
		if (!type || !canTypeBeValidated(type.type)) {
			return;
		}

		var typesToCheck = [];
		var elements = [];

		switch (type.type) {
			case 'TypeApplication':	 // {Array.<String>}
				elements = type.applications[0].type === 'UnionType' ? type.applications[0].elements : type.applications;
				typesToCheck.push(getCurrentExpectedTypes(type));
				break;
			case 'RecordType':	// {{20:String}}
				elements = type.fields;
				break;
			case 'UnionType':  // {String|number|Test}
			case 'ArrayType':  // {[String, number, Test]}
				elements = type.elements;
				break;
			case 'FieldType':  // Array.<{count: number, votes: number}>
				typesToCheck.push(getCurrentExpectedTypes(type.value));
				break;
			default:
				typesToCheck.push(getCurrentExpectedTypes(type));
		}

		elements.forEach(validateType.bind(null, jsdocNode));

		typesToCheck.forEach(function(typeToCheck) {
			if (typeToCheck.expectedType &&
				typeToCheck.expectedType !== typeToCheck.currentType) {
				context.report({
					node: jsdocNode,
					message: 'Use \'{{expectedType}}\' instead of \'{{currentType}}\'.',
					data: {
						currentType: typeToCheck.currentType,
						expectedType: typeToCheck.expectedType
					}
				});
			}
		});
	}

	function checkJSDoc(node, jsdocNode, isVirtual, paramsToCheck) {
		var hasConstructor = false,
			isInterface = false,
			isOverride = false,
			isAbstract = false,
			params = Object.create(null),
			specParams = Object.create(null),
			jsdoc;

		// make sure only to validate JSDoc comments
		if (jsdocNode) {

			try {
				jsdoc = doctrine.parse(jsdocNode.value, {
					strict: true,
					unwrap: true,
					sloppy: true,
					lineNumbers: true
				});
			} catch (ex) {

				if (/braces/i.test(ex.message)) {
					context.report({
						node: jsdocNode,
						message: 'JSDoc type missing brace.'
					});
				} else {
					context.report({
						node: jsdocNode,
						message: 'JSDoc syntax error.'
					});
				}

				return;
			}

			if (!isDescriptionValid(jsdoc.description)) {
				context.report({
					node: jsdocNode,
					message: 'JSDoc description error.'
				});
			}

			var lines;
			var line;
			var col;

			jsdoc.tags.forEach(function(tag) {
				switch (tag.title.toLowerCase()) {

					case 'param':
					case 'arg':
					case 'argument':
						if (!tag.type) {
							lines = jsdocNode.value.split('\n');
							line = lines[tag.lineNumber];
							col = line.indexOf(tag.name);
							context.report({
								node: jsdocNode,
								message: 'Missing JSDoc parameter type for \'{{name}}\'.',
								data: {name: tag.name},
								loc: {
									line: jsdocNode.loc.start.line + tag.lineNumber,
									col: col
								}
							});
						}

						if (tag.name !== 'spec' && tag.name !== 'that' && tag.name !== 'my' && !tag.description && requireParamDescription) {
							lines = jsdocNode.value.split('\n');
							line = lines[tag.lineNumber];
							col = line.indexOf(tag.name) + tag.name.length;
							context.report({
								node: jsdocNode,
								message: 'Missing JSDoc parameter description for \'{{name}}\'.',
								data: {name: tag.name},
								loc: {
									line: jsdocNode.loc.start.line + tag.lineNumber,
									col: col
								}
							});
						}

						var regexp = new RegExp('\[?' + tag.name + '\]?'+ "\ -\ ");
						var match = jsdocNode.value.match(regexp);

						if (tag.description && !match) {
							lines = jsdocNode.value.split('\n');
							line = lines[tag.lineNumber];
							col = line.indexOf(tag.name) + tag.name.length;
							context.report({
								node: jsdocNode,
								message: 'JSDoc parameter description for \'{{name}}\' should start with \'-\'.',
								data: {name: tag.name},
								loc: {
									line: jsdocNode.loc.start.line + tag.lineNumber,
									column: col
								}
							});
						}

						if (params[tag.name] || specParams[tag.name]) {
							lines = jsdocNode.value.split('\n');
							line = lines[tag.lineNumber];
							col = line.indexOf('*');
							context.report({
								node: jsdocNode,
								message: 'Duplicate JSDoc parameter \'{{name}}\'.',
								data: {name: tag.name},
								loc: {
									line: jsdocNode.loc.start.line + tag.lineNumber,
									col: col
								}
							})
						} else if (tag.name.indexOf('.') === -1) {
							params[tag.name] = 1;
						} else if (tag.name.split('.')[0] === 'spec') {
							specParams[tag.name] = 1;
						}
						break;
					case 'constructor':
					case 'class':
						hasConstructor = true;
						break;

					case 'override':
					case 'inheritdoc':
						isOverride = true;
						break;

					case 'abstract':
					case 'virtual':
						isAbstract = true;
						break;

					case 'interface':
						isInterface = true;
						break;

					// no default
				}

				// check tag preferences
				if (prefer.hasOwnProperty(tag.title) && tag.title !== prefer[tag.title]) {
					context.report({
						node: jsdocNode,
						message: 'Use @{{name}} instead.',
						data: {name: prefer[tag.title]}
					});
				}

				// validate the types
				if (checkPreferType && tag.type) {
					validateType(jsdocNode, tag.type);
				}
			});

			paramsToCheck.forEach(function(p) {
				if (specParams[p] !== 1) {
					context.report({
						node: jsdocNode,
						message: 'Missing JSDoc for parameter \'{{name}}\'. Found ones are \'{{specParams}}\'.',
						data: {
							name: p,
							specParams: specParams
						}
					});
				}
			});

			Object.keys(specParams).forEach(function(p) {
				if (paramsToCheck.indexOf(p) === -1) {
					context.report({
						node: jsdocNode,
						message: 'Non-matching JSDoc parameter \'{{name}}\'. Found ones are \'{{paramsToCheck}}\'.',
						data: {
							name: p,
							paramsToCheck: paramsToCheck
						}
					});
				}
			});

			if (isVirtual && !isAbstract) {
				context.report({
					node: jsdocNode,
					message: 'Missing JSDoc `virtual` keyword.'
				});
			}

			// check the parameters
			var jsdocParams = Object.keys(params);

			if (node.params) {
				node.params.forEach(function(param, i) {
					if (param.type === 'AssignmentPattern') {
						param = param.left;
					}

					var name = param.name;

					// TODO(nzakas): Figure out logical things to do with destructured, default, rest params
					if (param.type === 'Identifier') {
						if (jsdocParams[i] && (name !== jsdocParams[i])) {
							context.report({
								node: jsdocNode,
								message: 'Expected JSDoc for \'{{name}}\' but found \'{{jsdocName}}\'.',
								data: {
									name: name,
									jsdocName: jsdocParams[i]
								}
							});
						} else if (!params[name] && !isOverride) {
							context.report({
								node: jsdocNode,
								message: 'Missing JSDoc for parameter \'{{name}}\'.',
								data: {
									name: name
								}
							});
						}
					}
				});
			}

			if (options.matchDescription) {
				var regex = new RegExp(options.matchDescription);

				if (!regex.test(jsdoc.description)) {
					context.report({
						node: jsdocNode,
						message: 'JSDoc description does not satisfy the regex pattern.'
					});
				}
			}

		}
	}

	function findJSDocComment(comments, line) {
		if (line < 0) {
			return null;
		}
		if (comments) {
			for (var i = 0; i < comments.length; i++) {
				var comment = comments[i];
				if (comment && comment.type === 'Block' && comment.value.charAt(0) === '*') {

					if (line - comment.loc.end.line <= 1) {
						return comment;
					}
				}
			}
		}

		return null;
	}

	/**
	 * Check if the jsdoc comment is present or not.
	 * @param {ASTNode} node node to examine
	 * @returns {void}
	 */
	function requireJsDoc(node, isVirtual, paramsToCheck) {
		var lines = sourceCode.lines;
		var index = node.loc.start.line;
		lines = lines.slice(0, index);
		var matches = lines.filter(function(line) {
			return line.match(/\/\*\*/gi);
		});

		var lastIndex = lines.lastIndexOf(matches[matches.length - 1]);

		var jsdocComment = findJSDocComment(sourceCode.ast.comments, lastIndex);
		if (!jsdocComment) {
			report(node);
			return;
		}

		checkJSDoc(node, jsdocComment, isVirtual, paramsToCheck);
	}

	function isClassCreation(node) {
		if (node.callee.type !== 'MemberExpression' || !node.callee.property || !node.callee.property.name) {
			return false;
		}

		var name = node.callee.property.name;
		return keywords.indexOf(name) !== -1;
	}

	function isVirtual(node) {
		var name = node.callee.property.name;
		return virtualKeywords.indexOf(name) !== -1;
	}

	function isInitializeMethod(node) {
		var expression = node.expression;
		return expression.type === 'AssignmentExpression' &&
			expression.left.type === 'MemberExpression' &&
			expression.left.object.name === 'my' &&
			expression.left.property.name === 'initialize';
	}

	function isSpecAccess(node) {
		if (node.type !== 'MemberExpression') {
			return false;
		}

		if (!node.object || !node.object.name || node.object.name !== 'spec') {
			return false;
		}

		return node.property && node.property.name;
	}

	//--------------------------------------------------------------------------
	// Public
	//--------------------------------------------------------------------------
	return {
		Program: function(node) {
			comments = sourceCode.getComments(node);
		},
		'CallExpression': function(node) {
			if (!isClassCreation(node)) {
				return;
			}
			params = [];
		},
		'CallExpression:exit': function(node) {
			if (!isClassCreation(node)) {
				return;
			}
			requireJsDoc(node, isVirtual(node), params);
		},
		'ExpressionStatement': function(node) {
			if (!isInitializeMethod(node)) {
				return;
			}
			register = true;
		},
		'ExpressionStatement:exit': function(node) {
			if (!isInitializeMethod(node)) {
				return;
			}
			register = false;
		},
		'MemberExpression': function(node) {
			if (!register || !isSpecAccess(node)) {
				return;
			}

			var name = 'spec.' + node.property.name;
			if (params.indexOf(name) === -1) {
				params.push(name);
			}
		}
	};

};

module.exports.schema = [
	{
		type: 'object',
		properties: {
			prefer: {
				type: 'object',
				additionalProperties: {
					type: 'string'
				}
			},
			preferType: {
				type: 'object',
				additionalProperties: {
					type: 'string'
				}
			},
			requireReturn: {
				type: 'boolean'
			},
			requireParamDescription: {
				type: 'boolean'
			},
			requireReturnDescription: {
				type: 'boolean'
			},
			matchDescription: {
				type: 'string'
			},
			requireReturnType: {
				type: 'boolean'
			}
		},
		additionalProperties: false
	}
];
