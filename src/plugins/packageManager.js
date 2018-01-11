"use strict";
const Helper = require("../helper");
const colors = require("colors/safe");
const log = require("../log.js");
const fs = require("fs-extra");
const path = require("path");
const child = require("child_process");
const packageJson = require("package-json");
const packagesPath = Helper.getPackagesPath();
const packagesParent = path.dirname(packagesPath);
const packagesConfig = path.join(packagesParent, "package.json");
const packagesNpmrc = path.join(__dirname, "..", "..", "defaults", "npmrc");

const packageDirJson = {
	private: true,
	description: "Packages for The Lounge. All packages in node_modules directory will be automatically loaded.",
};

module.exports = {
	install,
	uninstall,
};

function checkConfig() {
	return fs.access(Helper.getConfigPath(), fs.constants.R_OK | fs.constants.W_OK)
		.catch(() => Promise.reject(`${Helper.getConfigPath()} does not exist or is not readable.`));
}

function getPackageJson(packageName) {
	log.info("Retrieving information about the package...");
	return packageJson(packageName, {
		fullMetadata: true,
	});
}

function getMetadata(json) {
	if (!("thelounge" in json)) {
		return Promise.reject(`${colors.red(json.name)} does not have The Lounge metadata.`);
	}
	const metadata = json.thelounge;
	metadata.version = json.version;
	return metadata;
}

function runNpmCommand(command, {packageName = "", returnStdOut = false, metadata = {}}) {
	log.info(`${command}ing ${colors.green(packageName)}...`);
	return new Promise((res, rej) => {
		let output = "";
		const npm = child.spawn(
			process.platform === "win32" ? "npm.cmd" : "npm",
			[
				command,
				"--userconfig",
				packagesNpmrc,
				"--prefix",
				packagesParent,
				packageName,
			],
			{
				// This is the same as `"inherit"` except `process.stdout` is ignored
				stdio: [process.stdin, returnStdOut ? "pipe" : "ignore", process.stderr],
			}
		);

		if (returnStdOut) {
			npm.stdout.on("data", (data) => {
				output += data;
			});
		}

		npm.on("error", rej);

		npm.on("close", (code) => {
			if (code !== 0) {
				return rej(`Failed to ${command} ${colors.green(`${packageName} " v" + ${metadata.version}`)}. Exit code: ${code}`);
			}
			res(output);
		});
	});
}

function ensurePackageJsonExists() {
	return fs.ensureDir(packagesPath) // Create node_modules folder, otherwise npm will start walking upwards to find one
		.then(() => fs.writeJson(packagesConfig, packageDirJson, {spaces: "\t"})); // Create package.json to avoid npm warnings
}

function install(packageName) {
	checkConfig()
		.then(() => getPackageJson(packageName))
		.then((json) => getMetadata(json))
		.then((metadata) => {
			ensurePackageJsonExists();
			return metadata;
		})
		.then((metadata) => runNpmCommand("install", {packageName, metadata}))
		.then(() => log.info(`${colors.green(packageName)} has been successfully installed.`))
		.catch((e) => {
			log.error(`${e}`);
			process.exit(1);
		});
}

function uninstall(packageName) {
	checkConfig()
		.then(() => runNpmCommand("uninstall", {packageName, returnStdOut: true}))
		.then((data) => {
			if (data.includes("removed")) {
				log.info(`${colors.green(packageName)} has been successfully uninstalled.`);
			} else {
				log.error(`Can't uninstall ${colors.green(packageName)} as it wasn't installed.`);
				process.exit(1);
			}
		})
		.catch((e) => {
			log.error(`${e}`);
			process.exit(1);
		});
}
