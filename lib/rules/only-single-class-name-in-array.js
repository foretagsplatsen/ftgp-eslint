/**
 * @fileoverview Don't use space-separated string to specify CSS classes in an array
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const schema = require("../css-className-rules-schema.js");

const classNameKeywords = ["className"];

function resolveMultipleClasses(node) {
	return (fixer) => {
		let values = node.value
			.split(" ")
			.map((each) => `"${each}"`)
			.join(", ");

		return fixer.replaceText(node, values);
	};
}

function handleArrayExpression(node, context) {
	if (node.type !== "ArrayExpression") {
		return;
	}

	node.elements.forEach((element) => {
		if (element.type !== "Literal" || !element.value.includes(" ")) {
			handleArrayExpression(element, context);
			return;
		}

		context.report({
			node: element,
			messageId: "message",
			fix: resolveMultipleClasses(element, context),
		});
	});
}

function getKeywordOption(options) {
	if (!options || !options[0] || !options[0].keywords) {
		return classNameKeywords;
	}

	return options[0].keywords;
}

module.exports = {
	meta: {
		fixable: "code",
		schema,
		type: "suggestion",
		messages: {
			message: "Only one class per string allowed inside an array.",
		},
	},
	create(context) {
		return {
			Property(node) {
				let keywords = getKeywordOption(context.options);

				if (!keywords.includes(node.key.name)) {
					return;
				}

				handleArrayExpression(node.value, context);
			},
		};
	},
};
