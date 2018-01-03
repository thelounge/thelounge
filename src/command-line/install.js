"use strict";

const program = require("commander");
const Utils = require("./utils");
const packageManager = require("../plugins/packageManager");

program
	.command("install <package>")
	.description("Install a theme or a package")
	.on("--help", Utils.extraHelp)
	.action(packageManager.install);
