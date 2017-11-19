"use strict";

global.log = require("../log.js");

const program = require("commander");
const colors = require("colors/safe");
const Helper = require("../helper");
const Utils = require("./utils");

if (require("semver").lt(process.version, "6.0.0")) {
	log.warn(`Support of Node.js v4 is ${colors.bold("deprecated")} and will be removed in The Lounge v3.`);
	log.warn("Please upgrade to Node.js v6 or more recent.");
}

program.version(Helper.getVersion(), "-v, --version")
	.option("--home <path>", `${colors.bold("[DEPRECATED]")} Use the ${colors.green("LOUNGE_HOME")} environment variable instead.`)
	.on("--help", Utils.extraHelp)
	.parseOptions(process.argv);

if (program.home) {
	log.warn(`${colors.green("--home")} is ${colors.bold("deprecated")} and will be removed in The Lounge v3.`);
	log.warn(`Use the ${colors.green("LOUNGE_HOME")} environment variable instead.`);
}

let home = program.home || process.env.LOUNGE_HOME;

if (!home) {
	home = Utils.defaultLoungeHome();
}

Helper.setHome(home);

require("./start");
require("./config");
require("./list");
require("./add");
require("./remove");
require("./reset");
require("./edit");
require("./install");

program.parse(process.argv);

if (!program.args.length) {
	program.help();
}
