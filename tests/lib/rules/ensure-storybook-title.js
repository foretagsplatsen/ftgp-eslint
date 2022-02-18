/**
 * @fileoverview Ensure title of a CSF matches the folder in which it is
 * @author Benjamin Van Ryseghem
 * @copyright 2022 finsit. All rights reserved.
 * See LICENSE file in root directory for full license.
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ensure-storybook-title"),

	RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ensure-storybook-title", rule, {

	valid: [
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/widgets/ForecastCellInfoWidget",
};`,
			filename: "fooboo/Client/js/accounting/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			parserOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
};`,
			filename: "fooboo/Client/js/accounting/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			parserOptions: { ecmaVersion: 6, sourceType: "module" },
		}
	],

	invalid: [
		{
			code: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/widgets/ForecastCellInfoWidget",
};`,
			filename: "fooboo/Client/js/accounting/core/ForecastCellInfoWidget/ForecastCellInfoWidget.js",
			parserOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					message: "CSF title not matching the file path",
					type: "Literal"
				},
			],
			output: `export default {
\tcomponent: ForecastCellInfoWidget,
\ttitle: "accounting/core/ForecastCellInfoWidget",
};`,
		}
	],
});
