var argv = require("commander")
	.option("-p, --port <n>", "port to use", parseInt)
		.parse(process.argv);

PORT = 80; // Default port.
if (argv.port) {
	PORT = argv.port;
}

// Run the server!
var server = new (require("./lib/server.js"))();
server.listen(PORT);

// Temporary data

var models = require("./client/js/models.js");

var network = new models.Network;
server.networks.push(network);

var channel_1 = new models.Channel;
var channel_2 = new models.Channel;

network.channels.push(channel_1);
network.channels.push(channel_2);

network.nick = "user";
network.address = "irc.freenode.org";

channel_1.name = "irc.freenode.org";
channel_1.type = "network";

channel_2.name = "#chan";

var user_1 = new models.User;
var user_2 = new models.User;

user_1.name = "john";
user_2.name = "jane";

channel_2.users.push(user_1);
channel_2.users.push(user_2);

var message_1 = new models.Message;
var message_2 = new models.Message;

message_1.time = "00:00";
message_1.user = "john";
message_1.text = "Hi!";

message_2.time = "00:00";
message_2.user = "jane";
message_2.text = "Hello!";

channel_2.messages.push(message_1);
channel_2.messages.push(message_2);
