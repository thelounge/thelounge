"use strict";

var _ = require("lodash");
var pkg = require("../package.json");
var Client = require("./client");
var ClientManager = require("./clientManager");
var express = require("express");
var fs = require("fs");
var io = require("socket.io");
var dns = require("dns");
var Helper = require("./helper");
var ldap = require("ldapjs");
var colors = require("colors/safe");

var manager = null;
var authFunction = localAuth;

module.exports = function() {
	manager = new ClientManager();

	if (!fs.existsSync("client/js/bundle.js")) {
		log.error(`The client application was not built. Run ${colors.bold("NODE_ENV=production npm run build")} to resolve this.`);
		process.exit();
	}

	var app = express()
		.use(allRequests)
		.use(index)
		.use(express.static("client"));

	var config = Helper.config;
	var server = null;

	if (config.public && (config.ldap || {}).enable) {
		log.warn("Server is public and set to use LDAP. Set to private mode if trying to use LDAP authentication.");
	}

	if (!config.https.enable) {
		server = require("http");
		server = server.createServer(app).listen(config.port, config.host);
	} else {
		server = require("spdy");
		const keyPath = Helper.expandHome(config.https.key);
		const certPath = Helper.expandHome(config.https.certificate);
		if (!config.https.key.length || !fs.existsSync(keyPath)) {
			log.error("Path to SSL key is invalid. Stopping server...");
			process.exit();
		}
		if (!config.https.certificate.length || !fs.existsSync(certPath)) {
			log.error("Path to SSL certificate is invalid. Stopping server...");
			process.exit();
		}
		server = server.createServer({
			key: fs.readFileSync(keyPath),
			cert: fs.readFileSync(certPath)
		}, app).listen(config.port, config.host);
	}

	if (config.identd.enable) {
		if (manager.identHandler) {
			log.warn("Using both identd and oidentd at the same time!");
		}

		require("./identd").start(config.identd.port);
	}

	if (!config.public && (config.ldap || {}).enable) {
		authFunction = ldapAuth;
	}

	var sockets = io(server, {
		serveClient: false,
		transports: config.transports
	});

	sockets.on("connect", function(socket) {
		if (config.public) {
			auth.call(socket);
		} else {
			init(socket);
		}

	function shutdown() {
	    server.close(); // Removes socket file
	    process.exit();
	}

	process.on('SIGINT', shutdown);

	});

	manager.sockets = sockets;

	const protocol = config.https.enable ? "https" : "http";
	const host = config.host || "*";

	log.info(`The Lounge ${colors.green(Helper.getVersion())} is now running \
using node ${colors.green(process.versions.node)} on ${colors.green(process.platform)} (${process.arch})`);
	log.info(`Configuration file: ${colors.green(Helper.CONFIG_PATH)}`);
	log.info(`Available on ${colors.green(protocol + "://" + host + ":" + config.port + "/")} \
in ${config.public ? "public" : "private"} mode`);
	log.info("Press Ctrl-C to stop\n");

	if (!config.public) {
		if ("autoload" in config) {
			log.warn(`Autoloading users is now always enabled. Please remove the ${colors.yellow("autoload")} option from your configuration file.`);
		}

		manager.autoloadUsers();
	}
};

function getClientIp(req) {
	var ip;

	if (!Helper.config.reverseProxy) {
		ip = req.connection.remoteAddress;
	} else {
		ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
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

	return fs.readFile("client/index.html", "utf-8", function(err, file) {
		if (err) {
			throw err;
		}

		var data = _.merge(
			pkg,
			Helper.config
		);
		data.gitCommit = Helper.getGitCommit();
		data.themes = fs.readdirSync("client/themes/").filter(function(themeFile) {
			return themeFile.endsWith(".css");
		}).map(function(css) {
			return css.slice(0, -4);
		});
		var template = _.template(file);
		res.setHeader("Content-Security-Policy", "default-src *; connect-src 'self' ws: wss:; style-src * 'unsafe-inline'; script-src 'self'; child-src 'self'; object-src 'none'; form-action 'none'; referrer no-referrer;");
		res.setHeader("Content-Type", "text/html");
		res.writeHead(200);
		res.end(template(data));
	});
}

function init(socket, client) {
	if (!client) {
		socket.emit("auth", {success: true});
		socket.on("auth", auth);
	} else {
		socket.emit("authorized");

		client.ip = getClientIp(socket.request);

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
					if (!Helper.password.compare(old || "", client.config.password)) {
						socket.emit("change-password", {
							error: "The current password field does not match your account password"
						});
						return;
					}

					var hash = Helper.password.hash(p1);

					client.setPassword(hash, function(success) {
						var obj = {};

						if (success) {
							obj.success = "Successfully updated your password, all your other sessions were logged out";
							obj.token = client.config.token;
						} else {
							obj.error = "Failed to update your password";
						}

						socket.emit("change-password", obj);
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
		socket.join(client.id);
		socket.emit("init", {
			active: client.lastActiveChannel,
			networks: client.networks,
			token: client.config.token || null
		});
	}
}

function reverseDnsLookup(socket, client) {
	client.ip = getClientIp(socket.request);

	dns.reverse(client.ip, function(err, host) {
		if (!err && host.length) {
			client.hostname = host[0];
		} else {
			client.hostname = client.ip;
		}

		init(socket, client);
	});
}

function localAuth(client, user, password, callback) {
	if (!client || !password) {
		return callback(false);
	}

	if (!client.config.password) {
		log.error(`User ${colors.bold(user)} with no local password set tried to sign in. (Probably a LDAP user)`);
		return callback(false);
	}

	var result = Helper.password.compare(password, client.config.password);

	if (result && Helper.password.requiresUpdate(client.config.password)) {
		var hash = Helper.password.hash(password);

		client.setPassword(hash, function(success) {
			if (success) {
				log.info(`User ${colors.bold(client.name)} logged in and their hashed password has been updated to match new security requirements`);
			}
		});
	}

	return callback(result);
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

function auth(data) {
	var socket = this;
	var client;
	if (Helper.config.public) {
		client = new Client(manager);
		manager.clients.push(client);
		socket.on("disconnect", function() {
			manager.clients = _.without(manager.clients, client);
			client.quit();
		});
		if (Helper.config.webirc) {
			reverseDnsLookup(socket, client);
		} else {
			init(socket, client);
		}
	} else {
		client = manager.findClient(data.user, data.token);
		var signedIn = data.token && client && data.token === client.config.token;
		var token;

		if (client && (data.remember || data.token)) {
			token = client.config.token;
		}

		var authCallback = function(success) {
			if (success) {
				if (!client) {
					// LDAP just created a user
					manager.loadUser(data.user);
					client = manager.findClient(data.user);
				}
				if (Helper.config.webirc !== null && !client.config.ip) {
					reverseDnsLookup(socket, client);
				} else {
					init(socket, client, token);
				}
			} else {
				socket.emit("auth", {success: success});
			}
		};

		if (signedIn) {
			authCallback(true);
		} else {
			authFunction(client, data.user, data.password, authCallback);
		}
	}
}
