#!/usr/bin/env node

process.chdir(__dirname);

var config = require("./config.json");
var program = require("commander");
var shout = require("./src/server.js");

program
	.option("-p, --port <port>");

program
	.command("start")
	.description("Start the server")
	.action(function() {
		var port = program.port || config.port;
		shout(port);
	});

program.parse(process.argv)

if (!program.args.length) {
	program.help();
}
