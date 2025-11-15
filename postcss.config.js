import postcssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";
import cssnano from "cssnano";

export default {
	plugins: [
		postcssImport(),
		postcssPresetEnv(),
		cssnano({
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
