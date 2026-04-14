import {defineConfig, type Plugin} from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import * as fs from "fs";
import * as crypto from "crypto";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {getVersionCacheBust} = require("./scripts/version");

// This file can't be a module (it must run synchronously before the bundle loads),
// so Vite won't process it.
function hashLoadingHandlersPlugin(): Plugin {
	return {
		name: "hash-loading-handlers",
		writeBundle() {
			const srcPath = path.resolve(__dirname, "public/js/loading-error-handlers.js");

			if (!fs.existsSync(srcPath)) {
				return;
			}

			const content = fs.readFileSync(srcPath, "utf-8");
			const hash = crypto.createHash("sha256").update(content).digest("hex").substring(0, 8);
			const hashedName = `loading-error-handlers-${hash}.js`;

			// Copy to assets/
			fs.writeFileSync(path.resolve(__dirname, "public/js", hashedName), content);
			fs.unlinkSync(srcPath);

			// Update HTML
			const htmlPath = path.resolve(__dirname, "public/index.html");
			const html = fs.readFileSync(htmlPath, "utf-8");
			fs.writeFileSync(
				htmlPath,
				html.replace(/js\/loading-error-handlers\.js/g, `js/${hashedName}`)
			);
		},
	};
}

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

					// Emoji data is ~100KB — split it into its own chunk so the
					// main bundle stays small and emoji data can be cached separately
					if (id.includes("fullnamemap.json") || id.includes("simplemap.json")) {
						return "emoji";
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
		hashLoadingHandlersPlugin(),
	],
}));
