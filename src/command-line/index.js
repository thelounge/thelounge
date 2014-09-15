var program = require("commander");
var pkg = require("../../package.json");

program.version(pkg.version, "-v, --version");

require("./start");
require("./config");
require("./list");
require("./add");
require("./remove");
require("./reset");
require("./edit");

program.parse(process.argv);

if (!program.args.length) {
	program.parse(process.argv.concat("start"));
}
