# Ensure that no action is manually declared when the framework covers it

Detect manually specified actions where the framework already detects them.

## Rule Details

This rule aims to avoid useless code.

The following patterns are considered warnings:

```js
// pattern is "^when[A-Z].*|Callback$"
args: {
    whenSave: action("Save")
}
```

The following patterns are not warnings:

```js
// pattern is "^on[A-Z].*|Callback$"
args: {
    whenSave: action("Save")
}
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
