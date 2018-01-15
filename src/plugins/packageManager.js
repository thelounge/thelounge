"use strict";
const Helper = require("../helper");
const colors = require("colors/safe");
const log = require("../log.js");
const fs = require("fs-extra");
const packageJson = require("package-json");
const npm = require("./npm");
const installFlags = [
	"--production",
	"--no-save",
	"--no-bin-links",
];

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

function passThrough(promise, parameter) {
	return promise.then(() => parameter);
}

function install(packageName) {
	checkConfig()
		.then(() => getPackageJson(packageName))
		.then((json) => getMetadata(json))
		.then((metadata) => passThrough(npm.ensurePackageJsonExists(), metadata))
		.then((metadata) => npm.runNpmCommand("install", {packageName, metadata, args: installFlags}))
		.then(() => log.info(`${colors.green(packageName)} has been successfully installed.`))
		.catch((e) => {
			log.error(`${e}`);
			process.exit(1);
		});
}

function uninstall(packageName) {
	checkConfig()
		.then(() => npm.runNpmCommand("uninstall", {packageName, returnStdOut: true}))
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
