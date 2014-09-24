var _ = require("lodash");
var bcrypt = require("bcrypt");
var Client = require("./client");
var ClientManager = require("./clientManager");
var config = require("../config");
var fs = require("fs");
var http = require("connect");
var io = require("socket.io");
var Helper = require("./helper");

var sockets = null;
var manager = new ClientManager();

module.exports = function(port, host, isPublic) {
	config.port = port;
	config.host = host;
	config.public = isPublic;

	var app = http()
		.use(index)
		.use(http.static("client"))
		.use(http.static(Helper.resolveHomePath("cache")))
		.listen(config.port, config.host);

	sockets = io(app);
	sockets.on("connect", function(socket) {
		if (config.public) {
			auth.call(socket);
		} else {
			init(socket);
		}
	});

	manager.sockets = sockets;

	console.log("");
	console.log("Shout is now running on http://" + config.host + ":" + config.port + "/");
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
	if (req.url != "/") return next();
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
				if (data.token == client.token) {
					success = true;
				}
			} else if (client.config.user == data.user) {
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
			if (!data.token) {
				socket.emit("auth");
			}
		}
	}
}
