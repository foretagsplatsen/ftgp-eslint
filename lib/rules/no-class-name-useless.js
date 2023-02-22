/**
 * @fileoverview Don't over-complicate expressions to specify CSS classes
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const classNameKeywords = ["className"];
const MESSAGE = "Arrays with only literals as elements are useless.";
const EMPTY_ARRAY_MESSAGE = "Empty arrays are useless.";
const EMPTY_OBJECT_MESSAGE = "Empty objects are useless.";
const SINGLETON_MESSAGE = "Singleton arrays are useless.";
const SUPERFLUOUS_LITERAL = "Literal values are superfluous.";
const LEADING_TRAILING_SPACE_MESSAGE = "No leading/trailing space allowed.";

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
			message: EMPTY_ARRAY_MESSAGE,
		});
		return;
	}

	if (node.elements.length === 1) {
		context.report({
			node,
			message: SINGLETON_MESSAGE,
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
			message: MESSAGE,
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
				message: EMPTY_OBJECT_MESSAGE,
				fix: (fixer) => fixer.remove(node),
			});
		} else {
			context.report({
				node,
				message: EMPTY_OBJECT_MESSAGE,
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
			message: SUPERFLUOUS_LITERAL,
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
			message: LEADING_TRAILING_SPACE_MESSAGE,
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
	},
	create: function (context) {
		return {
			Property: function (node) {
				let keywords = getKeywordOption(context.options);

				if (!keywords.includes(node.key.name)) {
					return;
				}

				handleNode(node.value, context);
			},
		};
	},
};
