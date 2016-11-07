# eslint-plugin-ftgp

[![Build Status](https://travis-ci.org/foretagsplatsen/ftgp-eslint.svg?branch=master)](https://travis-ci.org/foretagsplatsen/ftgp-eslint)

Custom rules for FTGP

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-ftgp`:

```
$ npm install eslint-plugin-ftgp --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-ftgp` globally.

## Usage

Add `ftgp` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "ftgp"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "ftgp/rule-name": 2
    }
}
```

## Supported Rules

- ensure-dependency-order: see [documentation](./docs/rules/ensure-dependency-order.md).
- indent: see [documentation](./docs/rules/indent.md).
- no-concatenated-polyglots: see [documentation](./docs/rules/no-concatenated-polyglots.md).
- no-dot-dot-in-define: see [documentation](./docs/rules/no-dot-dot-in-define.md).
- no-define-on-multiple-lines: see [documentation](./docs/rules/no-define-on-multiple-lines.md).
- no-define-unused-dependency: see [documentation](./docs/rules/no-define-unused-dependency.md).
- no-define-with-lees-than-2-arguments: see [documentation](./docs/rules/no-define-with-lees-than-2-arguments.md).
- no-untranslated-polyglots: see [documentation](./docs/rules/no-untranslated-polyglots.md).
- no-untrimmed-polyglots: see [documentation](./docs/rules/no-untrimmed-polyglots.md).
- only-literal-polyglots: see [documentation](./docs/rules/only-literal-polyglots.md).

## Contributing

Run all tests with:

```
npm test
```

Run only a specific test with:

```
mocha tests/lib/rules/only-literal-polyglots.js  --reporter progress
```

Add a new rule with [Yeoman's generator-eslint](https://www.npmjs.com/package/generator-eslint).

Release a new version by:
1. running the tests
1. changing the `version` property in `package.json`
1. running `npm publish`
1. committing the new `package.json`
1. creating the release on github
