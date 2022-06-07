import {Command} from "commander";
import Utils from "./utils";
import packageManager from "../plugins/packages";
import log from "../log";

const program = new Command("outdated");
program
	.description("Check for any outdated packages")
	.on("--help", Utils.extraHelp)
	.action(async () => {
		log.info("Checking for outdated packages");

		await packageManager
			.outdated(0)
			.then((outdated) => {
				if (outdated) {
					log.info("There are outdated packages");
				} else {
					log.info("No outdated packages");
				}
			})
			.catch(() => {
				log.error("Error finding outdated packages.");
			});
	});

export default program;
