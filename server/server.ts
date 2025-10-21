import _ from "lodash";
import {Server as wsServer} from "ws";
import express, {NextFunction, Request, Response} from "express";
import passport from "passport";
import fs from "fs";
import path from "path";
import {Server as ioServer, Socket as ioSocket} from "socket.io";
import colors from "chalk";
import net from "net";

import log from "./log";
import ClientManager from "./clientManager";
import Uploader from "./plugins/uploader";
import Helper from "./helper";
import Config, {ConfigType} from "./config";
import Identification from "./identification";
import changelog from "./plugins/changelog";

import themes from "./plugins/packages/themes";
import packages from "./plugins/packages/index";
import Utils from "./command-line/utils";
import type {
	ClientToServerEvents,
	InterServerEvents,
	ServerToClientEvents,
	SocketData,
} from "../shared/types/socket-events";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import {Persistence} from "./persistence/persistence";
import {performAuthentication} from "./initClient";
import {loadAuthMethod} from "./auth/loadAuthMethod";
import {loadSessionSecret} from "./auth/loadSessionSecret";

themes.loadLocalThemes();

export interface User extends Express.User {
	username: string;
}

declare module "express-session" {
	interface SessionData {
		ip: string;
		userAgent: string;
	}
}

type ServerOptions = {
	dev: boolean;
};

type ServerConfiguration = ConfigType & {
	stylesheets: string[];
};

type IndexTemplateConfiguration = ServerConfiguration & {
	cacheBust: string;
};

export type Socket = ioSocket<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;
export type Server = ioServer<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;

// A random number that will force clients to reload the page if it differs
const serverHash = Math.floor(Date.now() * Math.random());

export default async function (
	options: ServerOptions = {
		dev: false,
	}
) {
	log.info(`The Lounge ${colors.green(Helper.getVersion())} \
(Node.js ${colors.green(process.versions.node)} on ${colors.green(process.platform)} ${
		process.arch
	})`);
	log.info(`Configuration file: ${colors.green(Config.getConfigPath())}`);

	const staticOptions = {
		redirect: false,
		maxAge: 86400 * 1000,
	};

	const app = express();

	if (options.dev) {
		(await import("./plugins/dev-server")).default(app);
	}

	const persistence = new Persistence(Config.values);
	const manager = new ClientManager();
	const authMethod = loadAuthMethod(Config.values, manager);

	// Run migrations to ensure database schema is up to date
	await persistence.runMigrations();

	const sessionStore = new (SequelizeStore(session.Store))({
		db: persistence.database,
		table: "Session",
		expiration: 24 * 60 * 60 * 1000, // 24 hours
		checkExpirationInterval: 5 * 60 * 1000, // every 5 minutes
		extendDefaultFields(defaults, sessionValues) {
			const username = sessionValues.passport?.user?.username || null;
			const ip = sessionValues.ip || null;
			const userAgent = sessionValues.userAgent || null;

			return {
				data: defaults.data,
				expires: defaults.expires,
				username: username,
				lastIp: ip,
				lastSeen: new Date(),
				lastUserAgent: userAgent,
			};
		},
	});

	const sessionMiddleware = session({
		store: sessionStore,
		secret: loadSessionSecret(Config.values, Config.getSessionSecretPath()),
		resave: false,
		saveUninitialized: false,
	});

	const passportStrategy = authMethod.passportStrategy();
	passport.use(passportStrategy);

	app.set("env", "production")
		.disable("x-powered-by")
		.use(allRequests)
		.use(addSecurityHeaders)
		.use(express.urlencoded({extended: true}))
		.use(express.json())
		.use(sessionMiddleware as any)
		.use((req: Request, _res: Response, next: NextFunction) => {
			if (req.session) {
				req.session.ip = getRequestIp(req);
				req.session.userAgent = req.headers["user-agent"] || "";
			}

			next();
		})
		.use(passport.initialize() as any)
		.use(passport.session())
		.use((req: Request, _res: Response, next: NextFunction) => {
			// Update session record with username, IP, and user agent after authentication
			if (req.session && req.user) {
				const username = (req.user as User).username;

				persistence
					.updateSession(
						req.session.id,
						req.session.ip || "",
						new Date(),
						username,
						req.session.userAgent || ""
					)
					.catch((err) => {
						log.error(`Failed updating session with username`, err);
					});
			}

			next();
		})
		.get("/", indexRequest)
		.get("/service-worker.js", forceNoCacheRequest)
		.get("/js/bundle.js.map", forceNoCacheRequest)
		.get("/css/style.css.map", forceNoCacheRequest)
		.use(express.static(Utils.getFileFromRelativeToRoot("public"), staticOptions))
		.use("/storage/", express.static(Config.getStoragePath(), staticOptions))
		.get("/api/user-info", apiUserInfo);
	authMethod.registerRoutes(app);

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user: User, done) {
		done(null, user);
	});

	if (Config.values.fileUpload.enable) {
		Uploader.router(app);
	}

	// This route serves *installed themes only*. Local themes are served directly
	// from the `public/themes/` folder as static assets, without entering this
	// handler. Remember this if you make changes to this function, serving of
	// local themes will not get those changes.
	app.get("/themes/:theme.css", (req, res) => {
		const themeName = encodeURIComponent(req.params.theme);
		const theme = themes.getByName(themeName);

		if (theme === undefined || theme.filename === undefined) {
			return res.status(404).send("Not found");
		}

		return res.sendFile(theme.filename);
	});

	app.get("/packages/:package/:filename", (req, res) => {
		const packageName = req.params.package;
		const fileName = req.params.filename;
		const packageFile = packages.getPackage(packageName);

		if (!packageFile || !packages.getFiles().includes(`${packageName}/${fileName}`)) {
			return res.status(404).send("Not found");
		}

		const packagePath = Config.getPackageModulePath(packageName);
		return res.sendFile(path.join(packagePath, fileName));
	});

	if (Config.values.public && (Config.values.ldap || {}).enable) {
		log.warn(
			"Server is public and set to use LDAP. Set to private mode if trying to use LDAP authentication."
		);
	}

	if (Config.values.public && (Config.values.oidc || {}).enable) {
		log.warn(
			"Server is public and set to use OIDC. Set to private mode if trying to use OIDC authentication."
		);
	}

	let server: import("http").Server | import("https").Server;

	if (!Config.values.https.enable) {
		const createServer = (await import("http")).createServer;
		server = createServer(app);
	} else {
		const keyPath = Helper.expandHome(Config.values.https.key);
		const certPath = Helper.expandHome(Config.values.https.certificate);
		const caPath = Helper.expandHome(Config.values.https.ca);

		if (!keyPath.length || !fs.existsSync(keyPath)) {
			log.error("Path to SSL key is invalid. Stopping server...");
			process.exit(1);
		}

		if (!certPath.length || !fs.existsSync(certPath)) {
			log.error("Path to SSL certificate is invalid. Stopping server...");
			process.exit(1);
		}

		if (caPath.length && !fs.existsSync(caPath)) {
			log.error("Path to SSL ca bundle is invalid. Stopping server...");
			process.exit(1);
		}

		const createServer = (await import("https")).createServer;
		server = createServer(
			{
				key: fs.readFileSync(keyPath),
				cert: fs.readFileSync(certPath),
				ca: caPath ? fs.readFileSync(caPath) : undefined,
			},
			app
		);
	}

	let listenParams:
		| string
		| {
				port: number;
				host: string | undefined;
		  };

	if (typeof Config.values.host === "string" && Config.values.host.startsWith("unix:")) {
		listenParams = Config.values.host.replace(/^unix:/, "");
	} else {
		listenParams = {
			port: Config.values.port,
			host: Config.values.host,
		};
	}

	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	server.on("error", (err) => log.error(`${err}`));

	server.listen(listenParams, () => {
		if (typeof listenParams === "string") {
			log.info("Available on socket " + colors.green(listenParams));
		} else {
			const protocol = Config.values.https.enable ? "https" : "http";
			const address = server?.address();

			if (address && typeof address !== "string") {
				// TODO: Node may revert the Node 18 family string --> number change
				// @ts-expect-error This condition will always return 'false' since the types 'string' and 'number' have no overlap.
				if (address.family === "IPv6" || address.family === 6) {
					address.address = "[" + address.address + "]";
				}

				log.info(
					"Available at " +
						colors.green(`${protocol}://${address.address}:${address.port}/`) +
						` in ${colors.bold(Config.values.public ? "public" : "private")} mode`
				);
			}
		}

		// This should never happen
		if (!server) {
			return;
		}

		const sockets: Server = new ioServer(server, {
			wsEngine: wsServer,
			cookie: false,
			serveClient: false,

			// TODO: type as Server.Transport[]
			transports: Config.values.transports as any,
			pingTimeout: 60000,
		});

		function onlyForHandshake(middleware) {
			return (req, res, next) => {
				const isHandshake = req._query.sid === undefined;

				if (isHandshake) {
					middleware(req, res, next);
				} else {
					next();
				}
			};
		}

		sockets.engine.use(onlyForHandshake(sessionMiddleware));
		sockets.engine.use(onlyForHandshake(passport.session()));
		sockets.engine.use(
			onlyForHandshake((req, res, next) => {
				if (req.user) {
					next();
				} else {
					res.writeHead(401);
					res.end();
				}
			})
		);

		sockets.on("connect", (socket) => {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			socket.on("error", (err) => log.error(`io socket error: ${err}`));
			socket.on("auth:perform", performAuthentication(persistence, sessionStore, manager));
			socket.emit("auth:start", serverHash);
		});

		packages.loadPackages();

		const defaultTheme = themes.getByName(Config.values.theme);

		if (defaultTheme === undefined) {
			log.warn(
				`The specified default theme "${colors.red(
					Config.values.theme
				)}" does not exist, verify your config.`
			);
			Config.values.theme = "default";
		} else if (defaultTheme.themeColor) {
			Config.values.themeColor = defaultTheme.themeColor;
		}

		new Identification((identHandler, err) => {
			if (err) {
				log.error(`Could not start identd server, ${err.message}`);
				process.exit(1);
			} else if (!manager) {
				log.error("Could not start identd server, ClientManager is undefined");
				process.exit(1);
			}

			manager.init(identHandler, Config.values.public, sockets);
		});

		// Handle ctrl+c and kill gracefully
		let suicideTimeout: NodeJS.Timeout | null = null;

		const exitGracefully = async function () {
			if (suicideTimeout !== null) {
				return;
			}

			log.info("Exiting...");

			// Close all client and IRC connections
			if (manager) {
				manager.clients.forEach((client) => client.quit());
			}

			if (Config.values.prefetchStorage) {
				log.info("Clearing prefetch storage folder, this might take a while...");

				(await import("./plugins/storage")).default.emptyDir();
			}

			// Forcefully exit after 3 seconds
			suicideTimeout = setTimeout(() => process.exit(1), 3000);

			// Close http server
			server?.close(() => {
				if (suicideTimeout !== null) {
					clearTimeout(suicideTimeout);
				}

				process.exit(0);
			});
		};

		/* eslint-disable @typescript-eslint/no-misused-promises */
		process.on("SIGINT", exitGracefully);
		process.on("SIGTERM", exitGracefully);
		/* eslint-enable @typescript-eslint/no-misused-promises */

		// Resume stdin to make it available for use
		// By default, Node.js keeps stdin in paused mode, which prevents reading from it
		// This makes stdin available whether it's a TTY (interactive) or piped input
		if (process.stdin.readable) {
			process.stdin.resume();
		}

		// Clear storage folder after server starts successfully
		if (Config.values.prefetchStorage) {
			import("./plugins/storage")
				.then(({default: storage}) => {
					storage.emptyDir();
				})
				.catch((err: Error) => {
					log.error(`Could not clear storage folder, ${err.message}`);
				});
		}

		changelog.checkForUpdates(manager);
	});

	return server;
}

function getRequestIp(req: Request): string {
	let ip = req.ip || req.socket.remoteAddress || "127.0.0.1";

	if (Config.values.reverseProxy) {
		const forwarded = String(req.headers["x-forwarded-for"])
			.split(/\s*,\s*/)
			.filter(Boolean);

		if (forwarded.length && net.isIP(forwarded[0])) {
			ip = forwarded[0];
		}
	}

	return ip.replace(/^::ffff:/, "");
}

function allRequests(_req: Request, res: Response, next: NextFunction) {
	res.setHeader("X-Content-Type-Options", "nosniff");
	return next();
}

function addSecurityHeaders(_req: Request, res: Response, next: NextFunction) {
	const policies = [
		"default-src 'none'", // default to nothing
		"base-uri 'none'", // disallow <base>, has no fallback to default-src
		"form-action 'self'", // 'self' to fix saving passwords in Firefox, even though login is handled in javascript
		"connect-src 'self' ws: wss:", // allow self for polling; websockets
		"style-src 'self' https: 'unsafe-inline'", // allow inline due to use in irc hex colors
		"script-src 'self'", // javascript
		"worker-src 'self'", // service worker
		"manifest-src 'self'", // manifest.json
		"font-src 'self' https:", // allow loading fonts from secure sites (e.g. google fonts)
		"media-src 'self' https:", // self for notification sound; allow https media (audio previews)
	];

	// If prefetch is enabled, but storage is not, we have to allow mixed content
	// - https://user-images.githubusercontent.com is where we currently push our changelog screenshots
	// - data: is required for the HTML5 video player
	if (Config.values.prefetchStorage || !Config.values.prefetch) {
		policies.push("img-src 'self' data: https://user-images.githubusercontent.com");
		policies.unshift("block-all-mixed-content");
	} else {
		policies.push("img-src http: https: data:");
	}

	res.setHeader("Content-Security-Policy", policies.join("; "));
	res.setHeader("Referrer-Policy", "no-referrer");

	return next();
}

function forceNoCacheRequest(_req: Request, res: Response, next: NextFunction) {
	// Intermittent proxies must not cache the following requests,
	// browsers must fetch the latest version of these files (service worker, source maps)
	res.setHeader("Cache-Control", "no-cache, no-transform");
	return next();
}

function apiUserInfo(req: Request, res: Response) {
	if (!req.user) {
		return res.status(401).json({error: "Unauthorized"});
	}

	res.header("Cache-Control", "no-store");
	res.json({username: (req.user as User).username});
}

function indexRequest(_req: Request, res: Response) {
	res.setHeader("Content-Type", "text/html");

	fs.readFile(Utils.getFileFromRelativeToRoot("client/index.html.tpl"), "utf-8", (err, file) => {
		if (err) {
			log.error(`failed to server index request: ${err.name}, ${err.message}`);
			res.sendStatus(500);
			return;
		}

		const config: IndexTemplateConfiguration = {
			...getServerConfiguration(),
			...{cacheBust: Helper.getVersionCacheBust()},
		};

		res.send(_.template(file)(config));
	});
}

function getServerConfiguration(): ServerConfiguration {
	return {...Config.values, ...{stylesheets: packages.getStylesheets()}};
}
