"use strict";

const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

// ********************
// Common configuration
// ********************

const config = {
	entry: {
		"js/bundle.js": path.resolve(__dirname, "client/js/lounge.js"),
	},
	devtool: "source-map",
	output: {
		path: path.resolve(__dirname, "public"),
		filename: "[name]",
		publicPath: "/",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, "client"),
				],
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							["env", {
								targets: {
									browsers: "last 2 versions",
								},
							}],
						],
					},
				},
			},
			{
				test: /\.tpl$/,
				include: [
					path.resolve(__dirname, "client/views"),
				],
				use: {
					loader: "handlebars-loader",
					options: {
						helperDirs: [
							path.resolve(__dirname, "client/js/libs/handlebars"),
						],
						extensions: [
							".tpl",
						],
					},
				},
			},
		],
	},
	externals: {
		json3: "JSON", // socket.io uses json3.js, but we do not target any browsers that need it
	},
	plugins: [
		new CopyPlugin([
			{
				from: "./node_modules/font-awesome/fonts/fontawesome-webfont.woff*",
				to: "fonts/[name].[ext]",
			},
			{
				from: "./client/js/loading-error-handlers.js",
				to: "js/[name].[ext]",
			},
			{ // TODO: Build index.html with handlebars
				from: "./client/*",
				to: "[name].[ext]",
			},
			{
				from: "./client/audio/*",
				to: "audio/[name].[ext]",
			},
			{
				from: "./client/img/*",
				to: "img/[name].[ext]",
			},
			{
				from: "./client/themes/*",
				to: "themes/[name].[ext]",
			},
			{ // TODO: Build css with postcss
				from: "./client/css/*",
				to: "css/[name].[ext]",
			},
			{
				from: "./node_modules/primer-tooltips/build/build.css",
				to: "css/primer-tooltips.[ext]",
			},
		]),
		// socket.io uses debug, we don't need it
		new webpack.NormalModuleReplacementPlugin(/debug/, path.resolve(__dirname, "scripts/noop.js")),
		// automatically split all vendor dependencies into a separate bundle
		new webpack.optimize.CommonsChunkPlugin({
			name: "js/bundle.vendor.js",
			minChunks: (module) => module.context && module.context.indexOf("node_modules") !== -1,
		}),
	],
	stats: "minimal",
};

// *********************************
// Production-specific configuration
// *********************************

if (process.env.NODE_ENV === "production") {
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
		comments: false,
	}));
}

if (process.env.NODE_ENV === "dev") {
	config.plugins.push(new DashboardPlugin());
}

module.exports = config;
