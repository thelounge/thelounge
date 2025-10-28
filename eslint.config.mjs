import eslint from "@eslint/js";
import {defineConfig, globalIgnores} from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
	eslint.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
		},
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
	},
	{
		ignores: ["client/"],
		languageOptions: {
			sourceType: "commonjs",
			globals: globals.node,
		},
	},
	{
		basePath: "client/",
		languageOptions: {
			sourceType: "module",
			globals: globals.browser,
		},
	},
	{
		files: ["**/*.ts", "**/*.vue"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: [".vue"],
			},
		},
		extends: [...tseslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
		rules: {
			// note you must disable the base rule as it can report incorrect errors
			"no-shadow": "off",
			"@typescript-eslint/no-shadow": ["error"],
			"@typescript-eslint/no-redundant-type-constituents": "off",
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
	...pluginVue.configs["flat/recommended"],
	{
		files: ["**/*.vue"],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
		rules: {
			"import/no-default-export": "off",
			"import/unambiguous": "off", // vue SFC can miss script tags
			"@typescript-eslint/prefer-readonly": "off", // can be used in template
			"vue/block-order": [
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
	{
		basePath: "test/",
		languageOptions: {
			globals: globals.mocha,
		},
		rules: {
			// TODO: remove these
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/restrict-plus-operands": "off",
		},
	},
	prettierConfig,
	globalIgnores(["**/public/", "**/coverage/", "**/dist/"])
);
