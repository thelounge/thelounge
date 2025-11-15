import {volarPrettierPlugin} from "@volar-plugins/prettier";

export default {
	plugins: [
		volarPrettierPlugin({
			languages: ["html", "css", "scss", "typescript", "javascript"],
			html: {
				breakContentsFromTags: true,
			},
			useVscodeIndentation: true,
		}),
	],
};
