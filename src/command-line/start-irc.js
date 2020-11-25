"use strict";

const IRC = require("irc-server");
const colors = require("chalk");
const log = require("../log");
const program = require("commander");

program
	.command("start-irc")
	.description("Start an IRC server for development")
	.action(function () {
		const server = IRC.createServer();
		log.info(`Starting server on ${colors.green("localhost:6667")}`);
		server.listen(6667);
	});
