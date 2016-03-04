# Fix indentation (indent)

Please describe the origin of the rule here.

We tend to format the code a bit differently from what eslint proposes, 
especially when thn first argument of a function is a literal object.

## Rule Details

This rule aims to ensure consistent formatting across the code base.

The following patterns are considered warnings:

```js

function({
	foo: 2
},
	4
);

```

The following patterns are not warnings:

```js

function({
		foo: 2
	},
	4
);

```

### Options

The same options as the eslint built-in `indent` rule.
The following is borrowed from the eslint documentation [here](http://eslint.org/docs/rules/indent).

The `indent` rule has two options:

* Indentation style, positive number or `tab` (see rule details for examples)
* Configuring optional validations, `Object`.
    * `SwitchCase` - Level of switch cases indent, 0 by default.
    * `VariableDeclarator` - Level of variable declaration indent, 1 by default. Can take an object to define separate rules for `var`, `let` and `const` declarations.

Level of indentation denotes the multiple of the indent specified. Example:

* Indent of 4 spaces with `VariableDeclarator` set to `2` will indent the multi-line variable declarations with 8 spaces.
* Indent of 2 spaces with `VariableDeclarator` set to `2` will indent the multi-line variable declarations with 4 spaces.
* Indent of 2 spaces with `VariableDeclarator` set to `{"var": 2, "let": 2, "const": 3}` will indent the multi-line variable declarations with 4 spaces for `var` and `let`, 6 spaces for `const` statements.
* Indent of tab with `VariableDeclarator` set to 2 will indent the multi-line variable declarations with 2 tabs.
* Indent of 2 spaces with SwitchCase set to 0 will not indent `SwitchCase` with respect to switch.
* Indent of 2 spaces with SwitchCase set to 2 will indent `SwitchCase` with 4 space with respect to switch.
* Indent of tabs with SwitchCase set to 2 will indent `SwitchCase` with 2 tabs with respect to switch.


2 space indentation with enabled switch cases indentation

```json
 "indent": [2, 2, {"SwitchCase": 1}]
```

4 space indention

```json
"indent": 2
```

2 space indentation

```json
"indent": [2, 2]
```

tabbed indentation

```json
"indent": [2, "tab"]
```

The following patterns are considered problems:

```js
/*eslint indent: [2, 2]*/

if (a) {
   b=c;
function foo(d) {
       e=f;
}
}
```

```js
/*eslint indent: [2, "tab"]*/

if (a) {
     b=c;
function foo(d) {
           e=f;
 }
}
```

```js
/*eslint indent: [2, 2, {"VariableDeclarator": 1}]*/
/*eslint-env es6*/

var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
    b = 2,
    c = 3;
```

```js
/*eslint indent: [2, 2, {"SwitchCase": 1}]*/

switch(a){
case "a":
    break;
case "b":
    break;
}
```

The following patterns are not considered problems:

```js
/*eslint indent: [2, 2]*/

if (a) {
  b=c;
  function foo(d) {
    e=f;
  }
}
```

```js
/*indent: [2, "tab"]*/

if (a) {
/*tab*/b=c;
/*tab*/function foo(d) {
/*tab*//*tab*/e=f;
/*tab*/}
}
```

```js
/*eslint indent: [2, 2, {"VariableDeclarator": 2}]*/
/*eslint-env es6*/

var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
    b = 2,
    c = 3;
```

```js
/*eslint indent: [2, 2, {"VariableDeclarator": { "var": 2, "let": 2, "const": 3}}]*/
/*eslint-env es6*/

var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
      b = 2,
      c = 3;
```

```js
/*eslint indent: [2, 4, {"SwitchCase": 1}]*/

switch(a){
    case "a":
        break;
    case "b":
        break;
}
```
