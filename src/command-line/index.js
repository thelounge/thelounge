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

Helper.setHome(program.home || process.env.LOUNGE_HOME);

if (!fs.existsSync(Helper.CONFIG_PATH)) {
	fsextra.ensureDirSync(Helper.HOME);
	try {
		fs.chmodSync(Helper.HOME, "0700");
	} catch (e) {
		log.warn(`Error when changing permissions on ${Helper.HOME} to 0700: ${e}`);
	}
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
