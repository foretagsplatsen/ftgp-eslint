/**
 * @fileoverview Don't use space-separated string to specify CSS classes in an array
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const classNameKeywords = ["className"];
const MESSAGE = "Only one class per string allowed inside an array.";

function resolveMultipleClasses(node) {
	return (fixer) => {
		let values = node.value.split(" ").map((each) => `"${each}"`).join(", ");

		return fixer.replaceText(node, values);
	}
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
			message: MESSAGE,
			fix: resolveMultipleClasses(element, context)
		});
	});
}

function getKeywordOption(options) {
	if (!options || !options[0] || !options[0].keywords) {
		return classNameKeywords
	}

	return options[0].keywords
}

module.exports = {
	meta: {
		fixable: "code"
	},
	create: function(context) {
		return {
			Property: function(node) {
				let keywords = getKeywordOption(context.options);

				if (!keywords.includes(node.key.name)) {
					return;
				}

				handleArrayExpression(node.value, context)
			}
		}
	}
}
