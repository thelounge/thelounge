"use strict";

const log = require("../../log");
const colors = require("chalk");
const path = require("path");
const Helper = require("../../helper");
const themes = require("./themes");
const packageMap = new Map();
const inputs = require("../inputs");
const fs = require("fs");
const Utils = require("../../command-line/utils");

const stylesheets = [];

const TIME_TO_LIVE = 15 * 60 * 1000; // 15 minutes, in milliseconds

const cache = {
	outdated: undefined,
};

module.exports = {
	getStylesheets,
	getPackage,
	loadPackages,
	outdated,
};

const packageApis = function(packageName) {
	return {
		Stylesheets: {
			addFile: addStylesheet.bind(this, packageName),
		},
		Commands: {
			add: inputs.addPluginCommand,
			runAsUser: (command, targetId, client) =>
				client.inputLine({target: targetId, text: command}),
		},
		Config: {
			getConfig: () => Helper.config,
		},
	};
};

function addStylesheet(packageName, filename) {
	stylesheets.push(packageName + "/" + filename);
}

function getStylesheets() {
	return stylesheets;
}

function getPackage(name) {
	return packageMap.get(name);
}

function loadPackages() {
	const packageJson = path.join(Helper.getPackagesPath(), "package.json");
	let packages;
	let anyPlugins = false;

	try {
		packages = Object.keys(require(packageJson).dependencies);
	} catch (e) {
		packages = [];
	}

	packages.forEach((packageName) => {
		const errorMsg = `Package ${colors.bold(packageName)} could not be loaded`;
		let packageInfo;
		let packageFile;

		try {
			packageInfo = require(path.join(
				Helper.getPackageModulePath(packageName),
				"package.json"
			));
			packageFile = require(Helper.getPackageModulePath(packageName));
		} catch (e) {
			log.warn(errorMsg);
			return;
		}

		if (!packageInfo.thelounge) {
			log.warn(errorMsg);
			return;
		}

		packageInfo = packageInfo.thelounge;

		packageMap.set(packageName, packageFile);

		if (packageInfo.type === "theme") {
			themes.addTheme(packageName, packageInfo);
		} else {
			anyPlugins = true;
		}

		if (packageFile.onServerStart) {
			packageFile.onServerStart(packageApis(packageName));
		}

		log.info(`Package ${colors.bold(packageName)} loaded`);
	});

	if (anyPlugins) {
		log.info(
			"There are packages using the experimental plugin API. Be aware that this API is not yet stable and may change in future The Lounge releases."
		);
	}
}

async function outdated(cacheTimeout = TIME_TO_LIVE) {
	if (cache.outdated !== undefined) {
		return cache.outdated;
	}

	// Get paths to the location of packages directory
	const packagesPath = Helper.getPackagesPath();
	const packagesConfig = path.join(packagesPath, "package.json");
	const argsList = [
		"outdated",
		"--latest",
		"--json",
		"--production",
		"--ignore-scripts",
		"--non-interactive",
		"--cwd",
		packagesPath,
	];

	// Check if the configuration file exists
	if (!fs.existsSync(packagesConfig)) {
		log.warn("There are no packages installed.");
		return false;
	}

	// If we get an error from calling outdated and the code isn't 0, then there are no outdated packages
	await Utils.executeYarnCommand(...argsList)
		.then(() => updateOutdated(false))
		.catch((code) => updateOutdated(code !== 0));

	if (cacheTimeout > 0) {
		setTimeout(() => {
			delete cache.outdated;
		}, cacheTimeout);
	}

	return cache.outdated;
}

function updateOutdated(outdatedPackages) {
	cache.outdated = outdatedPackages;
}
