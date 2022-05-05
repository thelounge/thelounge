module.exports = {
	root: true,
	overrides: [
		{
			files: [
				"**/*.ts",
				// "**/*.vue"
			],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ["./tsconfig.json", "./client/tsconfig.json", "./src/tsconfig.json"],
				// extraFileExtensions: [".vue"],
			},
			plugins: ["@typescript-eslint"],
			extends: [
				"eslint:recommended",
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"prettier",
			],
			rules: {
				// note you must disable the base rule as it can report incorrect errors
				"no-shadow": "off",
				"@typescript-eslint/no-shadow": ["error"],
				// TODO: eventually remove these
				"@typescript-eslint/ban-ts-comment": "off",
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-this-alias": "off",
				"@typescript-eslint/no-unnecessary-type-assertion": "off",
				"@typescript-eslint/no-unsafe-argument": "off",
				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-call": "off",
				"@typescript-eslint/no-unsafe-member-access": "off",
				"@typescript-eslint/no-unused-vars": "off",
			},
		},
		// TODO: verify
		{
			files: ["**/*.vue"],
			parser: "vue-eslint-parser",
			parserOptions: {
				ecmaVersion: 2022,
				ecmaFeatures: {
					jsx: true,
				},
				parser: {
					// Script parser for `<script>`
					js: "espree",

					// Script parser for `<script lang="ts">`
					ts: "@typescript-eslint/parser",

					// Script parser for vue directives (e.g. `v-if=` or `:attribute=`)
					// and vue interpolations (e.g. `{{variable}}`).
					// If not specified, the parser determined by `<script lang ="...">` is used.
					"<template>": "espree",
				},
				tsconfigRootDir: __dirname,
				project: ["./tsconfig.json", "./client/tsconfig.json", "./src/tsconfig.json"],
			},
			plugins: ["vue"],
			extends: [
				"plugin:vue/recommended",
				"eslint:recommended",
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"prettier",
			],
			rules: {
				"import/no-default-export": 0,
				"import/unambiguous": 0, // vue SFC can miss script tags
				"@typescript-eslint/prefer-readonly": 0, // can be used in template
				"vue/component-tags-order": [
					"error",
					{
						order: ["template", "style", "script"],
					},
				],
				"vue/multi-word-component-names": "off",
				"vue/no-mutating-props": "off",
				"vue/no-v-html": "off",
				"vue/require-default-prop": "off",
				"vue/v-slot-style": ["error", "longform"],
			},
		},
	],
	env: {
		es6: true,
		browser: true,
		mocha: true,
		node: true,
	},
	extends: ["eslint:recommended", "prettier"],
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
	},
};
