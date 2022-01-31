# Don't use string templates with spaces to specify CSS classes (no-class-name-template)

Use an array instead of a string template to specify multiple CSS classes.


## Rule Details

This rule makes code easier to read.

The following pattern triggers a warning:

```js
html.div({className: `bar ${this._value < 0 ? "negative" : ""}`, …)
```

The following pattern triggers no warning:

```js
html.div({className: ["bar", this._value < 0 ? "negative" : ""], …)
```

## When Not To Use It

When you don't mind having hard to read CSS class names.
