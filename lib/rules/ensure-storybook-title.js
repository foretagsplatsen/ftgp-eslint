/**
 * @fileoverview Ensure title of a CSF matches the folder in which it is
 * @author Benjamin Van Ryseghem
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

const path = require("path");

const NON_MATCHING_TITLE = "CSF title not matching the file path";
const MISSING_TITLE = "CSF has no title";

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

function ensureUnixPath(string) {
	return string.split(path.sep).join(path.posix.sep);
}

function sanitize(string) {
	let value = trimStart(string);
	return ensureUnixPath(path.dirname(value));
}

function getExpectedTitle(context) {
	let filename = context.getFilename();
	let root = getRootOption(context.options)

	let [, expectedTitle] = filename.split(root);
	return sanitize(expectedTitle);
}

module.exports = {
	meta: {
		fixable: "code"
	},
	create: function(context) {
		return {
			ExportDefaultDeclaration: function({ declaration }) {
				if (!declaration || !declaration.type === "ObjectExpression") {
					return;
				}

				let titleProperty = declaration.properties.find((property) => property.key?.name === "title");
				let expectedTitle = getExpectedTitle(context);

				if (!titleProperty) {
					context.report({
						node: declaration,
						message: MISSING_TITLE,
						fix: (fixer) => {
							let range = declaration.range;
							return fixer.insertTextBeforeRange([range[1] - 1, range[1] - 1], `title: "${expectedTitle}"`);
						}
					});

					return;
				}

				let { value: actualTitle } = titleProperty.value;

				if (actualTitle === expectedTitle) {
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
