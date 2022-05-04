"use strict";
import log from "../log";
import webpack from "webpack";
import webpackConfig from "../../webpack.config";
import webpackDevMiddleware from "webpack-dev-middleware";

export default (app) => {
	log.debug("Starting server in development mode");
	const config = webpackConfig("development");

	if (!config.plugins) {
		config.plugins = [];
	}

	config.plugins.push(new webpack.HotModuleReplacementPlugin());

	if (!config.entry && !config.entry!["js/bundle.js"]) {
		throw new Error("No js/bundle.js entrypoint found in webpack config");
	} else {
		config.entry!["js/bundle.js"]!.push(
			"webpack-hot-middleware/client?path=storage/__webpack_hmr"
		);
	}

	const compiler = webpack(config);

	app.use(
		webpackDevMiddleware(compiler, {
			index: "/",
			publicPath: config.output?.publicPath,
		})
	).use(
		webpackDevMiddleware(compiler, {
			publicPath: "/storage/__webpack_hmr",
		})
	);
};
