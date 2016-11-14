# All polyglot should be translated (no-untranslated-polyglots)

A tool must statically track all usages of `_(...)` to add strings to
a translation table. As a result, polyglot only accepts string
literals.

## Rule Details

This rule aims to ensure only string literals are passes to the `_` function.

The following patterns are considered warnings:

```js
_(someValue);
_('There are' + nb + ' persons');
```

The following patterns are not warnings:

```js
_('Welcome on board');
```
