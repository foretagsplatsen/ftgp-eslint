# Require each class to have a well formed class comment (require-class-comment)

Ensure that the Objectjs classes have a well formed class comment (jsdoc).

## Rule Details

This rule aims to ensure every class has a valid class comment.

The following patterns are considered warnings:

```js

object.subclass(function() {});

```

The following patterns are not warnings:

```js

/**
 * New class is awesome
 * @return {klass} a new class
 */
object.subclass(function() {});

```