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

let ruleTester = new RuleTester();
let parserOptions = { ecmaVersion: 6, sourceType: "module" };

ruleTester.run("ensure-storybook-title", rule, {

	valid: [
		{
			code: `export default {
\ttitle: "accounting/widgets/ForecastCellInfoWidget",
};`,
			filename: "fooboo/Client/js/accounting/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			parserOptions,
		},
		{
			code: `export default {
\ttitle: "accounting/widgets/ForecastCellInfoWidget",
};`,
			filename: "/Users/fooboo/work/src/accounting/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			parserOptions,
			options: [
				{
					root: "work/src"
				}
			]
		}
	],

	invalid: [
		{
			code: `export default {
\ttitle: "accounting/widgets/ForecastCellInfoWidget",
};`,
			filename: "fooboo/Client/js/accounting/core/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			parserOptions,
			errors: [
				{
					message: "CSF title not matching the file path",
					type: "Literal"
				},
			],
			output: `export default {
\ttitle: "accounting/core/ForecastCellInfoWidget",
};`,
		},
		{
			code: `export default {
};`,
			filename: "fooboo/Client/js/accounting/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			parserOptions,
			errors: [
				{
					message: "CSF has no title",
					type: "ObjectExpression"
				},
			],
			output: `export default {
title: "accounting/widgets/ForecastCellInfoWidget"};`,
		},
	],
});
