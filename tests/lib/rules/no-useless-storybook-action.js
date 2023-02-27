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

let ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 6, sourceType: "module" },
});

const errors = [
	{
		messageId: "useless-action",
		type: "CallExpression",
	},
];

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
		},
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/forecastEditor/widgets/ForecastCellInfoWidget",
\targs: {
\t\tonSave: () => { myWidget.onClick(action("Save")); }
\t},
};`,
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
			options: [
				{
					pattern: "^when[A-Z].*|Callback$",
				},
			],
			errors,
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
			options: [
				{
					pattern: "^when[A-Z].*|Callback$",
				},
			],
			errors,
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
			options: [
				{
					pattern: "^when[A-Z].*|Callback$",
				},
			],
			errors,
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
			options: [
				{
					pattern: "^when[A-Z].*|Callback$",
				},
			],
			errors,
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
