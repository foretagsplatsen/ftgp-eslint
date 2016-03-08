# The path in `define` only goes down (no-dot-dot-in-define)

Only the path going down the file hierarchy is allowed.
Therefore, no `..` is allowed.


## Rule Details

This rule aims to prevent hard to maintain dependencies between files.

The following patterns are considered warnings:

```js

define(["../foo"]);
define(["bar/../foo"]);

```

The following patterns are not warnings:

```js

define(["foo"]);
define(["./foo"]);

```

## When Not To Use It

When directories are not intended to define a conceptual package.
