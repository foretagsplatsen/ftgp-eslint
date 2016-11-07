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
	}

	// Language translation map

	return {
		'CallExpression': function(node) {
			// Polyglot calls
			if (node.callee.name === '_' && node.arguments[0] && node.arguments[0].type == 'Literal') {

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
