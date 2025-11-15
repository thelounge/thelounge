import path from "node:path";
import {fileURLToPath} from "node:url";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {VueLoaderPlugin} from "vue-loader";
import babelConfig from "./babel.config.cjs";
import Helper from "./server/helper.js";

const {DefinePlugin, NormalModuleReplacementPlugin} = webpack;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveFromRoot = (...segments) => path.resolve(__dirname, ...segments);

const createForkTsCheckerPlugin = (withBuild) =>
	new ForkTsCheckerWebpackPlugin({
		typescript: {
			diagnosticOptions: {
				semantic: true,
				syntactic: true,
			},
			...(withBuild ? {build: true} : {}),
		},
	});

const createMiniCssExtractPlugin = () =>
	new MiniCssExtractPlugin({
		filename: "css/style.css",
	});

const copyPatterns = (isProduction) => [
	{
		from: resolveFromRoot(
			"node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff*"
		).replace(/\\/g, "/"),
		to: "fonts/[name][ext]",
	},
	{
		from: resolveFromRoot("client/js/loading-error-handlers.js"),
		to: "js/[name][ext]",
	},
	{
		from: resolveFromRoot("client/*").replace(/\\/g, "/"),
		to: "[name][ext]",
		globOptions: {
			ignore: [
				"**/index.html.tpl",
				"**/service-worker.js",
				"**/*.d.ts",
				"**/tsconfig.json",
			],
		},
	},
	{
		from: resolveFromRoot("client/service-worker.js"),
		to: "[name][ext]",
		transform(content) {
			const hash = isProduction ? Helper.getVersionCacheBust() : "dev";
			return content.toString().replace("__HASH__", hash);
		},
	},
	{
		from: resolveFromRoot("client/audio/*").replace(/\\/g, "/"),
		to: "audio/[name][ext]",
	},
	{
		from: resolveFromRoot("client/img/*").replace(/\\/g, "/"),
		to: "img/[name][ext]",
	},
	{
		from: resolveFromRoot("client/themes/*").replace(/\\/g, "/"),
		to: "themes/[name][ext]",
	},
];

function createBaseConfig(mode, isProduction) {
	return {
		mode,
		entry: {
			"js/bundle.js": [resolveFromRoot("client/js/vue.ts")],
		},
		devtool: "source-map",
		output: {
			clean: true,
			path: resolveFromRoot("public"),
			filename: "[name]",
			publicPath: "/",
		},
		performance: {
			hints: false,
		},
		resolve: {
			extensions: [".ts", ".js", ".vue"],
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					use: {
						loader: "vue-loader",
						options: {
							compilerOptions: {
								preserveWhitespace: false,
							},
							appendTsSuffixTo: [/\.vue$/],
						},
					},
				},
				{
					test: /\.ts$/i,
					include: [
						resolveFromRoot("client"),
						resolveFromRoot("shared"),
						resolveFromRoot("test"),
					],
					exclude: resolveFromRoot("node_modules"),
					use: {
						loader: "babel-loader",
						options: babelConfig,
					},
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								esModule: false,
							},
						},
						{
							loader: "css-loader",
							options: {
								url: false,
								importLoaders: 1,
								sourceMap: true,
							},
						},
						{
							loader: "postcss-loader",
							options: {
								sourceMap: true,
							},
						},
					],
				},
			],
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: "js/bundle.vendor.js",
						chunks: "all",
					},
				},
			},
		},
		externals: {
			json3: "JSON",
		},
		plugins: [
			createForkTsCheckerPlugin(true),
			new VueLoaderPlugin(),
			new DefinePlugin({
				__VUE_PROD_DEVTOOLS__: false,
				__VUE_OPTIONS_API__: false,
			}),
			createMiniCssExtractPlugin(),
			new CopyPlugin({patterns: copyPatterns(isProduction)}),
			new NormalModuleReplacementPlugin(
				/debug/,
				resolveFromRoot("scripts/noop.js")
			),
		],
	};
}

function addIstanbulPlugin(rule) {
	if (!rule || typeof rule !== "object") {
		return rule;
	}

	const {use} = rule;

	if (
		use &&
		typeof use === "object" &&
		!Array.isArray(use) &&
		use.loader === "babel-loader"
	) {
		const options = {...(use.options ?? {})};
		const plugins = Array.isArray(options.plugins) ? [...options.plugins] : [];

		if (!plugins.includes("istanbul")) {
			plugins.push("istanbul");
		}

		return {
			...rule,
			use: {
				...use,
				options: {
					...options,
					plugins,
				},
			},
		};
	}

	return rule;
}

function applyDevelopmentOverrides(config) {
	const devConfig = {...config};

	devConfig.target = "node";
	devConfig.devtool = "eval";
	devConfig.stats = "errors-only";
	devConfig.output = {
		...(devConfig.output ?? {}),
		path: resolveFromRoot("test/public"),
	};
	devConfig.entry = {
		...(devConfig.entry ?? {}),
		"testclient.js": [resolveFromRoot("test/client/index.ts")],
	};
	devConfig.optimization = {
		...(devConfig.optimization ?? {}),
		splitChunks: false,
	};
	devConfig.plugins = [
		createForkTsCheckerPlugin(false),
		new VueLoaderPlugin(),
		createMiniCssExtractPlugin(),
		new NormalModuleReplacementPlugin(
			/js(\/|\\)socket\.js/,
			resolveFromRoot("scripts/noop.js")
		),
	];

	if (devConfig.module && Array.isArray(devConfig.module.rules)) {
		devConfig.module = {
			...devConfig.module,
			rules: devConfig.module.rules.map((rule) => addIstanbulPlugin(rule)),
		};
	}

	return devConfig;
}

export default (env = {}, argv = {}) => {
	const modeFromArgs = argv.mode ?? process.env.NODE_ENV ?? "development";
	const mode = typeof modeFromArgs === "string" ? modeFromArgs : "development";
	const isProduction = mode === "production";

	const baseConfig = createBaseConfig(mode, isProduction);

	if (mode === "development") {
		return applyDevelopmentOverrides(baseConfig);
	}

	return baseConfig;
};
