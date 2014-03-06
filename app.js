var commander = require("commander")
var listen = require("./lib/server.js").listen;

var argv = commander
	.option("-p, --port <n>", "port to use", parseInt)
	.parse(process.argv);

PORT = 80; // Default port
if (argv.port) {
	PORT = argv.port;
}

listen(PORT);
