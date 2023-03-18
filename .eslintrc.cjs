// @ts-check
const {defineConfig} = require("eslint-define-config");

const projects = defineConfig({
	parserOptions: {
		project: [
			"./tsconfig.json",
			"./client/tsconfig.json",
			"./server/tsconfig.json",
			"./shared/tsconfig.json",
			"./test/tsconfig.json",
		],
	},
}).parserOptions.project;

const baseRules = defineConfig({
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
}).rules;

const vueRules = defineConfig({
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
}).rules;

const tsRules = defineConfig({
	rules: {
		// note you must disable the base rule as it can report incorrect errors
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": ["error"],
	},
}).rules;

const tsRulesTemp = defineConfig({
	rules: {
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
}).rules;

const tsTestRulesTemp = defineConfig({
	rules: {
		// TODO: remove these
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/restrict-plus-operands": "off",
	},
}).rules;

module.exports = defineConfig({
	root: true,
	parserOptions: {
		ecmaVersion: 2022,
	},
	overrides: [
		{
			files: ["**/*.ts", "**/*.vue"],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: projects,
				extraFileExtensions: [".vue"],
			},
			plugins: ["@typescript-eslint"],
			extends: [
				"eslint:recommended",
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"prettier",
			],
			rules: {
				...baseRules,
				...tsRules,
				...tsRulesTemp,
			},
		},
		{
			files: ["**/*.vue"],
			parser: "vue-eslint-parser",
			parserOptions: {
				ecmaVersion: 2022,
				ecmaFeatures: {
					jsx: true,
				},
				parser: "@typescript-eslint/parser",
				tsconfigRootDir: __dirname,
				project: projects,
			},
			plugins: ["vue"],
			extends: [
				"eslint:recommended",
				"plugin:vue/vue3-recommended",
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"prettier",
			],
			rules: {...baseRules, ...tsRules, ...tsRulesTemp, ...vueRules},
		},
		{
			files: ["./tests/**/*.ts"],
			parser: "@typescript-eslint/parser",
			rules: {
				...baseRules,
				...tsRules,
				...tsRulesTemp,
				...tsTestRulesTemp,
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
	rules: baseRules,
});
