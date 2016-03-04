var _ = require("lodash");
var bcrypt = require("bcrypt-nodejs");
var Client = require("./client");
var ClientManager = require("./clientManager");
var express = require("express");
var fs = require("fs");
var io = require("socket.io");
var Helper = require("./helper");
var ldap = require("ldapjs");
var config = {};

var manager = new ClientManager();
var ldapclient = null;
var authFunction = localAuth;

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

	if ((config.ldap || {}).enable) {
		ldapclient = ldap.createClient({
			url: config.ldap.url
		});
		authFunction = ldapAuth;
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

	console.log("");
	console.log("The Lounge is now running on " + protocol + "://" + config.host + ":" + config.port + "/");
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

function localAuth(client, user, password, callback) {
	callback(!bcrypt.compareSync(data.password || "", client.config.password));
}

function ldapAuth(client, user, password, callback) {
	var bindDN = config.ldap.primaryKey + '=' + user + ',' + config.ldap.baseDN;

	ldapclient.bind(bindDN, password, function(err) {
		if (!err && !client) {
			if (!manager.addUser(user, null)) {
				console.log("Unable to create new user", user);
			}
		}
		callback(!err);
	});
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
		var client = manager.findClient(data.user, data.token);
		var token;

		if (data.remember || data.token) {
			token = client.token;
		}

		authFunction(client, data.user, data.password, function(success) {
			if (success) {
				if (!client) {
					// LDAP just created a user
					manager.loadUser(data.user);
					client = manager.findClient(data.user);
				}
				init(socket, client, token);
			} else {
				socket.emit("auth");
			}
		});
	}
}
