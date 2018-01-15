"use strict";

const program = require("commander");
const Utils = require("./utils");
const packageManager = require("../plugins/packageManager");

program
	.command("uninstall <package>")
	.description("Uninstall a theme or a package")
	.on("--help", Utils.extraHelp)
	.action(packageManager.uninstall);
