"use strict";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import express from "express";

import log from "../log";

export default (app: express.Application) => {
	log.debug("Starting server in development mode");

	const webpack = require("webpack");
	const webpackConfig = require("../../webpack.config.js")(undefined, { mode: "production" });

	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
	webpackConfig.entry["js/bundle.js"].push(
		"webpack-hot-middleware/client?path=storage/__webpack_hmr"
	);

	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

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
