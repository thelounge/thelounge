"use strict";

const _ = require("lodash");
const log = require("./log");
const pkg = require("../package.json");
const Client = require("./client");
const ClientManager = require("./clientManager");
const express = require("express");
const fs = require("fs");
const path = require("path");
const io = require("socket.io");
const dns = require("dns");
const Uploader = require("./plugins/uploader");
const Helper = require("./helper");
const colors = require("chalk");
const net = require("net");
const Identification = require("./identification");
const changelog = require("./plugins/changelog");

const themes = require("./plugins/packages/themes");
themes.loadLocalThemes();

const packages = require("./plugins/packages/index");
packages.loadPackages();

// The order defined the priority: the first available plugin is used
// ALways keep local auth in the end, which should always be enabled.
const authPlugins = [
	require("./plugins/auth/ldap"),
	require("./plugins/auth/local"),
];

// A random number that will force clients to reload the page if it differs
const serverHash = Math.floor(Date.now() * Math.random());

let manager = null;

module.exports = function() {
	log.info(`The Lounge ${colors.green(Helper.getVersion())} \
(Node.js ${colors.green(process.versions.node)} on ${colors.green(process.platform)} ${process.arch})`);
	log.info(`Configuration file: ${colors.green(Helper.getConfigPath())}`);

	const staticOptions = {
		redirect: false,
		maxAge: 86400 * 1000,
	};

	const app = express()
		.set("env", "production")
		.disable("x-powered-by")
		.use(allRequests)
		.use(index)
		.use(express.static(path.join(__dirname, "..", "public"), staticOptions))
		.use("/storage/", express.static(Helper.getStoragePath(), staticOptions));

	if (Helper.config.fileUpload.enable) {
		Uploader.router(app);
	}

	// This route serves *installed themes only*. Local themes are served directly
	// from the `public/themes/` folder as static assets, without entering this
	// handler. Remember this if you make changes to this function, serving of
	// local themes will not get those changes.
	app.get("/themes/:theme.css", (req, res) => {
		const themeName = req.params.theme;
		const theme = themes.getFilename(themeName);

		if (theme === undefined) {
			return res.status(404).send("Not found");
		}

		return res.sendFile(theme);
	});

	app.get("/packages/:package/:filename", (req, res) => {
		const packageName = req.params.package;
		const fileName = req.params.filename;
		const packageFile = packages.getPackage(packageName);

		if (!packageFile || !packages.getStylesheets().includes(`${packageName}/${fileName}`)) {
			return res.status(404).send("Not found");
		}

		const packagePath = Helper.getPackageModulePath(packageName);
		return res.sendFile(path.join(packagePath, fileName));
	});

	let server = null;

	if (Helper.config.public && (Helper.config.ldap || {}).enable) {
		log.warn("Server is public and set to use LDAP. Set to private mode if trying to use LDAP authentication.");
	}

	if (!Helper.config.https.enable) {
		server = require("http");
		server = server.createServer(app);
	} else {
		const keyPath = Helper.expandHome(Helper.config.https.key);
		const certPath = Helper.expandHome(Helper.config.https.certificate);
		const caPath = Helper.expandHome(Helper.config.https.ca);

		if (!keyPath.length || !fs.existsSync(keyPath)) {
			log.error("Path to SSL key is invalid. Stopping server...");
			process.exit();
		}

		if (!certPath.length || !fs.existsSync(certPath)) {
			log.error("Path to SSL certificate is invalid. Stopping server...");
			process.exit();
		}

		if (caPath.length && !fs.existsSync(caPath)) {
			log.error("Path to SSL ca bundle is invalid. Stopping server...");
			process.exit();
		}

		server = require("https");
		server = server.createServer({
			key: fs.readFileSync(keyPath),
			cert: fs.readFileSync(certPath),
			ca: caPath ? fs.readFileSync(caPath) : undefined,
		}, app);
	}

	let listenParams;

	if (typeof Helper.config.host === "string" && Helper.config.host.startsWith("unix:")) {
		listenParams = Helper.config.host.replace(/^unix:/, "");
	} else {
		listenParams = {
			port: Helper.config.port,
			host: Helper.config.host,
		};
	}

	server.on("error", (err) => log.error(`${err}`));

	server.listen(listenParams, () => {
		if (typeof listenParams === "string") {
			log.info("Available on socket " + colors.green(listenParams));
		} else {
			const protocol = Helper.config.https.enable ? "https" : "http";
			const address = server.address();

			log.info(
				"Available at " +
				colors.green(`${protocol}://${address.address}:${address.port}/`) +
				` in ${colors.bold(Helper.config.public ? "public" : "private")} mode`
			);
		}

		const sockets = io(server, {
			wsEngine: "ws",
			serveClient: false,
			transports: Helper.config.transports,
		});

		sockets.on("connect", (socket) => {
			if (Helper.config.public) {
				performAuthentication.call(socket, {});
			} else {
				socket.emit("auth", {
					serverHash: serverHash,
					success: true,
				});
				socket.on("auth", performAuthentication);
			}
		});

		manager = new ClientManager();

		new Identification((identHandler) => {
			manager.init(identHandler, sockets);
		});

		// Handle ctrl+c and kill gracefully
		let suicideTimeout = null;

		const exitGracefully = function() {
			if (suicideTimeout !== null) {
				return;
			}

			log.info("Exiting...");

			// Close all client and IRC connections
			manager.clients.forEach((client) => client.quit());

			if (Helper.config.prefetchStorage) {
				log.info("Clearing prefetch storage folder, this might take a while...");

				require("./plugins/storage").emptyDir();
			}

			// Forcefully exit after 3 seconds
			suicideTimeout = setTimeout(() => process.exit(1), 3000);

			// Close http server
			server.close(() => {
				clearTimeout(suicideTimeout);
				process.exit(0);
			});
		};

		process.on("SIGINT", exitGracefully);
		process.on("SIGTERM", exitGracefully);

		// Clear storage folder after server starts successfully
		if (Helper.config.prefetchStorage) {
			require("./plugins/storage").emptyDir();
		}
	});

	return server;
};

function getClientLanguage(socket) {
	const acceptLanguage = socket.handshake.headers["accept-language"];

	if (typeof acceptLanguage === "string" && /^[\x00-\x7F]{1,50}$/.test(acceptLanguage)) {
		// only allow ASCII strings between 1-50 characters in length
		return acceptLanguage;
	}

	return null;
}

function getClientIp(socket) {
	let ip = socket.handshake.address || "127.0.0.1";

	if (Helper.config.reverseProxy) {
		const forwarded = (socket.request.headers["x-forwarded-for"] || "").split(/\s*,\s*/).filter(Boolean);

		if (forwarded.length && net.isIP(forwarded[0])) {
			ip = forwarded[0];
		}
	}

	return ip.replace(/^::ffff:/, "");
}

function allRequests(req, res, next) {
	res.setHeader("X-Content-Type-Options", "nosniff");
	return next();
}

function index(req, res, next) {
	if (req.url.split("?")[0] !== "/") {
		return next();
	}

	const policies = [
		"default-src 'none'", // default to nothing
		"form-action 'self'", // 'self' to fix saving passwords in Firefox, even though login is handled in javascript
		"connect-src 'self' ws: wss:", // allow self for polling; websockets
		"style-src 'self' https: 'unsafe-inline'", // allow inline due to use in irc hex colors
		"script-src 'self'", // javascript
		"worker-src 'self'", // service worker
		"child-src 'self'", // deprecated fall back for workers, Firefox <58, see #1902
		"manifest-src 'self'", // manifest.json
		"font-src 'self' https:", // allow loading fonts from secure sites (e.g. google fonts)
		"media-src 'self' https:", // self for notification sound; allow https media (audio previews)
	];

	// If prefetch is enabled, but storage is not, we have to allow mixed content
	// - https://user-images.githubusercontent.com is where we currently push our changelog screenshots
	// - data: is required for the HTML5 video player
	if (Helper.config.prefetchStorage || !Helper.config.prefetch) {
		policies.push("img-src 'self' data: https://user-images.githubusercontent.com");
		policies.unshift("block-all-mixed-content");
	} else {
		policies.push("img-src http: https: data:");
	}

	res.setHeader("Content-Type", "text/html");
	res.setHeader("Content-Security-Policy", policies.join("; "));
	res.setHeader("Referrer-Policy", "no-referrer");

	return fs.readFile(path.join(__dirname, "..", "client", "index.html.tpl"), "utf-8", (err, file) => {
		if (err) {
			throw err;
		}

		res.send(_.template(file)(getServerConfiguration()));
	});
}

function initializeClient(socket, client, token, lastMessage) {
	socket.emit("authorized");

	client.clientAttach(socket.id, token);

	if (Helper.config.fileUpload.enable) {
		new Uploader(socket);
	}

	socket.on("disconnect", function() {
		process.nextTick(() => client.clientDetach(socket.id));
	});

	socket.on("input", (data) => {
		if (typeof data === "object") {
			client.input(data);
		}
	});

	socket.on("more", (data) => {
		if (typeof data === "object") {
			const history = client.more(data);

			if (history !== null) {
				socket.emit("more", history);
			}
		}
	});

	socket.on("network:new", (data) => {
		if (typeof data === "object") {
			// prevent people from overriding webirc settings
			data.ip = null;
			data.hostname = null;
			data.uuid = null;
			data.commands = null;
			data.ignoreList = null;

			client.connect(data);
		}
	});

	socket.on("network:get", (data) => {
		if (typeof data !== "string") {
			return;
		}

		const network = _.find(client.networks, {uuid: data});

		if (!network) {
			return;
		}

		socket.emit("network:info", getClientConfiguration(network.export()));
	});

	socket.on("network:edit", (data) => {
		if (typeof data !== "object") {
			return;
		}

		const network = _.find(client.networks, {uuid: data.uuid});

		if (!network) {
			return;
		}

		network.edit(client, data);
	});

	if (!Helper.config.public && !Helper.config.ldap.enable) {
		socket.on("change-password", (data) => {
			if (typeof data === "object") {
				const old = data.old_password;
				const p1 = data.new_password;
				const p2 = data.verify_password;

				if (typeof p1 === "undefined" || p1 === "") {
					socket.emit("change-password", {
						error: "Please enter a new password",
					});
					return;
				}

				if (p1 !== p2) {
					socket.emit("change-password", {
						error: "Both new password fields must match",
					});
					return;
				}

				Helper.password
					.compare(old || "", client.config.password)
					.then((matching) => {
						if (!matching) {
							socket.emit("change-password", {
								error: "The current password field does not match your account password",
							});
							return;
						}

						const hash = Helper.password.hash(p1);

						client.setPassword(hash, (success) => {
							const obj = {};

							if (success) {
								obj.success = "Successfully updated your password";
							} else {
								obj.error = "Failed to update your password";
							}

							socket.emit("change-password", obj);
						});
					}).catch((error) => {
						log.error(`Error while checking users password. Error: ${error}`);
					});
			}
		});
	}

	socket.on("open", (data) => {
		client.open(socket.id, data);
	});

	socket.on("sort", (data) => {
		if (typeof data === "object") {
			client.sort(data);
		}
	});

	socket.on("names", (data) => {
		if (typeof data === "object") {
			client.names(data);
		}
	});

	socket.on("changelog", () => {
		changelog.fetch((data) => {
			socket.emit("changelog", data);
		});
	});

	socket.on("msg:preview:toggle", (data) => {
		if (typeof data !== "object") {
			return;
		}

		const networkAndChan = client.find(data.target);

		if (!networkAndChan) {
			return;
		}

		const message = networkAndChan.chan.findMessage(data.msgId);

		if (!message) {
			return;
		}

		const preview = message.findPreview(data.link);

		if (preview) {
			preview.shown = data.shown;
		}
	});

	if (!Helper.config.public) {
		socket.on("push:register", (subscription) => {
			if (!client.config.sessions.hasOwnProperty(token)) {
				return;
			}

			const registration = client.registerPushSubscription(client.config.sessions[token], subscription);

			if (registration) {
				client.manager.webPush.pushSingle(client, registration, {
					type: "notification",
					timestamp: Date.now(),
					title: "The Lounge",
					body: "🚀 Push notifications have been enabled",
				});
			}
		});

		socket.on("push:unregister", () => client.unregisterPushSubscription(token));
	}

	const sendSessionList = () => {
		const sessions = _.map(client.config.sessions, (session, sessionToken) => ({
			current: sessionToken === token,
			active: _.find(client.attachedClients, (u) => u.token === sessionToken) !== undefined,
			lastUse: session.lastUse,
			ip: session.ip,
			agent: session.agent,
			token: sessionToken, // TODO: Ideally don't expose actual tokens to the client
		}));

		socket.emit("sessions:list", sessions);
	};

	socket.on("sessions:get", sendSessionList);

	if (!Helper.config.public) {
		socket.on("setting:set", (newSetting) => {
			if (!newSetting || typeof newSetting !== "object") {
				return;
			}

			if (typeof newSetting.value === "object" || typeof newSetting.name !== "string" || newSetting.name[0] === "_") {
				return;
			}

			// We do not need to do write operations and emit events if nothing changed.
			if (client.config.clientSettings[newSetting.name] !== newSetting.value) {
				client.config.clientSettings[newSetting.name] = newSetting.value;

				// Pass the setting to all clients.
				client.emit("setting:new", {
					name: newSetting.name,
					value: newSetting.value,
				});

				client.manager.updateUser(client.name, {
					clientSettings: client.config.clientSettings,
				});

				if (newSetting.name === "highlights") {
					client.compileCustomHighlights();
				}
			}
		});

		socket.on("setting:get", () => {
			if (!client.config.hasOwnProperty("clientSettings")) {
				socket.emit("setting:all", {});
				return;
			}

			const clientSettings = client.config.clientSettings;
			socket.emit("setting:all", clientSettings);
		});
	}

	socket.on("sign-out", (tokenToSignOut) => {
		// If no token provided, sign same client out
		if (!tokenToSignOut) {
			tokenToSignOut = token;
		}

		if (!client.config.sessions.hasOwnProperty(tokenToSignOut)) {
			return;
		}

		delete client.config.sessions[tokenToSignOut];

		client.manager.updateUser(client.name, {
			sessions: client.config.sessions,
		});

		_.map(client.attachedClients, (attachedClient, socketId) => {
			if (attachedClient.token !== tokenToSignOut) {
				return;
			}

			const socketToRemove = manager.sockets.of("/").connected[socketId];

			socketToRemove.emit("sign-out");
			socketToRemove.disconnect();
		});

		// Do not send updated session list if user simply logs out
		if (tokenToSignOut !== token) {
			sendSessionList();
		}
	});

	socket.join(client.id);

	const sendInitEvent = (tokenToSend) => {
		socket.emit("init", {
			applicationServerKey: manager.webPush.vapidKeys.publicKey,
			pushSubscription: client.config.sessions[token],
			active: client.lastActiveChannel,
			networks: client.networks.map((network) => network.getFilteredClone(client.lastActiveChannel, lastMessage)),
			token: tokenToSend,
		});
	};

	if (!Helper.config.public && token === null) {
		client.generateToken((newToken) => {
			client.attachedClients[socket.id].token = token = client.calculateTokenHash(newToken);

			client.updateSession(token, getClientIp(socket), socket.request);

			sendInitEvent(newToken);
		});
	} else {
		sendInitEvent(null);
	}
}

function getClientConfiguration(network) {
	const config = _.pick(Helper.config, [
		"public",
		"lockNetwork",
		"displayNetwork",
		"useHexIp",
		"prefetch",
	]);

	config.fileUpload = Helper.config.fileUpload.enable;
	config.ldapEnabled = Helper.config.ldap.enable;

	if (config.displayNetwork) {
		config.defaults = _.clone(network || Helper.config.defaults);
	} else {
		// Only send defaults that are visible on the client
		config.defaults = _.pick(network || Helper.config.defaults, [
			"name",
			"nick",
			"username",
			"password",
			"realname",
			"join",
		]);
	}

	if (!network) {
		config.version = pkg.version;
		config.gitCommit = Helper.getGitCommit();
		config.themes = themes.getAll();
		config.defaultTheme = Helper.config.theme;
		config.defaults.nick = Helper.getDefaultNick();
	}

	if (Uploader) {
		config.fileUploadMaxFileSize = Uploader.getMaxFileSize();
	}

	return config;
}

function getServerConfiguration() {
	const config = _.clone(Helper.config);

	config.stylesheets = packages.getStylesheets();

	return config;
}

function performAuthentication(data) {
	if (typeof data !== "object") {
		return;
	}

	const socket = this;
	let client;
	let token = null;

	const finalInit = () => initializeClient(socket, client, token, data.lastMessage || -1);

	const initClient = () => {
		socket.emit("configuration", getClientConfiguration());

		client.ip = getClientIp(socket);
		client.language = getClientLanguage(socket);

		// If webirc is enabled perform reverse dns lookup
		if (Helper.config.webirc === null) {
			return finalInit();
		}

		reverseDnsLookup(client.ip, (hostname) => {
			client.hostname = hostname;

			finalInit();
		});
	};

	if (Helper.config.public) {
		client = new Client(manager);
		manager.clients.push(client);

		socket.on("disconnect", function() {
			manager.clients = _.without(manager.clients, client);
			client.quit();
		});

		initClient();

		return;
	}

	const authCallback = (success) => {
		// Authorization failed
		if (!success) {
			if (!client) {
				log.warn(`Authentication for non existing user attempted from ${colors.bold(getClientIp(socket))}`);
			} else {
				log.warn(`Authentication failed for user ${colors.bold(data.user)} from ${colors.bold(getClientIp(socket))}`);
			}

			socket.emit("auth", {success: false});
			return;
		}

		// If authorization succeeded but there is no loaded user,
		// load it and find the user again (this happens with LDAP)
		if (!client) {
			client = manager.loadUser(data.user);
		}

		initClient();
	};

	client = manager.findClient(data.user);

	// We have found an existing user and client has provided a token
	if (client && data.token) {
		const providedToken = client.calculateTokenHash(data.token);

		if (client.config.sessions.hasOwnProperty(providedToken)) {
			token = providedToken;

			client.updateSession(providedToken, getClientIp(socket), socket.request);

			return authCallback(true);
		}
	}

	// Perform password checking
	let auth = () => {
		log.error("None of the auth plugins is enabled");
	};

	for (let i = 0; i < authPlugins.length; ++i) {
		if (authPlugins[i].isEnabled()) {
			auth = authPlugins[i].auth;
			break;
		}
	}

	auth(manager, client, data.user, data.password, authCallback);
}

function reverseDnsLookup(ip, callback) {
	dns.reverse(ip, (err, hostnames) => {
		if (!err && hostnames.length) {
			return callback(hostnames[0]);
		}

		callback(ip);
	});
}
