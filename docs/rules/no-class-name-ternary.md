# Don't ternary expressions to specify CSS classes (no-class-name-ternary)

Use object syntax to specify a CSS class name that should only be added in some circumstances.


## Rule Details

This rule makes code easier to read.

The following pattern triggers a warning:

```js
html.div({className: this._value < 0 ? "negative" : "", …)
```

The following pattern triggers no warning:

```js
html.div({className: {negative: this._value < 0}, …)
```

This pattern with a choice of 2 class names depending on a condition
also triggers a warning:

```js
html.div({className: this._value < 0 ? "negative" : "positive", …)
```

The best way to fix such warning is to (1) remove all references to
the "positive" CSS class by making it the default in CSS and then (2)
use JS code such as:

```js
html.div({className: {negative: this._value < 0}, …)
```

## When Not To Use It

When you don't mind having hard to read CSS class names.
