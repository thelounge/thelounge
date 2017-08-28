"use strict";

const program = require("commander");
const Utils = require("./utils");
const Search = require("../search");
const space = "   ";

program
	.command("search")
	.option("-i, --index", "index all available log files")
	.option("-f, --from <date>", "search after the <date> in the index")
	.option("-t, --to <date>", "search before the <date> in the index")
	.option("-n, --nick <text>", "search for <nick> in the index")
	.option("-q, --text <text>", "search for <text> in the index")
	.option("-u, --user <name>", "restrict search to a user")
	.option("-n, --network <name>", "restrict search to a network")
	.option("-c, --chan <name>", "restrict search to a chan")
	.description("Manage search")
	.on("--help", Utils.extraHelp)
	.action((options) => {
		if (options.index) {
			Search.indexAll();
		} else {
			Search.query(options)
				.then((results) => {
					if (!Array.isArray(results) || results.length === 0) {
						log.warn("No results");
					} else {
						results.forEach((result) => {
							log.info("Search result:", [result.user, result.network, result.chan].join("/"), result.time.format("YYYY-MM-DD"));
							result.before.forEach((before) => {
								log.info(space, before.time.format("HH:mm"),
									[before.user, before.network, before.chan].join("/"),
									"<" + before.from + ">", before.text);
							});
							log.info(space, result.time.format("HH:mm"),
								[result.user, result.network, result.chan].join("/"),
								"<" + result.from + ">", result.text);
							result.after.forEach((after) => {
								log.info(space, after.time.format("HH:mm"),
									[after.user, after.network, after.chan].join("/"),
									"<" + after.from + ">", after.text);
							});
						});
					}
				});
		}
	});
