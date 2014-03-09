var argv = require("commander")
	.option("-p, --port <n>", "port to use", parseInt)
	.parse(process.argv);

PORT = 80; // Default port
if (argv.port) {
	PORT = argv.port;
}

var server =
	new (require("./lib/server.js"))()
		.listen(PORT);

// Temp
/*

var models = require("./lib/models.js");
var network = new models.Network({host: "irc.network.org"});

server.networks.add(network);
network.get("channels").add(new models.Channel({
	name: "#foo",
	messages: [
		new models.Message({user: "user", text: "Hi!"}),
		new models.Message({user: "user", text: ".. Hello?"}),
	],
	users: [
		new models.User({name: "user"}),
		new models.User({name: "other_user"}),
	]:
}));
*/
