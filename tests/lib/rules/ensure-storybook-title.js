/**
 * @fileoverview Ensure title of a CSF matches the folder in which it is
 * @author Benjamin Van Ryseghem
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/ensure-storybook-title"),
	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 6, sourceType: "module" },
});

ruleTester.run("ensure-storybook-title", rule, {
	valid: [
		{
			code: `export default {
\ttitle: "accounting/widgets/ForecastCellInfoWidget",
};`,
			filename:
				"fooboo/Client/js/accounting/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
		},
		{
			code: `export default {
\ttitle: "accounting/widgets/ForecastCellInfoWidget",
};`,
			filename:
				"/Users/fooboo/work/src/accounting/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			options: [
				{
					root: "work/src",
				},
			],
		},
	],

	invalid: [
		{
			code: `export default {
\ttitle: "accounting/widgets/ForecastCellInfoWidget",
};`,
			filename:
				"fooboo/Client/js/accounting/core/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			errors: [
				{
					messageId: "non-matching-title",
					type: "Literal",
				},
			],
			output: `export default {
\ttitle: "accounting/core/ForecastCellInfoWidget",
};`,
		},
		{
			code: `export default {
};`,
			filename:
				"fooboo/Client/js/accounting/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			errors: [
				{
					messageId: "missing-title",
					type: "ObjectExpression",
				},
			],
			output: `export default {
title: "accounting/widgets/ForecastCellInfoWidget"};`,
		},
	],
});
