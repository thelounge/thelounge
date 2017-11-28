"use strict";

const path = require("path");
const config = require("./webpack.config.js");

config.entry = {
	"js/bundle.test.js": `mocha-loader!${path.join(__dirname, "test/client/index.js")}`,
};

// Instrumentation for testing with mocha
config.module.rules.push({
	test: /\.js$/,
	include: path.join(__dirname, "test/client"),
	use: "mocha-loader",
});

// Tell the webserver where to load the HTML reporter file from
config.devServer = {
	contentBase: path.join(__dirname, "test/client"),
};

module.exports = config;
