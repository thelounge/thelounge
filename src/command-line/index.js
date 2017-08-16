"use strict";

global.log = require("../log.js");

var program = require("commander");
var colors = require("colors/safe");
var fs = require("fs");
var fsextra = require("fs-extra");
var path = require("path");
var Helper = require("../helper");

program.version(Helper.getVersion(), "-v, --version")
	.option("--home <path>", "path to configuration folder")
	.parseOptions(process.argv);

if (program.home) {
	log.warn(`${colors.green("--home")} is deprecated and will be removed in a future version.`);
	log.warn(`Use ${colors.green("LOUNGE_HOME")} environment variable instead.`);
}

let home = program.home || process.env.LOUNGE_HOME;

if (!home) {
	const distConfig = path.resolve(path.join(
		__dirname,
		"..",
		"..",
		".lounge_config"
	));

	home = fs.readFileSync(distConfig, "utf-8").trim();
}

Helper.setHome(home);

if (!fs.existsSync(Helper.CONFIG_PATH)) {
	fsextra.ensureDirSync(Helper.HOME);
	fs.chmodSync(Helper.HOME, "0700");
	fsextra.copySync(path.resolve(path.join(
		__dirname,
		"..",
		"..",
		"defaults",
		"config.js"
	)), Helper.CONFIG_PATH);
	log.info(`Configuration file created at ${colors.green(Helper.CONFIG_PATH)}.`);
}

fsextra.ensureDirSync(Helper.USERS_PATH);

require("./start");
require("./config");
require("./list");
require("./add");
require("./remove");
require("./reset");
require("./edit");

program.parse(process.argv);

if (!program.args.length) {
	program.help();
}
