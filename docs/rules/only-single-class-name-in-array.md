# Don't use space-separated string to specify CSS classes in an array (only-single-class-name-in-array)

If using an array to specify CSS class names, you should avoid also using space-separated strings as array elements.

## Rule Details

This rule makes code easier to read.

The following pattern triggers a warning:

```js
html.div({className: ["foo bar", "baz"], …)
```

The following pattern triggers no warning:

```js
html.div({className: ["foo", "bar", "baz"], …)
```

## When Not To Use It

When you don't mind having hard to read CSS class names.
