import {defineConfig, type Plugin} from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import * as fs from "fs";
import * as crypto from "crypto";
import {execSync} from "child_process";

const rootDir = import.meta.dirname;

// Mirrors getVersionCacheBust() in server/version.ts
// TODO: fix esm vs cjs
function getVersionCacheBust(): string {
	const pkg = JSON.parse(fs.readFileSync(path.resolve(rootDir, "package.json"), "utf-8")) as {
		version: string;
	};
	const version = `v${pkg.version}`;
	let versionString = version;

	try {
		const gitCommit = execSync("git rev-parse --short HEAD", {
			encoding: "utf-8",
			timeout: 2000,
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
		versionString = `source (${gitCommit} / ${version})`;
	} catch {
		// not a git checkout
	}

	return crypto.createHash("sha256").update(versionString).digest("hex").substring(0, 10);
}

// This file can't be a module (it must run synchronously before the bundle loads),
// so Vite won't process it.
function hashLoadingHandlersPlugin(): Plugin {
	return {
		name: "hash-loading-handlers",
		writeBundle() {
			const srcPath = path.resolve(rootDir, "public/js/loading-error-handlers.js");

			if (!fs.existsSync(srcPath)) {
				return;
			}

			const content = fs.readFileSync(srcPath, "utf-8");
			const hash = crypto.createHash("sha256").update(content).digest("hex").substring(0, 8);
			const hashedName = `loading-error-handlers-${hash}.js`;

			// Copy to assets/
			fs.writeFileSync(path.resolve(rootDir, "public/js", hashedName), content);
			fs.unlinkSync(srcPath);

			// Update HTML
			const htmlPath = path.resolve(rootDir, "public/index.html");
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
			const sw = fs.readFileSync(path.resolve(rootDir, "client/service-worker.js"), "utf-8");
			const hash = mode === "production" ? getVersionCacheBust() : "dev";
			fs.writeFileSync(
				path.resolve(rootDir, "public/service-worker.js"),
				sw.replace("__HASH__", hash)
			);
		},
	};
}

export default defineConfig(({mode}) => ({
	root: path.resolve(rootDir, "client"),
	publicDir: path.resolve(rootDir, "client/public"),
	// Ensures the app works when mounted at a subpath by a reverse proxy
	base: "./",

	build: {
		outDir: path.resolve(rootDir, "public"),
		emptyOutDir: true,
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						return "vendor";
					}

					// Split emojis (~100kb)  into their own chunk for separate caching
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
			debug: path.resolve(rootDir, "scripts/noop.js"),
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
