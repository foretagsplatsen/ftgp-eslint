/**
 * @fileoverview No arguments in the define callback should be unused
 * @author Benjamin Van Ryseghem
 * @copyright 2016 Benjamin Van Ryseghem. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// See https://github.com/eslint/eslint/blob/master/lib/rules/no-unused-vars.js
module.exports = function(context) {
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reHasRegExpChar = RegExp(reRegExpChar.source);
    var MESSAGE = '\'{{name}}\' is defined as dependency but never used';

    function escapeRegExp(string) {
        string = toString(string);
        return (string && reHasRegExpChar.test(string))
            ? string.replace(reRegExpChar, '\\$&')
            : string;
    }

    function isExported(variable) {

        var definition = variable.defs[0];

        if (definition) {

            var node = definition.node;
            if (!node) {
                return false;
            }
            if (node.type === 'VariableDeclarator') {
                node = node.parent;
            } else if (definition.type === 'Parameter') {
                return false;
            }

            return node.parent.type.indexOf('Export') === 0;
        } else {
            return false;
        }
    }

    function isReadRef(ref) {
        return ref.isRead();
    }

    function isSelfReference(ref, nodes) {
        var scope = ref.from;

        while (scope) {
            if (nodes.indexOf(scope.block) >= 0) {
                return true;
            }

            scope = scope.upper;
        }

        return false;
    }

    function isUsedVariable(variable) {
        var functionNodes = variable.defs.filter(function(def) {
            return def.type === 'FunctionName';
        }).map(function(def) {
            return def.node;
        });

        var isFunctionDefinition = functionNodes.length > 0;

        return variable.references.some(function(ref) {
            return isReadRef(ref) && !(isFunctionDefinition && isSelfReference(ref, functionNodes));
        });
    }

    function collectUnusedVariables(scope, unusedVars) {
        var variables = scope.variables;
        var childScopes = scope.childScopes;
        var i;
        var l;

        if (scope.type !== 'TDZ' && (scope.type !== 'global')) {
            for (i = 0, l = variables.length; i < l; ++i) {
                var variable = variables[i];

                // skip a variable of class itself name in the class scope
                if (scope.type === 'class' && scope.block.id === variable.identifiers[0]) {
                    continue;
                }
                // skip function expression names and variables marked with markVariableAsUsed()
                if (scope.functionExpressionScope || variable.eslintUsed) {
                    continue;
                }
                // skip implicit 'arguments' variable
                if (scope.type === 'function' && variable.name === 'arguments' && variable.identifiers.length === 0) {
                    continue;
                }

                // explicit global variables don't have definitions.
                var def = variable.defs[0];
                if (def) {
                    var type = def.type;

                    // skip catch variables
                    if (type === 'CatchClause') {
                        continue;
                    }

                    if (type === 'Parameter') {
                        // skip any setter argument
                        if (def.node.parent && def.node.parent.type === 'Property' && def.node.parent.kind === 'set') {
                            continue;
                        }
                    }
                }

                if (!isUsedVariable(variable) && !isExported(variable)) {
                    unusedVars.push(variable);
                }
            }
        }

        for (i = 0, l = childScopes.length; i < l; ++i) {
            collectUnusedVariables(childScopes[i], unusedVars);
        }

        return unusedVars;
    }

    function getColumnInComment(variable, comment) {
        var namePattern = new RegExp('[\\s,]' + escapeRegExp(variable.name) + '(?:$|[\\s,:])', 'g');

        // To ignore the first text 'global'.
        namePattern.lastIndex = comment.value.indexOf('global') + 6;

        // Search a given variable name.
        var match = namePattern.exec(comment.value);
        return match ? match.index + 1 : 0;
    }

    function getLocation(variable) {
        var comment = variable.eslintExplicitGlobalComment;
        var baseLoc = comment.loc.start;
        var column = getColumnInComment(variable, comment);
        var prefix = comment.value.slice(0, column);
        var lineInComment = (prefix.match(/\n/g) || []).length;

        if (lineInComment > 0) {
            column -= 1 + prefix.lastIndexOf('\n');
        } else {
            // 2 is for `/*`
            column += baseLoc.column + 2;
        }

        return {
            line: baseLoc.line + lineInComment,
            column: column
        };
    }

    function varIsAParam(varName, params) {
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (param.name === varName) {
                return true;
            }
        }
        return false;
    }

    return {
        'CallExpression:exit': function(node) {
            if (node.callee.name === 'define') {
                var functionNode = node.arguments[1];

                if (!functionNode) {
                    return;
                }
                if (functionNode.type !== 'FunctionExpression') {
                    return;
                }

                var unusedVars = collectUnusedVariables(context.getScope(), []);

                for (var i = 0, l = unusedVars.length; i < l; ++i) {
                    var unusedVar = unusedVars[i];

                    var unusedVarIsDeps = varIsAParam(unusedVar.name, functionNode.params);

                    if (!unusedVarIsDeps) {
                        return;
                    }

                    if (unusedVar.eslintExplicitGlobal) {
                        context.report({
                            node: node,
                            loc: getLocation(unusedVar),
                            message: MESSAGE,
                            data: unusedVar
                        });
                    } else if (unusedVar.defs.length > 0) {
                        context.report({
                            node: unusedVar.identifiers[0],
                            message: MESSAGE,
                            data: unusedVar
                        });
                    }
                }
            }
        }
    };
};

module.exports.schema = [
    // fill in your schema
];
