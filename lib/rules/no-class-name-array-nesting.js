/**
 * @fileoverview Don't use arrays inside arrays to specify CSS classes
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const classNameKeywords = ["className"];
const MESSAGE = "Array nesting is not allowed in class name value.";

function resolveNestedArray(node, context) {
	return (fixer) => {
		let sourceCode = context.getSourceCode();
		let result = node.elements.map((element) =>
			sourceCode.getText(element)
		);

		return fixer.replaceText(node, result.join(", "));
	};
}

function getKeywordOption(options) {
	if (!options || !options[0] || !options[0].keywords) {
		return classNameKeywords;
	}

	return options[0].keywords;
}

function checkNestedArrayExpression(node, context) {
	if (node.type !== "ArrayExpression") {
		return;
	}

	context.report({
		node: node,
		message: MESSAGE,
		fix: resolveNestedArray(node, context),
	});
}

module.exports = {
	meta: {
		fixable: "code",
	},
	create: function (context) {
		return {
			Property: function (node) {
				let keywords = getKeywordOption(context.options);

				if (!keywords.includes(node.key.name)) {
					return;
				}

				if (node.value.type !== "ArrayExpression") {
					return;
				}

				node.value.elements.forEach((element) => {
					checkNestedArrayExpression(element, context);
				});
			},
		};
	},
};
