var _ = require("lodash");
var Client = require("./client");
var config = require("../config.json");
var fs = require("fs");
var http = require("connect");
var io = require("socket.io");

var sockets = null;
var clients = [];

var inputs = [
	"action",
	"connect",
	"invite",
	"join",
	"kick",
	"mode",
	"msg",
	"nick",
	"notice",
	"part",
	"quit",
	"raw",
	"topic",
	"whois"
];

module.exports = function() {
	var port = config.port || 9000;
	var app = http()
		.use(index)
		.use(http.static("client"))
		.listen(port);

	sockets = io(app);
	sockets.on("connect", function(socket) {
		if (config.public) {
			auth.call(socket);
		} else {
			init(socket);
		}
	});

	console.log("Server started");
	console.log("Shout is now running on port " + port);

	if (config.public) {
		return;
	}

	fs.readdir("users/", function(err, files) {
		if (err) {
			console.log(err);
			return;
		}
		_.each(files, function(file) {
			fs.readFile("users/" + file + "/user.json", "utf-8", function(err, json) {
				if (err) {
					console.log(err);
					return;
				}
				try {
					json = JSON.parse(json);
				} catch(e) {
					console.log(e);
					return;
				}
				clients.push(new Client(
					sockets,
					json
				));
			});
		});
	});
};

function index(req, res, next) {
	if (req.url != "/") return next();
	return fs.readFile("client/index.html", "utf-8", function(err, file) {
		var data = _.merge(
			require("../package.json"),
			config
		);
		res.end(_.template(
			file,
			data
		));
	});
}

function init(socket, client) {
	if (!client) {
		socket.emit("auth");
		socket.on("auth", auth);
	} else {
		socket.on(
			"input",
			function(data) {
				input(client, data);
			}
		);
		socket.on(
			"conn",
			function(data) {
				console.log(data);
				client.connect(data);
			}
		);
		socket.join(client.id);
		socket.emit("init", {
			networks: client.networks
		});
	}
}

function auth(data) {
	var socket = this;
	if (config.public) {
		var client = new Client(sockets);
		clients.push(client);
		socket.on("disconnect", function() {
			clients = _.without(clients, client);
			client.quit();
		});
		init(socket, client);
	} else {
		_.each(clients, function(client) {
			if (client.config.name == data.name && client.config.password == data.password) {
				init(socket, client);
			}
		});
	}
}

function input(client, data) {
	var text = data.text;
	if (text.charAt(0) !== "/") {
		text = "/say " + text;
	}

	var args = text.split(" ");
	var cmd = args.shift().replace("/", "").toLowerCase();

	var target = client.find(data.target);
	_.each(inputs, function(plugin) {
		try {
			var path = "./plugins/inputs/" + plugin;
			var fn = require(path);
			fn.apply(client, [
				target.network,
				target.chan,
				cmd,
				args
			]);
		} catch (e) {
			console.log(path + ": " + e);
		}
	});
}
