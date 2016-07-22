module.exports = {
	valid: {
		params: '/**\n' +
		' * Foo\n' +
		' * @param {string} spec.bar identifier\n' +
		' * @param {number} spec.baz number\n' +
		' */\n' +
		'model.subclass(function(that, my){\n' +
		'	my.initialize = function(spec) {\n' +
		'		my.bar = spec.bar\n' +
		'		my.baz = spec.baz\n' +
		'	};\n' +
		'})',
		twoClasses: '/**\n' +
		' * Foo\n' +
		' */\n' +
		'var foo = object.subclass(function(){});\n\n' +
		'/**\n' +
		' * Bar\n' +
		' */\n' +
		'var bar = object.subclass(function(){});'
	},
	invalid: {
		missingParams: {
			code: '/**\n' +
			' * Foo\n' +
			' * @param {string} spec.bar identifier\n' +
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
		extraParams: {
			code: '/**\n' +
			' * Foo\n' +
			' * @param {string} spec.bar identifier\n' +
			' * @param {string} spec.baz identifier\n' +
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
		duplicateParams: {
			code: '/**\n' +
			' * Foo\n' +
			' * @param {string} spec.bar identifier\n' +
			' * @param {string} spec.bar identifier\n' +
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