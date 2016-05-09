global.log = require("../log.js");

var program = require("commander");
var pkg = require("../../package.json");
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");
var Helper = require("../helper");

program.version(pkg.version, "-v, --version");
program.option("");
program.option("    --home <path>" , "home path");

var argv = program.parseOptions(process.argv);

Helper.setHome(program.home);

if (!fs.existsSync(Helper.CONFIG_PATH)) {
	mkdirp.sync(Helper.HOME, {mode: "0700"});
	fs.writeFileSync(
		Helper.CONFIG_PATH,
		fs.readFileSync(path.resolve(path.join(
			__dirname,
			"..",
			"..",
			"defaults",
			"config.js"
		)))
	);
	log.info("Config created:", Helper.CONFIG_PATH);
}

require("./start");
require("./config");
require("./list");
require("./add");
require("./remove");
require("./reset");
require("./edit");

program.parse(argv.args);

if (!program.args.length) {
	program.parse(process.argv.concat("start"));
}
