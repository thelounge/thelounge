module.exports = {
	plugins: [
		require("postcss-import")(),
		// @ts-ignore FIXME: ts-node can't import this on CommonJS
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
