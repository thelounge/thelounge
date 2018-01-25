"use strict";

const path = require("path");
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

// `optimization.splitChunks` is incompatible with a `target` of `node`. See:
// - https://github.com/zinserjan/mocha-webpack/issues/84
// - https://github.com/webpack/webpack/issues/6727#issuecomment-372589122
config.optimization.splitChunks = false;

module.exports = config;
