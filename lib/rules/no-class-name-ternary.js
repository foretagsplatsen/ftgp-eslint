/**
 * @fileoverview Don't ternary expressions to specify CSS classes
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const classNameKeywords = ["className"];
const MESSAGE = "Conditionals are not accepted as class name value.";

function isEmpty(node) {
	if (node.type === "Literal") {
		return node.raw.trim() === `""`;
	}

	return false;
}

function wrapAsObjectKey(node, context) {
	if (node.type === "Literal") {
		return `"${node.value.trim()}"`;
	}

	let sourceCode = context.getSourceCode();

	return `[${sourceCode.getText(node)}]`;
}

function resolveConditional(node, context) {
	return (fixer) => {
		let result = null;
		let sourceCode = context.getSourceCode();

		let { test } = node;
		let isAlternateEmpty = isEmpty(node.alternate);
		let isConsequentEmpty = isEmpty(node.consequent);

		if (isAlternateEmpty) {
			result = `${wrapAsObjectKey(node.consequent, context)}: ${sourceCode.getText(test)}`;
		}

		if (isConsequentEmpty) {
			result = `${wrapAsObjectKey(node.alternate, context)}: !(${sourceCode.getText(test)})`;
		}

		if (!result) {
			return;
		}

		return fixer.replaceText(node, `{${result}}`);
	}
}

function getKeywordOption(options) {
	if (!options || !options[0] || !options[0].keywords) {
		return classNameKeywords
	}

	return options[0].keywords
}

function checkConditionalExpression(node, context) {
	if (node.type === "ArrayExpression") {
		node.elements.forEach((element) => {
			checkConditionalExpression(element, context);
		})
	}

	if (node.type !== "ConditionalExpression") {
		return;
	}

	context.report({
		node: node,
		message: MESSAGE,
		fix: resolveConditional(node, context)
	});
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

				checkConditionalExpression(node.value, context);
			}
		}
	}
}
