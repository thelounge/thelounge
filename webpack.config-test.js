"use strict";

const config = require("./webpack.config.js");

config.target = "node";
config.devtool = "eval";

// Add the istanbul plugin to babel-loader options
for (const rule of config.module.rules) {
	if (rule.use.loader === "babel-loader") {
		rule.use.options.plugins = [
			"istanbul",
		];
	}
}

// `optimization.splitChunks` is incompatible with a `target` of `node`. See:
// - https://github.com/zinserjan/mocha-webpack/issues/84
// - https://github.com/webpack/webpack/issues/6727#issuecomment-372589122
config.optimization.splitChunks = false;

module.exports = config;
