# Ensure that my.initialize overrides perform a super call

Check that all implementations of `my.initialize` perform a super call with the correct argument.

## Rule Details

This rule aims to ensure that all overrides of `my.initialize` will perform a valid super call to correctly initialize new instances.

The following patterns are considered warnings:

```js

my.initialize = function(spec) {
    my.super();
}

my.initialize = function(spec) {
    my.a = spec.a;
}

```

The following patterns are not warnings:

```js

my.initialize = function(spec) {
    my.super(spec);
    my.a = spec.a;
}

```
