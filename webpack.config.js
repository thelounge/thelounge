"use strict";

const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const Helper = require("./src/helper.js");

const config = {
	mode: process.env.NODE_ENV === "production" ? "production" : "development",
	entry: {
		"js/bundle.js": [path.resolve(__dirname, "client/js/lounge.js")],
		"css/style": path.resolve(__dirname, "client/css/style.css"),
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
				test: /\.vue$/,
				use: {
					loader: "vue-loader",
					options: {
						compilerOptions: {
							preserveWhitespace: false,
						},
					},
				},
			},
			{
				test: /\.css$/,
				include: [path.resolve(__dirname, "client")],
				use: [
					MiniCssExtractPlugin.loader,
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
			{
				test: /\.js$/,
				include: [path.resolve(__dirname, "client")],
				use: {
					loader: "babel-loader",
					options: {
						presets: [["@babel/env"]],
					},
				},
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
		new MiniCssExtractPlugin(),
		new VueLoaderPlugin(),
		new CopyPlugin([
			{
				from: "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff*",
				to: "fonts/[name].[ext]",
			},
			{
				from: "./client/js/loading-error-handlers.js",
				to: "js/[name].[ext]",
			},
			{
				from: "./client/*",
				to: "[name].[ext]",
				ignore: ["index.html.tpl", "service-worker.js"],
			},
			{
				from: "./client/service-worker.js",
				to: "[name].[ext]",
				transform(content) {
					return content.toString().replace("__HASH__", Helper.getVersionCacheBust());
				},
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
		]),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		// socket.io uses debug, we don't need it
		new webpack.NormalModuleReplacementPlugin(
			/debug/,
			path.resolve(__dirname, "scripts/noop.js")
		),
	],
};

module.exports = config;
