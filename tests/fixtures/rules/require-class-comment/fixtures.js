module.exports = {
	valid: {
		params: '/**\n' +
		' * Foo\n' +
		' * @param {string} spec.bar - identifier\n with long description\n' +
		' * @param {number} spec.baz - number\n' +
		' */\n' +
		'model.subclass(function(that, my){\n' +
		'	my.initialize = function(spec) {\n' +
		'		my.bar = spec.bar\n' +
		'		my.baz = spec.baz\n' +
		'	};\n' +
		'})',
		destructuringUnnamed: '/**\n' +
		' * Foo\n' +
		' * @param {string} spec.bar - identifier\n with long description\n' +
		' */\n' +
		'model.subclass(function(that, my){\n' +
		'	my.initialize = function({bar}) {\n' +
		'		my.bar = bar\n' +
		'	};\n' +
		'})',
		destructuringNamed: '/**\n' +
		' * Foo\n' +
		' * @param {string} spec.bar - identifier\n with long description\n' +
		' */\n' +
		'model.subclass(function(that, my){\n' +
		'	my.initialize = function({bar: barValue}) {\n' +
		'		my.bar = barValue\n' +
		'	};\n' +
		'})',
		twoClasses: '/**\n' +
		' * Foo\n' +
		' */\n' +
		'var foo = object.subclass(function(){});\n\n' +
		'/**\n' +
		' * Bar\n' +
		' */\n' +
		'var bar = object.subclass(function(){});',
		optionalParams: '/**\n' +
		' * Foo\n' +
		' * @param {number} [spec.baz] - number\n' +
		' */\n' +
		'model.subclass(function(that, my){\n' +
		'	my.initialize = function(spec) {\n' +
		'		my.baz = spec.baz\n' +
		'	};\n' +
		'})',
		paramsWithDefaultValue: '/**\n' +
		' * Foo\n' +
		' * @param {string} spec.bar - identifier\n with long description\n' +
		' */\n' +
		'model.subclass(function(that, my){\n' +
		'	my.initialize = function({bar: barValue} = {}) {\n' +
		'		my.bar = barValue\n' +
		'	};\n' +
		'})'
	},
	invalid: {
		missingDash: {
			code: '/**\n' +
			' * Awesome description\n' +
			' * @param {boolean} foo Foo\n' +
			' */\n' +
			'model.subclass(function(){});',
			errors: [
				{
					message: 'JSDoc parameter description for \'foo\' should start with \'-\'.',
					type: 'Block'
				}
			]
		},
		missingParams: {
			code: '/**\n' +
			' * Foo\n' +
			' * @param {string} spec.bar - identifier\n' +
			' */\n' +
			'model.subclass(function(that, my){\n' +
			'	my.initialize = function(spec) {\n' +
			'		my.bar = spec.bar\n' +
			'		my.baz = spec.baz\n' +
			'	};\n' +
			'})',
			errors: [
				{
					message: 'Missing JSDoc for parameter \'spec.baz\'.',
					type: 'Block'
				}
			]
		},
		missingParamsDestructuring: {
			code: '/**\n' +
			' * Foo\n' +
			' * @param {string} spec.bar - identifier\n' +
			' */\n' +
			'model.subclass(function(that, my){\n' +
			'	my.initialize = function({bar, baz}) {\n' +
			'		my.bar = bar\n' +
			'		my.baz = baz\n' +
			'	};\n' +
			'})',
			errors: [
				{
					message: 'Missing JSDoc for parameter \'spec.baz\'.',
					type: 'Block'
				}
			]
		},
		extraParams: {
			code: '/**\n' +
			' * Foo\n' +
			' * @param {string} spec.bar - identifier\n' +
			' * @param {string} spec.baz - identifier\n' +
			' */\n' +
			'model.subclass(function(that, my){\n' +
			'	my.initialize = function(spec) {\n' +
			'		my.bar = spec.bar\n' +
			'	};\n' +
			'})',
			errors: [
				{
					message: 'Non-matching JSDoc parameter \'spec.baz\'.',
					type: 'Block'
				}
			]
		},
		extraParamsDestructuring: {
			code: '/**\n' +
			' * Foo\n' +
			' * @param {string} spec.bar - identifier\n' +
			' * @param {string} spec.baz - identifier\n' +
			' */\n' +
			'model.subclass(function(that, my){\n' +
			'	my.initialize = function({bar}) {\n' +
			'		my.bar = bar\n' +
			'	};\n' +
			'})',
			errors: [
				{
					message: 'Non-matching JSDoc parameter \'spec.baz\'.',
					type: 'Block'
				}
			]
		},
		duplicateParams: {
			code: '/**\n' +
			' * Foo\n' +
			' * @param {string} spec.bar - identifier\n' +
			' * @param {string} spec.bar - identifier\n' +
			' */\n' +
			'model.subclass(function(that, my){\n' +
			'	my.initialize = function(spec) {\n' +
			'		my.bar = spec.bar\n' +
			'	};\n' +
			'})',
			errors: [
				{
					message: 'Duplicate JSDoc parameter \'spec.bar\'.',
					type: 'Block'
				}
			]
		},
		duplicateParamsDestructuring: {
			code: '/**\n' +
			' * Foo\n' +
			' * @param {string} spec.bar - identifier\n' +
			' * @param {string} spec.bar - identifier\n' +
			' */\n' +
			'model.subclass(function(that, my){\n' +
			'	my.initialize = function({bar}) {\n' +
			'		my.bar = bar\n' +
			'	};\n' +
			'})',
			errors: [
				{
					message: 'Duplicate JSDoc parameter \'spec.bar\'.',
					type: 'Block'
				}
			]
		},
		innerComment: {
			code: 'model.subclass(function(that){\n' +
			'	/**\n' +
			'	 * foo\n' +
			'	*/\n' +
			'	that.foo = function(){}\n' +
			'})',
			errors: [
				{
					message: "Missing JSDoc comment.",
					type: "CallExpression"
				}
			]
		}
	}
};
