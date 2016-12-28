"use strict";

const webpack = require("webpack");
const path = require("path");
const basePath = path.resolve(__dirname, "..");

module.exports = {
	entry: {
		app: path.resolve(basePath, "client/js/lounge.js"),
		vendor: [
			"handlebars/runtime",
			"jquery",
			"jquery-ui/ui/widgets/sortable",
			"mousetrap",
			"socket.io-client",
			"urijs",
		],
	},
	devtool: "source-map",
	output: {
		path: path.resolve(basePath, "client/js"),
		filename: "bundle.js",
		publicPath: "/"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: [
					path.resolve(basePath, "client/js"),
				],
				loader: "babel",
				query: {
					presets: [
						"es2015"
					]
				}
			},
			{
				test: /\.tpl$/,
				include: [
					path.resolve(basePath, "client/views"),
				],
				loader: "handlebars-loader",
				query: {
					helperDirs: [
						path.resolve(basePath, "client/js/libs/handlebars")
					],
					extensions: [
						".tpl"
					],
				}
			},
		]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin(
			"vendor", // chunkName
			"bundle.vendor.js" // filename
		),
		new webpack.optimize.UglifyJsPlugin({
			comments: false,
			compress: {
				warnings: false
			}
		}),
	]
};
