/* eslint-disable @typescript-eslint/no-var-requires */
import log from "../log";
import fs from "fs";
import path from "path";
import colors from "chalk";
import {Command} from "commander";
import Helper from "../helper";
import Config from "../config";
import Utils from "./utils";

const program = new Command("thelounge");
program
	.version(Helper.getVersion(), "-v, --version")
	.option(
		"-c, --config <key=value>",
		"override entries of the configuration file, must be specified for each entry that needs to be overriden",
		Utils.parseConfigOptions
	)
	.on("--help", Utils.extraHelp);

// Parse options from `argv` returning `argv` void of these options.
const argvWithoutOptions = program.parseOptions(process.argv);

Config.setHome(process.env.THELOUNGE_HOME || Utils.defaultHome());

// Check config file owner and warn if we're running under a different user
try {
	verifyFileOwner();
} catch (e: any) {
	// We do not care about failures of these checks
	// fs.statSync will throw if config.js does not exist (e.g. first run)
}

// Create packages/package.json
createPackagesFolder();

// Merge config key-values passed as CLI options into the main config
Config.merge(program.opts().config);

program.addCommand(require("./start").default);
program.addCommand(require("./install").default);
program.addCommand(require("./uninstall").default);
program.addCommand(require("./upgrade").default);
program.addCommand(require("./outdated").default);

if (!Config.values.public) {
	require("./users").default.forEach((command: Command) => {
		if (command) {
			program.addCommand(command);
		}
	});
}

// `parse` expects to be passed `process.argv`, but we need to remove to give it
// a version of `argv` that does not contain options already parsed by
// `parseOptions` above.
// This is done by giving it the updated `argv` that `parseOptions` returned,
// except it returns an object with `operands`/`unknown`, so we need to concat them.
// See https://github.com/tj/commander.js/blob/fefda77f463292/index.js#L686-L763
program.parse(argvWithoutOptions.operands.concat(argvWithoutOptions.unknown));

function createPackagesFolder() {
	const packagesPath = Config.getPackagesPath();
	const packagesConfig = path.join(packagesPath, "package.json");

	// Create node_modules folder, otherwise yarn will start walking upwards to find one
	fs.mkdirSync(path.join(packagesPath, "node_modules"), {recursive: true});

	// Create package.json with private set to true, if it doesn't exist already
	if (!fs.existsSync(packagesConfig)) {
		fs.writeFileSync(
			packagesConfig,
			JSON.stringify(
				{
					private: true,
					description:
						"Packages for The Lounge. Use `thelounge install <package>` command to add a package.",
					dependencies: {},
				},
				null,
				"\t"
			)
		);
	}
}

function verifyFileOwner() {
	if (!process.getuid) {
		return;
	}

	const uid = process.getuid();

	if (uid === 0) {
		log.warn(
			`You are currently running The Lounge as root. ${colors.bold.red(
				"We highly discourage running as root!"
			)}`
		);
	}

	const configStat = fs.statSync(path.join(Config.getHomePath(), "config.js"));

	if (configStat && configStat.uid !== uid) {
		log.warn(
			"Config file owner does not match the user you are currently running The Lounge as."
		);
		log.warn(
			"To prevent any issues, please run thelounge commands " +
				"as the correct user that owns the config folder."
		);
		log.warn(
			"See https://thelounge.chat/docs/usage#using-the-correct-system-user for more information."
		);
	}
}

export default program;
