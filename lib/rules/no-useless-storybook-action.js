/**
 * @fileoverview Ensure that no action is manually declared when the framework covers it
 * @author Benjamin Van Ryseghem
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

const USELESS_ACTION = "The action is already documented by the framework";

const defaultPattern = "^on[A-Z].*|Callback$";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function getPatternOption(options) {
	if (!options || !options[0] || !options[0].pattern) {
		return defaultPattern;
	}

	return options[0].pattern;
}

function fixUselessAction({ parent, context }) {
	return (fixer) => {
		let sourceCode = context.getSourceCode();
		let { range } = parent;
		let followingText = sourceCode.getText().slice(range[1]);
		let match = followingText.match(/^(\s*,)/);
		if (!match) {
			return fixer.remove(parent);
		}
		return fixer.removeRange([range[0], range[1] + match[0].length]);
	};
}

module.exports = {
	meta: {
		fixable: "code",
	},
	create: function (context) {
		return {
			CallExpression: function (node) {
				let { callee } = node;
				let pattern = getPatternOption(context.options);

				if (callee?.name !== "action") {
					return;
				}

				let { parent } = node;
				if (parent.type !== "Property") {
					return;
				}

				let propertyName = parent.key?.name;
				if (!propertyName || !propertyName.match(pattern)) {
					return;
				}

				context.report({
					node,
					message: USELESS_ACTION,
					fix: fixUselessAction({ parent, context }),
				});
			},
		};
	},
};

module.exports.schema = [
	{
		type: "object",
		properties: {
			pattern: {
				type: "string",
			},
		},
		additionalProperties: false,
	},
];
