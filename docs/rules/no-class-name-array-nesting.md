# Don't use arrays inside arrays to specify CSS classes (no-class-name-array-nesting)

Use just 1 top-level array to specify multiple CSS classes.


## Rule Details

This rule makes code easier to read.

The following pattern triggers a warning:

```js
html.div({className: ["foo", ["bar"]], …)
```

The following pattern triggers no warning:

```js
html.div({className: ["foo", "bar"], …)
```

## When Not To Use It

When you don't mind having hard to read CSS class names.
