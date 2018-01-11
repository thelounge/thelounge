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
const packagesNpmrc = path.join(packagesParent, ".npmrc");

const packageDirJson = {
	private: true,
	description: "Packages for The Lounge. All packages in node_modules directory will be automatically loaded.",
};
const npmrc = {
	save: false,
	"bin-links": false,
	progress: false,
	"package-lock": false,
	production: true,
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

function execNpm(command, packageName, metadata) {
	return new Promise((res, rej) => {
		const npm = child.spawn(
			process.platform === "win32" ? "npm.cmd" : "npm",
			[
				command,
				"--prefix",
				packagesParent,
				packageName,
			],
			{
				// This is the same as `"inherit"` except `process.stdout` is ignored
				stdio: [process.stdin, "ignore", process.stderr],
			}
		);

		npm.on("error", rej);

		npm.on("close", (code) => {
			if (code !== 0) {
				return rej(`Failed to ${command} ${colors.green(`${packageName} " v" + ${metadata.version}`)}. Exit code: ${code}`);
			}
			res();
		});
	});
}

function buildNpmrcString() {
	let string = "";
	Object.keys(npmrc).forEach((key) => string += `${key} = ${npmrc[key]}\n`);
	return string;
}

function runNpmCommand(command, packageName, metadata) {
	log.info(`${command}ing ${colors.green(packageName)}...`);

	return fs.ensureDir(packagesPath) // Create node_modules folder, otherwise npm will start walking upwards to find one
		.then(() => fs.writeJson(packagesConfig, packageDirJson, {spaces: "\t"})) // Create package.json with private set to true to avoid npm warnings
		.then(() => fs.writeFile(packagesNpmrc, buildNpmrcString()))
		.then(execNpm.bind(this, command, packageName, metadata));
}

function install(packageName) {
	checkConfig()
		.then(() => getPackageJson(packageName))
		.then((json) => getMetadata(json))
		.then((metadata) => runNpmCommand("install", packageName, metadata))
		.then(() => log.info(`${colors.green(packageName)} has been successfully installed.`))
		.catch((e) => {
			log.error(`${e}`);
			process.exit(1);
		});
}

function uninstall(packageName) {
	checkConfig()
		.then((metadata) => runNpmCommand("uninstall", packageName, metadata))
		.then(() => log.info(`${colors.green(packageName)} has been successfully uninstalled.`))
		.catch((e) => {
			log.error(`${e}`);
			process.exit(1);
		});
}
