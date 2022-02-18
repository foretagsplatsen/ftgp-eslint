# Ensure that no action is manually declared when the framework covers it

Detect manually specified actions where the framework already detects them.

## Rule Details

This rule aims to avoid useless code.

The following is considered warning:

```js
// pattern is "^when[A-Z].*|Callback$"
args: {
    whenSave: action("Save")
}
```

The following is not warning:

```js
// pattern is "^on[A-Z].*|Callback$"
args: {
    whenSave: action("Save")
}
```

### Options

{string} pattern - Pattern for the callbacks in storybook
