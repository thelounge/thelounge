import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import express from "express";

import log from "../log";

import webpack from "webpack";
import config from "../../webpack.config";

export default (app: express.Application) => {
	log.debug("Starting server in development mode");

	const webpackConfig = config(undefined, {mode: "production"});

	if (
		!webpackConfig ||
		!webpackConfig.plugins?.length ||
		!webpackConfig.entry ||
		!webpackConfig.entry["js/bundle.js"]
	) {
		throw new Error("No valid production webpack config found");
	}

	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
	webpackConfig.entry["js/bundle.js"].push(
		"webpack-hot-middleware/client?path=storage/__webpack_hmr"
	);

	const compiler = webpack(webpackConfig);

	app.use(
		webpackDevMiddleware(compiler, {
			index: "/",
			publicPath: webpackConfig.output?.publicPath,
		})
	).use(
		// TODO: Fix compiler type
		webpackHotMiddleware(compiler as any, {
			path: "/storage/__webpack_hmr",
		})
	);
};
