import log from "../log";
import colors from "chalk";
import fs from "fs";
import path from "path";
import {Command} from "commander";
import Config from "../config";
import Utils from "./utils";

const program = new Command("stop");

// Create a cmd that gracefully disconnects all IRC sessions on the server
program
	.description("Stop the server")
	.on("--help", Utils.extraHelp)
	.action(function () {
		const newLocal = "../server";
		const server = require(newLocal);
		server.stop();
	});

export default program;
