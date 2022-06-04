import * as webpack from "webpack";
import * as path from "path";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {VueLoaderPlugin} from "vue-loader";
import babelConfig from "./babel.config.cjs";
import Helper from "./src/helper";

const isProduction = process.env.NODE_ENV === "production";
const config: webpack.Configuration = {
	mode: isProduction ? "production" : "development",
	entry: {
		"js/bundle.js": [path.resolve(__dirname, "client/js/vue.ts")],
	},
	devtool: "source-map",
	output: {
		clean: true, // Clean the output directory before emit.
		path: path.resolve(__dirname, "public"),
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
				test: /\.(ts|js)x?$/i,
				include: [path.resolve(__dirname, "client")],
				exclude: path.resolve(__dirname, "node_modules"),
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
		json3: "JSON", // socket.io uses json3.js, but we do not target any browsers that need it
	},
	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			__VUE_PROD_DEVTOOLS__: false,
			// TODO; we should be able to eventually set this to false once vue-draggable-next updates
			__VUE_OPTIONS_API__: true,
		}),
		new MiniCssExtractPlugin({
			filename: "css/style.css",
		}),
		new webpack.IgnorePlugin({resourceRegExp: /canvas/}),
		new CopyPlugin({
			patterns: [
				{
					from: path
						.resolve(
							__dirname,
							"node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff*"
						)
						.replace(/\\/g, "/"),
					to: "fonts/[name][ext]",
				},
				{
					from: path.resolve(__dirname, "./client/js/loading-error-handlers.js"),
					to: "js/[name][ext]",
				},
				{
					from: path.resolve(__dirname, "./client/*").replace(/\\/g, "/"),
					to: "[name][ext]",
					globOptions: {
						ignore: ["**/index.html.tpl", "**/service-worker.js"],
					},
				},
				{
					from: path.resolve(__dirname, "./client/service-worker.js"),
					to: "[name][ext]",
					transform(content) {
						return content
							.toString()
							.replace(
								"__HASH__",
								isProduction ? Helper.getVersionCacheBust() : "dev"
							);
					},
				},
				{
					from: path.resolve(__dirname, "./client/audio/*").replace(/\\/g, "/"),
					to: "audio/[name][ext]",
				},
				{
					from: path.resolve(__dirname, "./client/img/*").replace(/\\/g, "/"),
					to: "img/[name][ext]",
				},
				{
					from: path.resolve(__dirname, "./client/themes/*").replace(/\\/g, "/"),
					to: "themes/[name][ext]",
				},
			],
		}),
		// socket.io uses debug, we don't need it
		new webpack.NormalModuleReplacementPlugin(
			/debug/,
			path.resolve(__dirname, "scripts/noop.js")
		),
	],
};

export default (env: any, argv: any) => {
	if (argv.mode === "development") {
		config.target = "node";
		config.devtool = "eval";
		config.stats = "errors-only";
		config.output!.path = path.resolve(__dirname, "test/public");
		config.entry!["testclient.js"] = [path.resolve(__dirname, "test/client/index.ts")];

		// Add the istanbul plugin to babel-loader options
		for (const rule of config.module!.rules!) {
			// @ts-ignore
			if (rule.use.loader === "babel-loader") {
				// @ts-ignore
				rule.use.options.plugins = ["istanbul"];
			}
		}

		// `optimization.splitChunks` is incompatible with a `target` of `node`. See:
		// - https://github.com/zinserjan/mocha-webpack/issues/84
		// - https://github.com/webpack/webpack/issues/6727#issuecomment-372589122
		config.optimization!.splitChunks = false;

		// Disable plugins like copy files, it is not required
		config.plugins = [
			new VueLoaderPlugin(),
			new MiniCssExtractPlugin({
				filename: "css/style.css",
			}),

			new MiniCssExtractPlugin({
				filename: "css/style.css",
			}),

			// Client tests that require Vue may end up requireing socket.io
			new webpack.NormalModuleReplacementPlugin(
				/js(\/|\\)socket\.js/,
				path.resolve(__dirname, "scripts/noop.js")
			),
		];
	}

	if (argv?.mode === "production") {
		// ...
	}

	return config;
};
