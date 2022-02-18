/**
 * @fileoverview Ensure title of a CSF matches the folder in which it is
 * @author Benjamin Van Ryseghem
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

const path = require("path");

const NON_MATCHING_TITLE = "CSF title not matching the file path";

const defaultRoot = "/Client/js";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function getRootOption(options) {
	if (!options || !options[0] || !options[0].root) {
		return defaultRoot
	}

	return options[0].root
}

function trimStart(string, firstCharacter = "/") {
	if (string[0] === firstCharacter) {
		return string.slice(1);
	}

	return string;
}

function sanitize(string) {
	let value = trimStart(string);
	return path.dirname(value);
}

module.exports = {
	meta: {
		fixable: "code"
	},
	create: function(context) {
		return {
			ExportDefaultDeclaration: function({ declaration }) {
				let root = getRootOption(context.options)
				if (!declaration || !declaration.type === "ObjectExpression") {
					return;
				}

				let titleProperty = declaration.properties.find((property) => property.key?.name === "title");

				if (!titleProperty) {
					return;
				}

				let { value } = titleProperty.value;
				let filename = context.getFilename();

				let [, expectedTitle] = filename.split(root);
				expectedTitle = sanitize(expectedTitle);

				if (value === expectedTitle) {
					return;
				}

				context.report({
					node: titleProperty.value,
					message: NON_MATCHING_TITLE,
					fix: (fixer) => fixer.replaceText(titleProperty.value, `"${expectedTitle}"`)
				});
			}
		}
	}
}

module.exports.schema = [
	{
		type: "object",
		properties: {
			root: {
				type: "string",
			}
		},
		additionalProperties: false
	}
];
