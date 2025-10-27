/** @type {import("prettier").Config} */
export default {
	arrowParens: "always",
	bracketSpacing: false,
	printWidth: 100,
	trailingComma: "es5",
	overrides: [
		{
			files: "*.webmanifest",
			options: {
				parser: "json",
			},
		},
	],
};
