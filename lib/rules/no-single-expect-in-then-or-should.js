/**
 * @fileoverview Simplify tests by avoiding some usages of expect()
 * @author Damien Cassou
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const MESSAGE_THEN = "A single expect() in a then() can be rewritten with a should().";
const MESSAGE_SHOULD = "A single expect() in a should() can be rewritten without expect().";

function calleeName(node) {
	return node.callee.name || node.callee.property?.name;
}

function getExpectArgument(node,context) {
	if(node.type === "MemberExpression") {
		return getExpectArgument(node.object,context);
	}

	if(node.type !== "CallExpression") return undefined;

	let functionName = calleeName(node);

	if (functionName != "expect") return undefined;

	// Check expect() takes 1 and only 1 argument:
	if(node.arguments.length != 1) return undefined;

	return node.arguments[0].name;
}

function fixCall(fixer,node,context,expectExpression) {
	let sourceCode = context.getSourceCode();

	let assertionArgumentString = "";
	let assertion = expectExpression;

	if(expectExpression.type === "CallExpression") {
		assertionArgumentString = ", " + sourceCode.getText(expectExpression.arguments[0]);
		assertion = expectExpression.callee;
	}

	let assertionWithExpectString = sourceCode.getText(assertion);
	let expectRegexp = /^expect\([^)]*\)\.(not\.)?(?:to\.)?(.*)$/;
	let [_,isNegated,assertionWithoutExpectString] = assertionWithExpectString.match(expectRegexp);
	let assertionString = isNegated ? `not.${assertionWithoutExpectString}`:assertionWithoutExpectString;


	let thenSubjectString = sourceCode.getText(node.callee.object);
	let replacement = `${thenSubjectString}.should("${assertionString}"${assertionArgumentString})`;
	return fixer.replaceText(node, replacement);
}

function checkThen(node,context) {
	// Check there is 1 and only 1 argument to the then() call:
	if(node.arguments.length !== 1) return;

	let argument = node.arguments[0];

	if(argument.type !== "ArrowFunctionExpression") return;

	// Check the function argument takes 1 and only 1 argument:
	if(argument.params.length !== 1) return;

	let thenArgumentName = argument.params[0].name;

	// Check there is 1 and only 1 expression in the body:
	if(!argument.body?.body || argument.body.body.length != 1) return;

	let thenArgumentBody = argument.body.body[0];

	if(thenArgumentBody.type !== 'ExpressionStatement') return;

	let object = undefined;

	switch (thenArgumentBody.expression.type) {
	case "CallExpression":
		object = thenArgumentBody.expression.callee;
		break;
	case "MemberExpression":
		object = thenArgumentBody.expression.object;
		break;
	}

	if(!object) return;

	let expectArgument = getExpectArgument(object,context);

	if(expectArgument && expectArgument === thenArgumentName) {
		context.report({
			node: node,
			message: MESSAGE_THEN,
			fix: (fixer) => fixCall(fixer,node,context,thenArgumentBody.expression)
		});
	}
}

module.exports = {
	meta: {fixable: "code"},
	create: function(context) {
		return {
			CallExpression: function(node) {
				if (node.callee.type !== "MemberExpression") return;

				let functionName = node.callee.property.name;

				if(["then","should"].includes(functionName)) {
					checkThen(node,context);
				}
			}
		};
	}
}
