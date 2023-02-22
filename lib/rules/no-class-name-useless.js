/**
 * @fileoverview Don't over-complicate expressions to specify CSS classes
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const schema = require("../css-className-rules-schema.js");

const classNameKeywords = ["className"];

function resolveUselessArray(node) {
	return (fixer) => {
		let result = node.elements.map((element) => element.value);

		return fixer.replaceText(node, `"${result.join(" ")}"`);
	};
}

function resolveSingletonArray(node, context) {
	return (fixer) => {
		let sourceCode = context.getSourceCode();
		let result = sourceCode.getText(node.elements[0]);

		return fixer.replaceText(node, result);
	};
}

function getKeywordOption(options) {
	if (!options || !options[0] || !options[0].keywords) {
		return classNameKeywords;
	}

	return options[0].keywords;
}

function getObjectKeyValue(node) {
	return node.name || node.value;
}

function resolveInlinableLiterals(node, context) {
	return (fixer) => {
		let inlined = [];
		let others = [];
		let sourceCode = context.getSourceCode();

		node.properties.forEach((property) => {
			if (property.value.type !== "Literal") {
				others.push(property);
			}

			if (property.value.value) {
				inlined.push(property);
			}
		});

		let inlinedString = inlined
			.map(({ key }) => `"${getObjectKeyValue(key)}"`)
			.join(", ");

		let othersString = others
			.map((property) => sourceCode.getText(property))
			.join(", ");

		let result = `[${inlinedString}, {${othersString}}]`;
		if (!othersString) {
			result = `[${inlinedString}]`;
		}

		if (!inlinedString) {
			result = `{${othersString}}`;
		}

		return fixer.replaceText(node, result);
	};
}

function handleArrayExpression(node, context) {
	if (!node.elements.length) {
		context.report({
			node,
			messageId: "empty-array",
		});
		return;
	}

	if (node.elements.length === 1) {
		context.report({
			node,
			messageId: "singleton",
			fix: resolveSingletonArray(node, context),
		});
		return;
	}

	let shouldBeInlined = node.elements.every(
		(element) => element.type === "Literal"
	);

	if (shouldBeInlined) {
		context.report({
			node,
			messageId: "array-with-only-literals",
			fix: resolveUselessArray(node),
		});
		return;
	}

	node.elements.forEach((element) => {
		handleNode(element, context);
	});
}

function handleObjectExpression(node, context) {
	if (!node.properties.length) {
		if (node.parent.type === "ArrayExpression") {
			context.report({
				node,
				messageId: "empty-object",
				fix: (fixer) => fixer.remove(node),
			});
		} else {
			context.report({
				node,
				messageId: "empty-object",
			});
		}
		return;
	}

	let hasInlinableLiterals = false;
	node.properties.forEach(
		({ key: propertyKeyNode, value: propertyValueNode }) => {
			if (propertyValueNode.type === "Literal") {
				hasInlinableLiterals = true;
			}

			handleLiteral(propertyKeyNode, context);
		}
	);

	if (hasInlinableLiterals) {
		context.report({
			node,
			messageId: "superfluous-literal",
			fix: resolveInlinableLiterals(node, context),
		});
	}
}

function handleLiteral(node, context) {
	if (typeof node.value !== "string") {
		return;
	}

	let trimmed = node.value.trim();
	if (trimmed !== node.value) {
		context.report({
			node,
			messageId: "leading-trailing-space",
			fix: (fixer) => fixer.replaceText(node, `"${trimmed}"`),
		});
	}
}

function handleNode(node, context) {
	if (!node) {
		return;
	}

	if (node.type === "Literal") {
		return handleLiteral(node, context);
	}

	if (node.type === "ArrayExpression") {
		return handleArrayExpression(node, context);
	}

	if (node.type === "ObjectExpression") {
		return handleObjectExpression(node, context);
	}
}

module.exports = {
	meta: {
		fixable: "code",
		type: "suggestion",
		messages: {
			"array-with-only-literals":
				"Arrays with only literals as elements are useless.",
			"empty-array": "Empty arrays are useless.",
			"empty-object": "Empty objects are useless.",
			singleton: "Singleton arrays are useless.",
			"superfluous-literal": "Literal values are superfluous.",
			"leading-trailing-space": "No leading/trailing space allowed.",
		},
		schema,
	},
	create(context) {
		return {
			Property(node) {
				let keywords = getKeywordOption(context.options);

				if (!keywords.includes(node.key.name)) {
					return;
				}

				handleNode(node.value, context);
			},
		};
	},
};
