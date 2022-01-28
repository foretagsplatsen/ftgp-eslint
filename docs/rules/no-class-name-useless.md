# Don't over-complicate expressions to specify CSS classes (no-class-name-useless)

Use the simplest syntax to specify a CSS class names.

## Rule Details

This rule makes code easier to read.

The following pattern triggers a warning:

```js
html.div({className: ["foo", "bar"], …) // prefer a single space-separated string
html.div({className: " foo", …)         // avoid leading/trailing spaces
html.div({className: [], …)             // useless CSS class specification
html.div({className: [{foo}], …)        // replace singleton array with its element
html.div({className: [], …)             // useless CSS class specification
html.div({className: {foo: true}, …)    // prefer a string
html.div({className: {foo: false}, …)   // useless CSS class specification
```

The following pattern triggers no warning:

```js
html.div({className: "foo bar", …)
html.div({className: "foo", …)
html.div({className: {foo}, …)
```

## When Not To Use It

When you don't mind having hard to read CSS class names.
