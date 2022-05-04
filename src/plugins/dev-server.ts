"use strict";
import log from "../log";
import webpack from "webpack";
import webpackConfig from "../../webpack.config";
import webpackDevMiddleware from "webpack-dev-middleware";

export default (app) => {
	log.debug("Starting server in development mode");
	const config = webpackConfig();
	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
	webpackConfig.entry["js/bundle.js"].push(
		"webpack-hot-middleware/client?path=storage/__webpack_hmr"
	);

	const compiler = webpack(webpackConfig);

	app.use(
		webpackDevMiddleware(compiler, {
			index: "/",
			publicPath: webpackConfig.output.publicPath,
		})
	).use(
		webpackDevMiddleware(compiler, {
			path: "/storage/__webpack_hmr",
		})
	);
};
