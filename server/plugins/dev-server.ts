// @ts-expect-error -- vite uses "exports" which requires moduleResolution: "bundler"
import {createServer as createViteServer} from "vite";
import express from "express";
import fs from "fs";

import log from "../log";
import fromRoot from "../rootpath";
import {injectServerConfig} from "./html-config";

export default async (app: express.Application) => {
	log.debug("Starting server in development mode");

	const vite = await createViteServer({
		configFile: fromRoot("vite.config.ts"),
		server: {middlewareMode: true},
		appType: "custom",
	});

	app.use(vite.middlewares);

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	app.get("/", async (req, res) => {
		const rawHtml = fs.readFileSync(fromRoot("client", "index.html"), "utf-8");
		const html = await vite.transformIndexHtml(req.url, rawHtml);
		res.setHeader("Content-Type", "text/html");
		res.send(injectServerConfig(html));
	});
};
