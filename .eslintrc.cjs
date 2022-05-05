module.exports = {
	root: true,
	overrides: [
		{
			files: ["**/*.ts"],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				tsconfigRootDir: __dirname,
				parser: "@typescript-eslint/parser",
				project: ["./tsconfig.json", "./client/tsconfig.json", "./src/tsconfig.json"],
			},
			plugins: ["@typescript-eslint"],
			extends: [
				"eslint:recommended",
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"prettier",
			],
		},
	],
	parserOptions: {
		ecmaVersion: 2022,
		// sourceType: "module",
		// project: ["./eslint.tsconfig.json"],
		// extraFileExtensions: [".vue", ".cjs"],
	},
	// TODO: this should  just be for client?
	parser: "vue-eslint-parser",
	plugins: ["vue"],
	env: {
		es6: true,
		browser: true,
		mocha: true,
		node: true,
	},
	extends: [
		"plugin:vue/recommended",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
	],
	rules: {
		"block-scoped-var": "error",
		curly: ["error", "all"],
		"dot-notation": "error",
		eqeqeq: "error",
		"handle-callback-err": "error",
		"no-alert": "error",
		"no-catch-shadow": "error",
		"no-control-regex": "off",
		"no-console": "error",
		"no-duplicate-imports": "error",
		"no-else-return": "error",
		"no-implicit-globals": "error",
		"no-restricted-globals": ["error", "event", "fdescribe"],
		"no-template-curly-in-string": "error",
		"no-unsafe-negation": "error",
		"no-useless-computed-key": "error",
		"no-useless-constructor": "error",
		"no-useless-return": "error",
		"no-use-before-define": [
			"error",
			{
				functions: false,
			},
		],
		"no-var": "error",
		"object-shorthand": [
			"error",
			"methods",
			{
				avoidExplicitReturnArrows: true,
			},
		],
		"padding-line-between-statements": [
			"error",
			{
				blankLine: "always",
				prev: ["block", "block-like"],
				next: "*",
			},
			{
				blankLine: "always",
				prev: "*",
				next: ["block", "block-like"],
			},
		],
		"prefer-const": "error",
		"prefer-rest-params": "error",
		"prefer-spread": "error",
		"spaced-comment": ["error", "always"],
		strict: "off",
		yoda: "error",
		"vue/component-tags-order": [
			"error",
			{
				order: ["template", "style", "script"],
			},
		],
		"vue/no-mutating-props": "off",
		"vue/no-v-html": "off",
		"vue/require-default-prop": "off",
		"vue/v-slot-style": ["error", "longform"],
		"vue/multi-word-component-names": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-this-alias": "off",
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": "error",
	},

	// TODO: verify
	overrides: [
		{
			files: ["*.vue"],
			rules: {
				"import/no-default-export": 0,
			},
		},
		{
			files: ["*.vue"],
			rules: {
				"@typescript-eslint/prefer-readonly": 0, // can be used in template
				"import/unambiguous": 0, // vue SFC can miss script tags
			},
		},
	],
};
