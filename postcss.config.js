module.exports = {
	plugins: [
		require("postcss-import")(),
		require("postcss-preset-env")(),
		require("cssnano")({
			preset: [
				"default",
				{
					mergeRules: false,
					discardComments: {
						removeAll: true,
					},
				},
			],
		}),
	],
};
