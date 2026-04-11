import {defineConfig} from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
	plugins: [vue()],
	resolve: {
		extensions: [".ts", ".js", ".vue"],
		alias: {
			debug: path.resolve(__dirname, "scripts/noop.js"),
		},
	},
	define: {
		__VUE_PROD_DEVTOOLS__: false,
		__VUE_OPTIONS_API__: false,
	},
	test: {
		include: [
			"test/**/*Test.ts",
			"test/**/*test.ts",
			"test/tests/**/*.ts",
			"test/server.ts",
			"test/client.ts",
			"test/commands/**/*.ts",
			"test/models/**/*.ts",
			"test/plugins/**/*.ts",
			"test/shared/**/*.ts",
		],
		exclude: ["test/fixtures/**", "test/public/**"],
		environment: "node",
		setupFiles: ["test/fixtures/env.ts"],
		globals: true,
		testTimeout: 25000,
	},
});
