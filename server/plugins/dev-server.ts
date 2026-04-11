// @ts-expect-error -- vite uses "exports" which requires moduleResolution: "bundler"
import {createServer as createViteServer} from "vite";
import express from "express";
import path from "path";

import log from "../log";

export default async (app: express.Application) => {
	log.debug("Starting server in development mode");

	const vite = await createViteServer({
		configFile: path.resolve(__dirname, "../../vite.config.ts"),
		server: {middlewareMode: true},
		appType: "custom",
	});

	app.use(vite.middlewares);
};
