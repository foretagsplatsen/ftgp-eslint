# Ensure the dependencies are loaded in the correct order (ensure-dependency-order)

Check the match between the file loaded and the argument provided to ensure the order is correct.

## Rule Details

This rule aims to ensure the list of arguments provided to the `define` callback is correctly ordered.

The following patterns are considered warnings:

```js

define(['foo', 'bar'], function(bar, foo){})

```

The following patterns are not warnings:

```js

define(['foo/bar'], function(bar){})
define(['foo/bar', 'foo'], function(bar){})
define(['foo/bar'], function(barModel){})

```

### Options

The only option available is a map of aliases when the resolution need to not be based on the file name.

By example, the following line is considered warning:

```js

define(['jquery'], function(jQuery){})

```
unless an aliases map is provided, like:

```js

{
	jquery: "jQuery"
}

```

The alias map values can also be an array of possible names.

By example:

```js

{
	jquery: ["jQuery", "$"]
}

```