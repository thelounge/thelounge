import {defineConfig, type Plugin} from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import * as fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {getVersionCacheBust} = require("./scripts/version");

function serviceWorkerPlugin(mode: string): Plugin {
	return {
		name: "service-worker-hash",
		writeBundle() {
			const sw = fs.readFileSync(
				path.resolve(__dirname, "client/service-worker.js"),
				"utf-8"
			);
			const hash = mode === "production" ? getVersionCacheBust() : "dev";
			fs.writeFileSync(
				path.resolve(__dirname, "public/service-worker.js"),
				sw.replace("__HASH__", hash)
			);
		},
	};
}

export default defineConfig(({mode}) => ({
	root: path.resolve(__dirname, "client"),
	publicDir: path.resolve(__dirname, "client/public"),

	build: {
		outDir: path.resolve(__dirname, "public"),
		emptyOutDir: true,
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
			},
		},
	},

	resolve: {
		extensions: [".ts", ".js", ".vue"],
		alias: {
			debug: path.resolve(__dirname, "scripts/noop.js"),
		},
	},

	css: {
		lightningcss: {
			// primer-tooltips uses @media hacks for old IE — strip them instead of failing
			errorRecovery: true,
		},
	},

	define: {
		__VUE_PROD_DEVTOOLS__: false,
		__VUE_OPTIONS_API__: false,
	},

	plugins: [
		vue({
			template: {
				compilerOptions: {
					preserveWhitespace: false,
				},
				transformAssetUrls: false,
			},
		}),
		serviceWorkerPlugin(mode),
	],
}));
