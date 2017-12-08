"use strict";

const program = require("commander");
const Helper = require("../helper");

program
	.command("version")
	.description("Output the version number")
	.action(() => {
		console.log(Helper.getVersion()); // eslint-disable-line no-console
	});
