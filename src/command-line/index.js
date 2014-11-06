var program = require("commander");
var pkg = require("../../package.json");
var fs = require("fs");
var mkdirp = require("mkdirp");
var Helper = require("../helper");

program.version(pkg.version, "-v, --version");
program.option("");
program.option("    --home <path>" , "home path");

require("./start");
require("./config");
require("./list");
require("./add");
require("./remove");
require("./reset");
require("./edit");

var argv = program.parseOptions(process.argv);
if (program.home) {
	Helper.HOME = program.home;
}

var config = Helper.HOME + "/config.js";
if (!fs.existsSync(config)) {
	mkdirp.sync(Helper.HOME);
	fs.writeFileSync(
		config,
		fs.readFileSync(__dirname + "/../../defaults/config.js")
	);
	console.log("Config created:");
	console.log(config);
}

program.parse(argv.args);

if (!program.args.length) {
	program.parse(process.argv.concat("start"));
}
