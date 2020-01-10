"use strict";

module.exports = (app) => {
	const log = require("../log");

	log.debug("Starting server in development mode");

	const webpack = require("webpack");
	const webpackConfig = require("../../webpack.config.js");

	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
	webpackConfig.entry["js/bundle.js"].push(
		"webpack-hot-middleware/client?path=storage/__webpack_hmr"
	);

	// Enable hot module reload support in mini-css-extract-plugin
	for (const rule of webpackConfig.module.rules) {
		if (!Array.isArray(rule.use)) {
			continue;
		}

		for (const use of rule.use) {
			if (use.options && typeof use.options.hmr !== "undefined") {
				use.options.hmr = true;
			}
		}
	}

	const compiler = webpack(webpackConfig);

	app.use(
		require("webpack-dev-middleware")(compiler, {
			index: "/",
			publicPath: webpackConfig.output.publicPath,
		})
	).use(
		require("webpack-hot-middleware")(compiler, {
			path: "/storage/__webpack_hmr",
		})
	);
};
