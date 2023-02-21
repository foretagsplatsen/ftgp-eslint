/**
 * @fileoverview Don't use fat arrow to define top-level functions
 * @author Damien Cassou
 * @copyright 2023 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function isTopLevelWithArrowFunction(variableDeclaration) {
	return (
		isTopLevel(variableDeclaration) &&
		isVariableDeclarationWithArrowFunction(variableDeclaration)
	);
}

function isTopLevel(node) {
	return (
		node.parent.type === "Program" ||
		node.parent.type === "ExportNamedDeclaration"
	);
}

function isVariableDeclarationWithArrowFunction(variableDeclaration) {
	return variableDeclaration.declarations.some(isArrowFunctionDeclarator);
}

function isArrowFunctionDeclarator(variableDeclarator) {
	return variableDeclarator.init?.type === "ArrowFunctionExpression";
}

function convertDeclaratorToString(variableDeclarator, kind, sourceCode) {
	return isArrowFunctionDeclarator(variableDeclarator)
		? convertArrowFunctionDeclaratorToString(variableDeclarator, sourceCode)
		: `${kind} ${convertNonArrowFunctionDeclaratorToString(
				variableDeclarator,
				sourceCode
		  )}`;
}

function convertArrowFunctionDeclaratorToString(
	variableDeclarator,
	sourceCode
) {
	let init = variableDeclarator.init;
	let asyncString = init.async ? "async " : "";
	let functionName = sourceCode.getText(variableDeclarator.id);
	let paramsString = init.params
		.map((param) => sourceCode.getText(param))
		.join(", ");
	let bodyString = sourceCode.getText(init.body);

	if (init.body.type !== "BlockStatement") {
		bodyString = `{return ${bodyString};}`;
	}

	return `${asyncString}function ${functionName}(${paramsString}) ${bodyString}`;
}

function convertNonArrowFunctionDeclaratorToString(
	variableDeclarator,
	sourceCode
) {
	let variableName = sourceCode.getText(variableDeclarator.id);
	let variableInit = variableDeclarator.init;

	return `${variableName} = ${sourceCode.getText(variableInit)}`;
}

function replaceArrowFunctionWithFunctionKeyword(
	fixer,
	variableDeclaration,
	context
) {
	let sourceCode = context.getSourceCode();
	let replacementText = variableDeclaration.declarations
		.map((declarator) =>
			convertDeclaratorToString(
				declarator,
				variableDeclaration.kind,
				sourceCode
			)
		)
		.join(";\n");

	return fixer.replaceText(variableDeclaration, replacementText);
}

module.exports = {
	meta: {
		fixable: "code",
		schema: [],
		type: "suggestion",
		messages: {
			message:
				"Prefer the function keyword to define top-level functions.",
		},
	},
	create: function (context) {
		return {
			VariableDeclaration: function (node) {
				if (isTopLevelWithArrowFunction(node)) {
					context.report({
						node,
						messageId: "message",
						fix: (fixer) =>
							replaceArrowFunctionWithFunctionKeyword(
								fixer,
								node,
								context
							),
					});
				}
			},
		};
	},
};
