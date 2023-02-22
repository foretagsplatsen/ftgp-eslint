/**
 * @fileoverview Ensure that no action is manually declared when the framework covers it
 * @author Benjamin Van Ryseghem
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/no-useless-storybook-action"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester();
let parserOptions = { ecmaVersion: 6, sourceType: "module" };

ruleTester.run("no-useless-storybook-action", rule, {
	valid: [
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\twhenSave: action("Save")
\t},
};`,
			parserOptions,
		},
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\tonSave: () => { myWidget.onClick(action("Save")); }
\t},
};`,
			parserOptions,
		},
	],

	invalid: [
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\twhenSave: action("Save"),
\t},
};`,
			parserOptions,
			options: [
				{
					pattern: "^when[A-Z].*|Callback$",
				},
			],
			errors: [
				{
					message:
						"The action is already documented by the framework",
					type: "CallExpression",
				},
			],
			output: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\t
\t},
};`,
		},
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\twhenSave: action("Save")          ,
\t},
};`,
			parserOptions,
			options: [
				{
					pattern: "^when[A-Z].*|Callback$",
				},
			],
			errors: [
				{
					message:
						"The action is already documented by the framework",
					type: "CallExpression",
				},
			],
			output: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\t
\t},
};`,
		},
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\twhenSave: action("Save")
\t},
};`,
			parserOptions,
			options: [
				{
					pattern: "^when[A-Z].*|Callback$",
				},
			],
			errors: [
				{
					message:
						"The action is already documented by the framework",
					type: "CallExpression",
				},
			],
			output: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\t
\t},
};`,
		},
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\twhenSave: action("Save"),
\t\tfoo: 42,
\t},
};`,
			parserOptions,
			options: [
				{
					pattern: "^when[A-Z].*|Callback$",
				},
			],
			errors: [
				{
					message:
						"The action is already documented by the framework",
					type: "CallExpression",
				},
			],
			output: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\t
\t\tfoo: 42,
\t},
};`,
		},
	],
});
