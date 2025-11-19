// @ts-check
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

const baseRules = {
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
};

const vueRules = {
	"import/no-default-export": 0,
	"import/unambiguous": 0, // vue SFC can miss script tags
	"@typescript-eslint/prefer-readonly": 0, // can be used in template
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
};

const tsRules = {
	// note you must disable the base rule as it can report incorrect errors
	"no-shadow": "off",
	"@typescript-eslint/no-shadow": ["error"],
	"@typescript-eslint/no-redundant-type-constituents": "off",
};

// Type Safety - deferred to FAZA 10: TypeScript Strict Mode
// These rules require extensive manual refactoring of type definitions
// across the codebase (~2000+ errors). Deferring to dedicated phase after
// core migrations (Express 5, ESM) are complete.
// FAZA 6 completed: All quick-fix rules resolved (ban-types, empty-object,
// throw-error, promise-reject, unused-expressions, this-alias, etc.)
const tsRulesTypeStrictness = {
	"@typescript-eslint/no-unsafe-assignment": "off", // 349 errors - defer to FAZA 10
	"@typescript-eslint/no-unsafe-call": "off", // 315 errors - defer to FAZA 10
	"@typescript-eslint/no-unsafe-member-access": "off", // 800 errors - defer to FAZA 10
	"@typescript-eslint/no-unsafe-argument": "off", // 397 errors - defer to FAZA 10
	"@typescript-eslint/no-explicit-any": "warn", // 287 errors - keep as WARNING for visibility
};

export default [
	// Global ignores (replaces .eslintignore)
	{
		ignores: [
			"node_modules/**",
			"dist/**",
			"public/**",
			"coverage/**",
			"webpack.config.mjs",
			"*.min.js",
		],
	},

	// Base JavaScript config for all files
	{
		files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.es2021,
				...globals.browser,
				...globals.node,
				...globals.mocha,
			},
		},
		...js.configs.recommended,
		rules: {
			...baseRules,
		},
	},

	// TypeScript files - use flat config from typescript-eslint
	...tseslint.configs["flat/recommended-type-checked"].map((config) => ({
		...config,
		files: ["**/*.ts"],
	})),
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				projectService: {
					allowDefaultProject: ["*.ts", "*.mjs"],
					defaultProject: "./tsconfig.json",
				},
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.es2021,
				...globals.browser,
				...globals.node,
				...globals.mocha,
			},
		},
		rules: {
			...baseRules,
			...tsRules,
			...tsRulesTypeStrictness,
		},
	},

	// Vue files - use flat config
	...vuePlugin.configs["flat/recommended"],
	...tseslint.configs["flat/recommended-type-checked"].map((config) => ({
		...config,
		files: ["**/*.vue"],
	})),
	{
		files: ["**/*.vue"],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsparser,
				projectService: {
					allowDefaultProject: ["*.vue"],
					defaultProject: "./tsconfig.json",
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: [".vue"],
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.es2021,
				...globals.browser,
				...globals.node,
				...globals.mocha,
			},
		},
		rules: {
			...baseRules,
			...tsRules,
			...tsRulesTypeStrictness,
			...vueRules,
		},
	},

	// Test files - no special rules needed
	{
		files: ["test/**/*.ts"],
		rules: {},
	},

	// Prettier must be last to override any conflicting rules
	prettierConfig,
];
