"use strict";

const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const config = require("./webpack.config.js");

const testFile = path.resolve(__dirname, "test/public/testclient.js");

if (fs.existsSync(testFile)) {
	fs.unlinkSync(testFile);
}

config.target = "node";
config.devtool = "eval";
config.stats = "errors-only";
config.output.path = path.resolve(__dirname, "test/public");
config.entry = {
	"testclient.js": [path.resolve(__dirname, "test/client/index.js")],
};

// Add the istanbul plugin to babel-loader options
for (const rule of config.module.rules) {
	if (rule.use.loader === "babel-loader") {
		rule.use.options.plugins = ["istanbul"];
	}
}

// `optimization.splitChunks` is incompatible with a `target` of `node`. See:
// - https://github.com/zinserjan/mocha-webpack/issues/84
// - https://github.com/webpack/webpack/issues/6727#issuecomment-372589122
config.optimization.splitChunks = false;

// Disable plugins like copy files, it is not required
config.plugins = [
	new VueLoaderPlugin(),

	// Client tests that require Vue may end up requireing socket.io
	new webpack.NormalModuleReplacementPlugin(
		/js(\/|\\)socket\.js/,
		path.resolve(__dirname, "scripts/noop.js")
	),

	// "Fixes" Critical dependency: the request of a dependency is an expression
	new webpack.ContextReplacementPlugin(/vue-server-renderer$/),
];

module.exports = config;
