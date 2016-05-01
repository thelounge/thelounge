var _ = require("lodash");
var package = require("../package.json");
var bcrypt = require("bcrypt-nodejs");
var Client = require("./client");
var ClientManager = require("./clientManager");
var express = require("express");
var fs = require("fs");
var io = require("socket.io");
var Helper = require("./helper");
var config = {};

var manager = new ClientManager();

module.exports = function(options) {
	config = Helper.getConfig();
	config = _.extend(config, options);

	var app = express()
		.use(index)
		.use(express.static("client"));

	app.enable("trust proxy");

	var server = null;
	var https = config.https || {};
	var protocol = https.enable ? "https" : "http";
	var port = config.port;
	var host = config.host;
	var transports = config.transports || ["polling", "websocket"];

	if (!https.enable) {
		server = require("http");
		server = server.createServer(app).listen(port, host);
	} else {
		server = require("spdy");
		server = server.createServer({
			key: fs.readFileSync(Helper.expandHome(https.key)),
			cert: fs.readFileSync(Helper.expandHome(https.certificate))
		}, app).listen(port, host);
	}

	if ((config.identd || {}).enable) {
		require("./identd").start(config.identd.port);
	}

	var sockets = io(server, {
		transports: transports
	});

	sockets.on("connect", function(socket) {
		if (config.public) {
			auth.call(socket);
		} else {
			init(socket);
		}
	});

	manager.sockets = sockets;

	log.info("The Lounge v" + package.version + " is now running on", protocol + "://" + config.host + ":" + config.port + "/");
	log.info("Press ctrl-c to stop\n");

	if (!require("semver").satisfies(process.version, package.engines.node)) {
		log.warn("The oldest supported Node.js version is ", package.engines.node);
		log.warn("We strongly encourage you to upgrade, see https://nodejs.org/en/download/package-manager/ for more details\n");
	}

	if (!config.public) {
		manager.loadUsers();
		if (config.autoload) {
			manager.autoload();
		}
	}
};

function index(req, res, next) {
	if (req.url.split("?")[0] !== "/") {
		return next();
	}

	return fs.readFile("client/index.html", "utf-8", function(err, file) {
		var data = _.merge(
			package,
			config
		);
		var template = _.template(file);
		res.setHeader("Content-Type", "text/html");
		res.writeHead(200);
		res.end(template(data));
	});
}

function init(socket, client, token) {
	if (!client) {
		socket.emit("auth");
		socket.on("auth", auth);
	} else {
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
				client.connect(data);
			}
		);
		if (!config.public) {
			socket.on(
				"change-password",
				function(data) {
					var old = data.old_password;
					var p1 = data.new_password;
					var p2 = data.verify_password;
					if (typeof old === "undefined" || old === "") {
						socket.emit("change-password", {
							error: "Please enter your current password"
						});
						return;
					}
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
					if (client.setPassword(hash)) {
						socket.emit("change-password", {
							success: "Successfully updated your password"
						});
						return;
					}
					socket.emit("change-password", {
						error: "Failed to update your password"
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
			token: token || ""
		});
	}
}

function auth(data) {
	var socket = this;
	if (config.public) {
		var client = new Client(manager);
		manager.clients.push(client);
		socket.on("disconnect", function() {
			manager.clients = _.without(manager.clients, client);
			client.quit();
		});
		init(socket, client);
	} else {
		var success = false;
		_.each(manager.clients, function(client) {
			if (data.token) {
				if (data.token === client.token) {
					success = true;
				}
			} else if (client.config.user === data.user) {
				if (bcrypt.compareSync(data.password || "", client.config.password)) {
					success = true;
				}
			}
			if (success) {
				var token;
				if (data.remember || data.token) {
					token = client.token;
				}
				init(socket, client, token);
				return false;
			}
		});
		if (!success) {
			socket.emit("auth");
		}
	}
}
