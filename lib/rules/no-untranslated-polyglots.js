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

	var options = context.options && context.options[0];
	var language = options && options.language;
	var translations = options && options.translations || require("../../js/shared/translations.js");

	if (!language) {
		throw new Error('Options language is required', options.toString());
	}

	function checkPolyglotArgument(argument, node) {
		if (!argument) {
			context.report(node, 'Polyglot should have at least one argument');
		}

		switch (argument.type) {
			case 'Identifier':
				context.report(node, 'No variable should be passed. Inline `{{text}}`', {text: argument.name});
				break;
			case 'BinaryExpression':
				if (argument.operator === '+') {
					context.report(node, 'Replace concatenation of polyglots with template.');
				} else if (argument.operator === '||') {
					context.report(node, 'Replace concatenation of polyglots with template.');
				} else {
					context.report(node, 'It looks, like there is something fishy with `{{text}}`', {text: argument.value});
				}
				break;
			case 'MemberExpression':
				context.report(node, 'Translating a member looks like a bad idea. Maybe a switch case could do it?');
				break;
			case 'CallExpression':
				context.report(node, 'Result of invokation should not be translated. The invoked function could return the translation directly maybe?');
				break;
			case 'Literal':
				var text = argument.value;
				if (text === undefined) {
					return;
				}
				var translation = translations[text];
				if (translation === undefined) {
					context.report(node, '\'{{text}}\' is not translatable.', {text: text});
				} else if (!translation.hasOwnProperty(language)) {
					context.report(node, '\'{{text}}\' is not translated into {{language}}.', {
						text: text,
						language: language
					});
				}
				break;
			default:
				context.report(node, 'Unknown Type: ' + argument.type);
				break;
		}
	}

	// Language translation map

	return {
		'CallExpression': function(node) {
			// Polyglot calls
			if (node.callee.name === '_') {

				// Where text is not translated
				checkPolyglotArgument(node.arguments[0], node);
			}
		}
	};
};

module.exports.schema = [
	{
		"type": "object",
		"properties": {
			"translations": {
				"type": "object"
			},
			"language": {
				"type": "string"
			}
		},
		"additionalProperties": false
	}
];
