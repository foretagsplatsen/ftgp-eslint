# Simplify tests by avoiding some usages of expect()

## Rule Details

This rule makes code easier to read when a `then()` contains a single
call to `expect()`.

The following pattern triggers a warning:

```js
cy.wait("@PutCountry")
        .its("request.body.hiddenKeyFigureIds")
        .then((actualHiddenKeyFigureIds) => {
                expect(actualHiddenKeyFigureIds).to.have.members(
                        expectedHiddenKeyFigureIds
                );
        });
```

The following pattern triggers no warning:

```js
cy.wait("@PutCountry")
        .its("request.body.hiddenKeyFigureIds")
        .should("have.members", expectedHiddenKeyFigureIds);
```

## When Not To Use It

When you don't mind having hard to read code.
