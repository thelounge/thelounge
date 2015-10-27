var _ = require("lodash");
var bcrypt = require("bcrypt-nodejs");
var Client = require("./client");
var ClientManager = require("./clientManager");
var express = require("express");
var fs = require("fs");
var io = require("socket.io");
var Helper = require("./helper");
var config = {};

var sockets = null;
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
	var transports = config.transports || ["websocket", "polling"];

	if (!https.enable){
		server = require("http");
		server = server.createServer(app).listen(port, host);
	} else {
		server = require("https");
		server = server.createServer({
			key: fs.readFileSync(https.key),
			cert: fs.readFileSync(https.certificate)
		}, app).listen(port, host);
	}

	if ((config.identd || {}).enable) {
		require("./identd").start(config.identd.port);
	}

	sockets = io(server, {
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

	console.log("");
	console.log("Shout is now running on " + protocol + "://" + config.host + ":" + config.port + "/");
	console.log("Press ctrl-c to stop");
	console.log("");

	if (!config.public) {
		manager.loadUsers();
		if (config.autoload) {
			manager.autoload();
		}
	}
};

function index(req, res, next) {
	if (req.url.split("?")[0] !== "/") return next();
	return fs.readFile("client/index.html", "utf-8", function(err, file) {
		var data = _.merge(
			require("../package.json"),
			config
		);
		res.setHeader("Content-Type", "text/html");
		res.writeHead(200);
		res.end(_.template(
			file,
			data
		));
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
		var client = new Client(sockets);
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
