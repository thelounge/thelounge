"use strict";

const path = require("path");
const webpack = require("webpack");
const config = require("./webpack.config.js");

config.target = "node";

// Instrumentation for coverage with Istanbul
config.module.rules.push({
	test: /\.js$/,
	include: path.resolve(__dirname, "client"),
	use: {
		loader: "istanbul-instrumenter-loader",
		options: {esModules: true},
	},
	enforce: "post",
});

// `CommonsChunkPlugin` is incompatible with a `target` of `node`.
// See https://github.com/zinserjan/mocha-webpack/issues/84
config.plugins = config.plugins.filter((a) =>
	!(a instanceof webpack.optimize.CommonsChunkPlugin)
);

module.exports = config;
