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

* Fill in provided rules here





