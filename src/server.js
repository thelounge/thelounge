"use strict";

var _ = require("lodash");
var pkg = require("../package.json");
var bcrypt = require("bcrypt-nodejs");
var Client = require("./client");
var ClientManager = require("./clientManager");
var express = require("express");
var fs = require("fs");
var io = require("socket.io");
var dns = require("dns");
var Helper = require("./helper");
var ldap = require("ldapjs");

var manager = null;
var ldapclient = null;
var authFunction = localAuth;

module.exports = function() {
	manager = new ClientManager();

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
		ldapclient = ldap.createClient({
			url: config.ldap.url
		});
		authFunction = ldapAuth;
	}

	var sockets = io(server, {
		transports: config.transports
	});

	sockets.on("connect", function(socket) {
		if (config.public) {
			auth.call(socket);
		} else {
			init(socket);
		}
	});

	manager.sockets = sockets;

	let protocol = config.https.enable ? "https" : "http";
	let host = config.host || "*";
	log.info("The Lounge", Helper.getVersion(), "is now running");
	log.info(`Available on: ${protocol}://${host}:${config.port}/ in ${config.public ? "public" : "private"} mode`);
	log.info("Press ctrl-c to stop\n");

	if (!config.public) {
		manager.loadUsers();
		if (config.autoload) {
			manager.autoload();
		}
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
		res.setHeader("Content-Security-Policy", "default-src *; connect-src 'self' www.googleapis.com ws: wss:; style-src * 'unsafe-inline'; img-src * data:; script-src * 'unsafe-inline'; child-src 'self' *.soundcloud.com www.googleapis.com www.youtube.com www.vimeo.com; object-src 'none'; form-action 'none'; referrer no-referrer;");
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
					if (!bcrypt.compareSync(old || "", client.config.password)) {
						socket.emit("change-password", {
							error: "The current password field does not match your account password"
						});
						return;
					}

					var salt = bcrypt.genSaltSync(8);
					var hash = bcrypt.hashSync(p1, salt);

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
				client.open(data);
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
			active: client.activeChannel,
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
	var result = false;
	try {
		result = bcrypt.compareSync(password || "", client.config.password);
	} catch (error) {
		if (error === "Not a valid BCrypt hash.") {
			log.error("User (" + user + ") with no local password set tried to sign in. (Probably a LDAP user)");
		}
		result = false;
	} finally {
		callback(result);
	}
}

function ldapAuth(client, user, password, callback) {
	var userDN = user.replace(/([,\\\/#+<>;"= ])/g, "\\$1");
	var bindDN = Helper.config.ldap.primaryKey + "=" + userDN + "," + Helper.config.ldap.baseDN;

	ldapclient.bind(bindDN, password, function(err) {
		if (!err && !client) {
			if (!manager.addUser(user, null)) {
				log.error("Unable to create new user", user);
			}
		}
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
