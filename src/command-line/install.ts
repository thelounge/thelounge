import log from "../log";
import colors from "chalk";
import semver from "semver";
import Helper from "../helper";
import Config from "../config";
import Utils from "./utils";
import {Command} from "commander";

const program = new Command("install");
program
	.usage("install <package>")
	.description("Install a theme or a package")
	.on("--help", Utils.extraHelp)
	.action(async function (packageName) {
		const fs = await import("fs");
		const fspromises = fs.promises;
		const path = await import("path");
		const packageJson = await import("package-json");

		if (!fs.existsSync(Config.getConfigPath())) {
			log.error(`${Config.getConfigPath()} does not exist.`);
			return;
		}

		log.info("Retrieving information about the package...");
		// TODO: type
		let readFile: any = null;
		let isLocalFile = false;

		if (packageName.startsWith("file:")) {
			isLocalFile = true;
			readFile = fspromises
				.readFile(path.join(packageName.substr("file:".length), "package.json"), "utf-8")
				.then((data) => JSON.parse(data));
		} else {
			const split = packageName.split("@");
			packageName = split[0];
			const packageVersion = split[1] || "latest";

			readFile = packageJson.default(packageName, {
				fullMetadata: true,
				version: packageVersion,
			});
		}

		if (!readFile) {
			// no-op, error should've been thrown before this point
			return;
		}

		readFile
			.then((json) => {
				const humanVersion = isLocalFile ? packageName : `${json.name} v${json.version}`;

				if (!("thelounge" in json)) {
					log.error(`${colors.red(humanVersion)} does not have The Lounge metadata.`);

					process.exit(1);
				}

				if (
					json.thelounge.supports &&
					!semver.satisfies(Helper.getVersionNumber(), json.thelounge.supports)
				) {
					log.error(
						`${colors.red(
							humanVersion
						)} does not support The Lounge v${Helper.getVersionNumber()}. Supported version(s): ${
							json.thelounge.supports
						}`
					);

					process.exit(2);
				}

				log.info(`Installing ${colors.green(humanVersion)}...`);
				const yarnVersion = isLocalFile ? packageName : `${json.name}@${json.version}`;
				return Utils.executeYarnCommand("add", "--exact", yarnVersion)
					.then(() => {
						log.info(`${colors.green(humanVersion)} has been successfully installed.`);

						if (isLocalFile) {
							// yarn v1 is buggy if a local filepath is used and doesn't update
							// the lockfile properly. We need to run an install in that case
							// even though that's supposed to be done by the add subcommand
							return Utils.executeYarnCommand("install").catch((err) => {
								throw `Failed to update lockfile after package install ${err}`;
							});
						}
					})
					.catch((code) => {
						throw `Failed to install ${colors.red(humanVersion)}. Exit code: ${code}`;
					});
			})
			.catch((e) => {
				log.error(`${e}`);
				process.exit(1);
			});
	});

export default program;
