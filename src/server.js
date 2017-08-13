"use strict";

var _ = require("lodash");
var pkg = require("../package.json");
var Client = require("./client");
var ClientManager = require("./clientManager");
var express = require("express");
var expressHandlebars = require("express-handlebars");
var fs = require("fs");
var path = require("path");
var io = require("socket.io");
var dns = require("dns");
var Helper = require("./helper");
var ldap = require("ldapjs");
var colors = require("colors/safe");
const net = require("net");
const Identification = require("./identification");

var manager = null;

module.exports = function() {
	log.info(`The Lounge ${colors.green(Helper.getVersion())} \
(node ${colors.green(process.versions.node)} on ${colors.green(process.platform)} ${process.arch})`);
	log.info(`Configuration file: ${colors.green(Helper.CONFIG_PATH)}`);

	if (!fs.existsSync("client/js/bundle.js")) {
		log.error(`The client application was not built. Run ${colors.bold("NODE_ENV=production npm run build")} to resolve this.`);
		process.exit();
	}

	var app = express()
		.use(allRequests)
		.use(index)
		.use(express.static("client"))
		.use("/storage/", express.static(Helper.getStoragePath(), {
			redirect: false,
			maxAge: 86400 * 1000,
		}))
		.engine("html", expressHandlebars({
			extname: ".html",
			helpers: {
				tojson: (c) => JSON.stringify(c)
			}
		}))
		.set("view engine", "html")
		.set("views", path.join(__dirname, "..", "client"));

	var config = Helper.config;
	var server = null;

	if (config.public && (config.ldap || {}).enable) {
		log.warn("Server is public and set to use LDAP. Set to private mode if trying to use LDAP authentication.");
	}

	if (!config.https.enable) {
		server = require("http");
		server = server.createServer(app);
	} else {
		const keyPath = Helper.expandHome(config.https.key);
		const certPath = Helper.expandHome(config.https.certificate);
		const caPath = Helper.expandHome(config.https.ca);

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

		server = require("spdy");
		server = server.createServer({
			key: fs.readFileSync(keyPath),
			cert: fs.readFileSync(certPath),
			ca: caPath ? fs.readFileSync(caPath) : undefined
		}, app);
	}

	server.listen({
		port: config.port,
		host: config.host,
	}, () => {
		const protocol = config.https.enable ? "https" : "http";
		var address = server.address();
		log.info(`Available on ${colors.green(protocol + "://" + address.address + ":" + address.port + "/")} \
in ${config.public ? "public" : "private"} mode`);
	});

	var sockets = io(server, {
		serveClient: false,
		transports: config.transports
	});

	sockets.on("connect", function(socket) {
		if (config.public) {
			performAuthentication.call(socket, {});
		} else {
			socket.emit("auth", {success: true});
			socket.on("auth", performAuthentication);
		}
	});

	manager = new ClientManager();

	new Identification((identHandler) => {
		manager.init(identHandler, sockets);
	});
};

function getClientIp(request) {
	let ip = request.connection.remoteAddress;

	if (Helper.config.reverseProxy) {
		const forwarded = (request.headers["x-forwarded-for"] || "").split(/\s*,\s*/).filter(Boolean);

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

	var data = _.merge(
		pkg,
		Helper.config
	);
	data.gitCommit = Helper.getGitCommit();
	data.themes = fs.readdirSync("client/themes/").filter(function(themeFile) {
		return themeFile.endsWith(".css");
	}).map(function(css) {
		const filename = css.slice(0, -4);
		return {
			name: filename.charAt(0).toUpperCase() + filename.slice(1),
			filename: filename
		};
	});

	const policies = [
		"default-src *",
		"connect-src 'self' ws: wss:",
		"style-src * 'unsafe-inline'",
		"script-src 'self'",
		"child-src 'self'",
		"object-src 'none'",
		"form-action 'none'",
	];

	// If prefetch is enabled, but storage is not, we have to allow mixed content
	if (Helper.config.prefetchStorage || !Helper.config.prefetch) {
		policies.push("img-src 'self'");
		policies.unshift("block-all-mixed-content");
	}

	res.setHeader("Content-Security-Policy", policies.join("; "));
	res.setHeader("Referrer-Policy", "no-referrer");
	res.render("index", data);
}

function initializeClient(socket, client, generateToken, token) {
	socket.emit("authorized");

	socket.on("disconnect", function() {
		client.clientDetach(socket.id);
	});
	client.clientAttach(socket.id);

	socket.on(
		"input",
		function(data) {
			client.input(data);
		}
	);

	socket.on(
		"more",
		function(data) {
			client.more(data);
		}
	);

	socket.on(
		"conn",
		function(data) {
			// prevent people from overriding webirc settings
			data.ip = null;
			data.hostname = null;

			client.connect(data);
		}
	);

	if (!Helper.config.public && !Helper.config.ldap.enable) {
		socket.on(
			"change-password",
			function(data) {
				var old = data.old_password;
				var p1 = data.new_password;
				var p2 = data.verify_password;
				if (typeof p1 === "undefined" || p1 === "") {
					socket.emit("change-password", {
						error: "Please enter a new password"
					});
					return;
				}
				if (p1 !== p2) {
					socket.emit("change-password", {
						error: "Both new password fields must match"
					});
					return;
				}

				Helper.password
					.compare(old || "", client.config.password)
					.then((matching) => {
						if (!matching) {
							socket.emit("change-password", {
								error: "The current password field does not match your account password"
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
		);
	}

	socket.on(
		"open",
		function(data) {
			client.open(socket.id, data);
		}
	);

	socket.on(
		"sort",
		function(data) {
			client.sort(data);
		}
	);

	socket.on(
		"names",
		function(data) {
			client.names(data);
		}
	);

	socket.on("msg:preview:toggle", function(data) {
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

	socket.on("sign-out", () => {
		delete client.config.sessions[token];

		client.manager.updateUser(client.name, {
			sessions: client.config.sessions
		}, (err) => {
			if (err) {
				log.error("Failed to update sessions for", client.name, err);
			}
		});

		socket.emit("sign-out");
	});

	socket.join(client.id);

	const sendInitEvent = (tokenToSend) => {
		socket.emit("init", {
			active: client.lastActiveChannel,
			networks: client.networks,
			token: tokenToSend
		});
	};

	if (generateToken) {
		client.generateToken((newToken) => {
			token = newToken;

			client.updateSession(token, getClientIp(socket.request), socket.request);

			client.manager.updateUser(client.name, {
				sessions: client.config.sessions
			}, (err) => {
				if (err) {
					log.error("Failed to update sessions for", client.name, err);
				}
			});

			sendInitEvent(token);
		});
	} else {
		sendInitEvent(null);
	}
}

function localAuth(client, user, password, callback) {
	// If no user is found, or if the client has not provided a password,
	// fail the authentication straight away
	if (!client || !password) {
		return callback(false);
	}

	// If this user has no password set, fail the authentication
	if (!client.config.password) {
		log.error(`User ${colors.bold(user)} with no local password set tried to sign in. (Probably a LDAP user)`);
		return callback(false);
	}

	Helper.password
		.compare(password, client.config.password)
		.then((matching) => {
			if (matching && Helper.password.requiresUpdate(client.config.password)) {
				const hash = Helper.password.hash(password);

				client.setPassword(hash, (success) => {
					if (success) {
						log.info(`User ${colors.bold(client.name)} logged in and their hashed password has been updated to match new security requirements`);
					}
				});
			}

			callback(matching);
		}).catch((error) => {
			log.error(`Error while checking users password. Error: ${error}`);
		});
}

function ldapAuth(client, user, password, callback) {
	var userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");
	var bindDN = Helper.config.ldap.primaryKey + "=" + userDN + "," + Helper.config.ldap.baseDN;

	var ldapclient = ldap.createClient({
		url: Helper.config.ldap.url
	});

	ldapclient.on("error", function(err) {
		log.error("Unable to connect to LDAP server", err);
		callback(!err);
	});

	ldapclient.bind(bindDN, password, function(err) {
		if (!err && !client) {
			if (!manager.addUser(user, null)) {
				log.error("Unable to create new user", user);
			}
		}
		ldapclient.unbind();
		callback(!err);
	});
}

function performAuthentication(data) {
	const socket = this;
	let client;

	const finalInit = () => initializeClient(socket, client, !!data.remember, data.token || null);

	const initClient = () => {
		client.ip = getClientIp(socket.request);

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
			socket.emit("auth", {success: false});
			return;
		}

		// If authorization succeeded but there is no loaded user,
		// load it and find the user again (this happens with LDAP)
		if (!client) {
			manager.loadUser(data.user);
			client = manager.findClient(data.user);
		}

		initClient();
	};

	client = manager.findClient(data.user);

	// We have found an existing user and client has provided a token
	if (client && data.token && typeof client.config.sessions[data.token] !== "undefined") {
		client.updateSession(data.token, getClientIp(socket.request), socket.request);

		authCallback(true);
		return;
	}

	// Perform password checking
	if (!Helper.config.public && Helper.config.ldap.enable) {
		ldapAuth(client, data.user, data.password, authCallback);
	} else {
		localAuth(client, data.user, data.password, authCallback);
	}
}

function reverseDnsLookup(ip, callback) {
	dns.reverse(ip, (err, hostnames) => {
		if (!err && hostnames.length) {
			return callback(hostnames[0]);
		}

		callback(ip);
	});
}
