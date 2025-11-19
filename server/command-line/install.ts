import log from "../log.js";
import colors from "chalk";
import semver from "semver";
import Helper from "../helper.js";
import Config from "../config.js";
import Utils from "./utils.js";
import {Command} from "commander";
import packageJsonImport, {FullMetadata} from "package-json";
import fs from "node:fs";
import fspromises from "node:fs/promises";
import path from "node:path";

type CustomMetadata = FullMetadata & {
	thelounge?: {
		supports?: string;
	};
	version?: string;
};

const program = new Command("install");
program
	.argument(
		"<package>",
		"package to install. Use `file:$path_to_package_dir` to install a local package"
	)
	.description("Install a theme or a package")
	.on("--help", Utils.extraHelp)
	.action(function (packageName: string) {
		if (!fs.existsSync(Config.getConfigPath())) {
			log.error(`${Config.getConfigPath()} does not exist.`);
			return;
		}

		log.info("Retrieving information about the package...");
		// TODO: type
		let readFile: any = null;
		let isLocalFile = false;
		let packageVersion = "latest";

		if (packageName.startsWith("file:")) {
			isLocalFile = true;
			// our yarn invocation sets $HOME to the cachedir, so we must expand ~ now
			// else the path will be invalid when npm expands it.
			packageName = expandTildeInLocalPath(packageName);
			readFile = fspromises
				.readFile(path.join(packageName.substring("file:".length), "package.json"), "utf-8")
				.then((data) => JSON.parse(data) as typeof packageJsonImport);
		} else {
			// properly split scoped and non-scoped npm packages
			// into their name and version
			const atIndex = packageName.indexOf("@", 1);

			if (atIndex !== -1) {
				packageVersion = packageName.slice(atIndex + 1);
				packageName = packageName.slice(0, atIndex);
			}

			readFile = packageJsonImport(packageName, {
				fullMetadata: true,
				version: packageVersion,
			});
		}

		if (!readFile) {
			// no-op, error should've been thrown before this point
			return;
		}

		readFile
			.then((json: CustomMetadata) => {
				const version = json.version || packageVersion;
				const humanVersion = isLocalFile ? packageName : `${json.name} v${version}`;

				if (!json.thelounge) {
					log.error(`${colors.red(humanVersion)} does not have The Lounge metadata.`);

					process.exit(1);
				}

				if (
					json.thelounge.supports &&
					!semver.satisfies(Helper.getVersionNumber(), json.thelounge.supports, {
						includePrerelease: true,
					})
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
				const yarnVersion = isLocalFile ? packageName : `${json.name}@${version}`;
				return Utils.executeYarnCommand("add", "--exact", yarnVersion)
					.then(() => {
						log.info(`${colors.green(humanVersion)} has been successfully installed.`);

						if (isLocalFile) {
							// yarn v1 is buggy if a local filepath is used and doesn't update
							// the lockfile properly. We need to run an install in that case
							// even though that's supposed to be done by the add subcommand
							return Utils.executeYarnCommand("install").catch((err) => {
								throw new Error(
									`Failed to update lockfile after package install ${err}`
								);
							});
						}
					})
					.catch((code) => {
						throw new Error(
							`Failed to install ${colors.red(humanVersion)}. Exit code: ${code}`
						);
					});
			})
			.catch((e) => {
				log.error(`${e}`);
				process.exit(1);
			});
	});

function expandTildeInLocalPath(packageName: string): string {
	const localPath = packageName.substring("file:".length);
	return "file:" + Helper.expandHome(localPath);
}

export default program;
