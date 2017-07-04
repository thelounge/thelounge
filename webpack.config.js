"use strict";

const webpack = require("webpack");
const path = require("path");

// ********************
// Common configuration
// ********************

const config = {
	entry: {
		"js/bundle.js": path.resolve(__dirname, "client/js/lounge.js"),
	},
	devtool: "source-map",
	output: {
		path: path.resolve(__dirname, "client"),
		filename: "[name]",
		publicPath: "/"
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
									browsers: "last 2 versions"
								}
							}]
						]
					}
				}
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
							path.resolve(__dirname, "client/js/libs/handlebars")
						],
						extensions: [
							".tpl"
						],
					}
				}
			},
		]
	},
	externals: {
		json3: "JSON", // socket.io uses json3.js, but we do not target any browsers that need it
	},
	plugins: [
		// socket.io uses debug, we don't need it
		new webpack.NormalModuleReplacementPlugin(/debug/, path.resolve(__dirname, "scripts/noop.js")),
		// automatically split all vendor dependancies into a separate bundle
		new webpack.optimize.CommonsChunkPlugin({
			name: "js/bundle.vendor.js",
			minChunks: (module) => module.context && module.context.indexOf("node_modules") !== -1
		})
	]
};

// *********************************
// Production-specific configuration
// *********************************

if (process.env.NODE_ENV === "production") {
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
		comments: false
	}));
} else {
	console.log("Building in development mode, bundles will not be minified.");
}

module.exports = config;
