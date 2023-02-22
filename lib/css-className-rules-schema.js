module.exports = {
	schema: [
		{
			type: "object",
			properties: {
				keywords: {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			additionalProperties: false,
		},
	],
};
