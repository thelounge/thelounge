"use strict";

global.log = require("../log.js");

const fs = require("fs");
const path = require("path");
const program = require("commander");
const colors = require("colors/safe");
const Helper = require("../helper");
const Utils = require("./utils");

if (require("semver").lt(process.version, "6.0.0")) {
	log.warn(`Support of Node.js v4 is ${colors.bold("deprecated")} and will be removed in The Lounge v3.`);
	log.warn("Please upgrade to Node.js v6 or more recent.");
}

program.version(Helper.getVersion(), "-v, --version")
	.option("--home <path>", `${colors.bold("[DEPRECATED]")} Use the ${colors.green("THELOUNGE_HOME")} environment variable instead.`)
	.on("--help", Utils.extraHelp)
	.parseOptions(process.argv);

if (program.home) {
	log.warn(`${colors.green("--home")} is ${colors.bold("deprecated")} and will be removed in The Lounge v3.`);
	log.warn(`Use the ${colors.green("THELOUNGE_HOME")} environment variable instead.`);
}

// Check if the app was built before calling setHome as it wants to load manifest.json from the public folder
if (!fs.existsSync(path.join(
	__dirname,
	"..",
	"..",
	"public",
	"manifest.json"
))) {
	log.error(`The client application was not built. Run ${colors.bold("NODE_ENV=production npm run build")} to resolve this.`);
	process.exit(1);
}

if (process.env.LOUNGE_HOME) {
	log.warn(`${colors.green("LOUNGE_HOME")} is ${colors.bold("deprecated")} and will be removed in The Lounge v3.`);
	log.warn(`Use ${colors.green("THELOUNGE_HOME")} instead.`);
}

let home = process.env.THELOUNGE_HOME || program.home || process.env.LOUNGE_HOME;

if (!home) {
	home = Utils.defaultHome();
}

Helper.setHome(home);

require("./start");
require("./config");
require("./users");
require("./install");

// TODO: Remove this when releasing The Lounge v3
if (process.argv[1].endsWith(`${require("path").sep}lounge`)) {
	log.warn(`The ${colors.red("lounge")} CLI is ${colors.bold("deprecated")} and will be removed in v3.`);
	log.warn(`Use ${colors.green("thelounge")} instead.`);
	process.argv[1] = "thelounge";
}

program.parse(process.argv);

if (!program.args.length) {
	program.help();
}
