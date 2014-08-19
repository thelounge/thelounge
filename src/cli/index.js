var program = require("commander");

require("./start");
require("./config");
require("./list");
require("./add");
require("./remove");

program
	.option("-p, --port <port>")
	.parse(process.argv);

if (!program.args.length) {
	program.parse(process.argv.concat("start"));
}
