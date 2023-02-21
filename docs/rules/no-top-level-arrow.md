# Don't use fat arrow to define top-level functions

Prefer the `function` keyword to declare functions at the top-level.

## Rule Details

The following pattern triggers a warning:

```js
const foo = () => {};
let foo = () => {};
var foo = () => {};
export const foo = () => {};
```

The following pattern triggers no warning:

```js
function foo() {}
const bar = 4;
```

## When Not To Use It

When you don't care about the consistency of top-level function
definitions or when you prefer using fat arrows everywhere.
