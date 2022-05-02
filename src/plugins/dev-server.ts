"use strict";
import log from "../log";
import webpack from "webpack";

export default (app) => {
	log.debug("Starting server in development mode");
	const webpackConfig = require("../../webpack.config.js");

	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
	webpackConfig.entry["js/bundle.js"].push(
		"webpack-hot-middleware/client?path=storage/__webpack_hmr"
	);

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
