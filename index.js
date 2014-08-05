#!/usr/bin/env node

process.chdir(__dirname);

var program = require("commander");
var shout = require("./src/server.js");
var version = require("./package.json").version;

program
	.command("start")
	.description("Starts the server.")
	.action(function() {
		shout();
	});

program.parse(process.argv)

if (!program.args.length) {
	program.help();
}
