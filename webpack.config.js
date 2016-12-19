"use strict";

const webpack = require("webpack");
const path = require("path");

module.exports = {
	entry: {
		app: path.resolve(__dirname, "client/js/lounge.js"),
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
		path: path.resolve(__dirname, "client/js"),
		filename: "bundle.js",
		publicPath: "/"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, "client"),
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
					path.resolve(__dirname, "client/views"),
				],
				loader: "handlebars-loader",
				query: {
					helperDirs: [
						path.resolve(__dirname, "client/js/libs/handlebars")
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
			compress: {
				warnings: false
			}
		}),
	]
};
