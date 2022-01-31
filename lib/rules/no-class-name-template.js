/**
 * @fileoverview Don't use string templates with spaces to specify CSS classes
 * @author Benjamin Van Ryseghem and Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const classNameKeywords = ["className"];
const MESSAGE = "Template strings with multiple classes are not accepted as class name value.";

const spacesRegex = /\s+/g;

/**
 * Transform a template literal `node` into a string representing an
 * JS array. The template literal is split at spaces.
 *
 * @param {TemplateLiteral} node - The template literal to split
 * @param {SourceCode} sourceCode - Give access to portions of the
 *   initial source code
 *
 * @return {Function} A function taking a `fixer` as argument and
 *   replacing `node` with the array.
 */
function explodeTemplateLiteral(node, sourceCode) {
	return (fixer) => {
		let arrayElements = findGroupsInTemplateLiteral(node)
			.map(group => prettyPrintGroup(group, sourceCode))
			.join(", ");

		return fixer.replaceText(node, `[${arrayElements}]`);
	};
}

/**
 * Tranform a template literal `node` into an array of groups. A group
 * is created for each space-separated portion. A group is an array of
 * alternating strings and expressions (possibly with just 1
 * element). For example, the template literal
 *
 * `foo bar1-${plip}-bar2 ${plop}`
 *
 * would be transformed into something looking like:
 *
 * ["foo", ["bar1", Expression("plip"), "bar2"], [Expression("plop")]]
 *
 * @param {TemplateLiteral} node - The template literal to split
 *
 * @return {(string|Expression)[]} The groups extracted out of `node`
 */
function findGroupsInTemplateLiteral(node) {
	let groups = [];

	// indices inside the quasis and expressions arrays:
	let quasisIndex = 0;
	let expressionsIndex = 0;

	// index of the next portion of interest inside the current quasi:
	let quasiTextIndex = 0;

	createGroup(groups);

	while(hasNext(quasisIndex, node.quasis) || hasNext(expressionsIndex, node.expressions)) {
		let currentQuasi = getNext(quasisIndex, node.quasis);
		let currentExpression = getNext(expressionsIndex, node.expressions);

		if(isFirstInSourceCode(currentQuasi, currentExpression)) {
			// handle quasi
			let {hasMorePortions, portionOfInterest, indexOfNextPortion} = extractPortionOfInterest(currentQuasi, quasiTextIndex);

			quasiTextIndex = indexOfNextPortion;

			if(portionOfInterest) pushToCurrentGroup(portionOfInterest, groups);

			if (hasMorePortions) {
				createGroup(groups);
			} else {
				quasisIndex++;
			}
		}  else {
			// handle expression
			pushToCurrentGroup(currentExpression, groups);
			expressionsIndex++;
		}
	}

	return groups;
}

/**
 * Check if there are more elements in `nodes` after `index`.
 */
function hasNext(index, nodes) {
	return index < nodes.length;
}

/**
 * Return the node at `index` in `nodes` if there is one or a fake
 * node.
 */
function getNext(node, nodes) {
	return node < nodes.length ? nodes[node] : {range: [Infinity]};
}

/**
 * Return true if `node1` arrives before `node2` in the source
 * code, false otherwise.
 */
function isFirstInSourceCode(node1, node2) {
	return node1.range[0] < node2.range[0];
}

/**
 * Find the next part of `currentQuasi` to take care of. This part
 * starts at `quasiTextIndex` and stops at the next space or at the
 * end of `currentQuasi`. So, if `currentQuasi` is "foo bar baz" and
 * `quasiTextIndex` is 4, the next portion will be "bar".
 *
 * @param {TemplateElement} currentQuasi - The quasi to search into
 * @param {integer} quasiTextIndex - A positive integer (possibly 0)
 *   indicating which part of the quasi should the function start
 *   looking at
 *
 * @return {object} The portion of interest (a string) as well as
 *   information about where to start looking for the next portion
 */
function extractPortionOfInterest(currentQuasi, quasiTextIndex) {
	let currentQuasiValue = currentQuasi.value.raw.replace(spacesRegex, " ");
	let indexOfSpace = currentQuasiValue.indexOf(" ", quasiTextIndex);
	let spaceFound = indexOfSpace !== -1;

	let endOfPortionOfInterest = spaceFound ? indexOfSpace : undefined;
	let portionOfInterest = currentQuasiValue.substring(quasiTextIndex, endOfPortionOfInterest);

	return {
		portionOfInterest,
		indexOfNextPortion: spaceFound ? indexOfSpace + 1 : 0,
		hasMorePortions: spaceFound
	};
}

/**
 * Create and add a group at the end of `groups`.
 */
function createGroup(groups) {
	let group = [];
	groups.push(group);
	return group;
}

/**
 * Push `value` inside the last group of `groups`.
 */
function pushToCurrentGroup(value, groups) {
	currentGroup(groups).push(value);
}

/**
 * Return the last group in `groups`.
 */
function currentGroup(groups) {
	return groups[groups.length - 1];
}

/**
 * Return a string representing the `group` elements. A group is an
 * array of alternating strings and expressions (possibly with just 1
 * element).
 *
 * @param {(string|expression)[]} group - The group to pretty print.
 * @param {SourceCode} sourceCode - Give access to portions of the
 *   initial source code
 *
 * @return {string}
 */
function prettyPrintGroup(group, sourceCode) {
	return group.length === 1
		? prettyPrintSingletonGroup(group, sourceCode)
		: "`" +  prettyPrintNonSingletonGroup(group, sourceCode) + "`";
}

/**
 * Return a string representing the `group`'s first element. `group`
 * is a singleton array of either a string or an expression.
 *
 * @param {(string|expression)[]} group - The group to pretty print.
 * @param {SourceCode} sourceCode - Give access to portions of the
 *   initial source code
 *
 * @return {string}
 */
function prettyPrintSingletonGroup(group, sourceCode) {
	let onlyPart = group[0];

	if(typeof onlyPart === "string") {
		return `"${onlyPart}"`;
	} else {
		return sourceCode.getText(onlyPart);
	}
}

/**
 * Return a string representing the `group` elements. `group` is an
 * array of more than one alternating strings and expressions.
 *
 * @param {(string|expression)[]} group - The group to pretty print.
 * @param {SourceCode} sourceCode - Give access to portions of the
 *   initial source code
 *
 * @return {string}
 */
function prettyPrintNonSingletonGroup(group, sourceCode) {
	return group
		.map(part => prettyPrintGroupItem(part, sourceCode))
		.join("");
}

/**
 * Return a string representing `part`, either a string or an
 * expression.
 *
 * @param {string|expression} part - The part to pretty print.
 * @param {SourceCode} sourceCode - Give access to portions of the
 *   initial source code
 *
 * @return {string}
 */
function prettyPrintGroupItem(part, sourceCode) {
	if (typeof part === "string") {
		return part;
	} else {
		return "${" + sourceCode.getText(part) + "}";
	}
}

function getKeywordOption(options) {
	if (!options || !options[0] || !options[0].keywords) {
		return classNameKeywords;
	}

	return options[0].keywords;
}

function checkTemplateLiteral(node, context) {
	if (node.type === "ArrayExpression") {
		node.elements.forEach((element) => {
			checkTemplateLiteral(element, context);
		});
	}

	if (node.type !== "TemplateLiteral") {
		return;
	}

	let hasSpaceInQuasis = node.quasis.some((each) => {
		return each.value.cooked.match(spacesRegex);
	});

	if (hasSpaceInQuasis) {
		context.report({
			node: node,
			message: MESSAGE,
			fix: explodeTemplateLiteral(node, context.getSourceCode())
		});
	}
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

				checkTemplateLiteral(node.value, context);
			}
		};
	}
}

module.exports.schema = [
	{
		type: "object",
		properties: {
			keywords: {
				type: "array",
				items: { type: "string" }
			}
		},
		additionalProperties: false
	}
];
