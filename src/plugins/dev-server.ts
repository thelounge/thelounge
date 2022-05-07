import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import express from "express";

import log from "../log";
import webpack from "webpack";
import webpackConfig from "../../webpack.config";

export default (app: express.Application) => {
	log.debug("Starting server in development mode");
	const config = webpackConfig(undefined, {mode: "development"});
	const compiler = webpack(config);

	app.use(
		webpackDevMiddleware(compiler, {
			index: "/",
			publicPath: config.output?.publicPath,
			// publicPath: "/"
		})
	).use(
		// TODO: Fix compiler type
		webpackHotMiddleware(compiler as any, {
			path: "/storage/__webpack_hmr",
		})
	);
};
