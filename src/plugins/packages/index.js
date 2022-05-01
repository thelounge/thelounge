"use strict";

const _ = require("lodash");
const log = require("../../log");
const colors = require("chalk");
const path = require("path");
const semver = require("semver");
const Helper = require("../../helper");
const Config = require("../../config");
const themes = require("./themes");
const packageMap = new Map();
const inputs = require("../inputs");
const fs = require("fs");
const Utils = require("../../command-line/utils");

const stylesheets = [];
const files = [];

const TIME_TO_LIVE = 15 * 60 * 1000; // 15 minutes, in milliseconds

const cache = {
	outdated: undefined,
};

let experimentalWarningPrinted = false;

module.exports = {
	getFiles,
	getStylesheets,
	getPackage,
	loadPackages,
	outdated,
};

const packageApis = function (packageInfo) {
	return {
		Stylesheets: {
			addFile: addStylesheet.bind(this, packageInfo.packageName),
		},
		PublicFiles: {
			add: addFile.bind(this, packageInfo.packageName),
		},
		Commands: {
			add: inputs.addPluginCommand.bind(this, packageInfo),
			runAsUser: (command, targetId, client) =>
				client.inputLine({target: targetId, text: command}),
		},
		Config: {
			getConfig: () => Config.values,
			getPersistentStorageDir: getPersistentStorageDir.bind(this, packageInfo.packageName),
		},
		Logger: {
			error: (...args) => log.error(`[${packageInfo.packageName}]`, ...args),
			warn: (...args) => log.warn(`[${packageInfo.packageName}]`, ...args),
			info: (...args) => log.info(`[${packageInfo.packageName}]`, ...args),
			debug: (...args) => log.debug(`[${packageInfo.packageName}]`, ...args),
		},
	};
};

function addStylesheet(packageName, filename) {
	stylesheets.push(packageName + "/" + filename);
}

function getStylesheets() {
	return stylesheets;
}

function addFile(packageName, filename) {
	files.push(packageName + "/" + filename);
}

function getFiles() {
	return files.concat(stylesheets);
}

function getPackage(name) {
	return packageMap.get(name);
}

function getEnabledPackages(packageJson) {
	try {
		const json = JSON.parse(fs.readFileSync(packageJson, "utf-8"));
		return Object.keys(json.dependencies);
	} catch (e) {
		log.error(`Failed to read packages/package.json: ${colors.red(e)}`);
	}

	return [];
}

function getPersistentStorageDir(packageName) {
	const dir = path.join(Config.getPackagesPath(), packageName);
	fs.mkdirSync(dir, {recursive: true}); // we don't care if it already exists or not
	return dir;
}

function loadPackage(packageName) {
	let packageInfo;
	let packageFile;

	try {
		const packagePath = Config.getPackageModulePath(packageName);

		packageInfo = JSON.parse(fs.readFileSync(path.join(packagePath, "package.json"), "utf-8"));

		if (!packageInfo.thelounge) {
			throw "'thelounge' is not present in package.json";
		}

		if (
			packageInfo.thelounge.supports &&
			!semver.satisfies(Helper.getVersionNumber(), packageInfo.thelounge.supports, {
				includePrerelease: true, // our pre-releases should respect the semver guarantees
			})
		) {
			throw `v${packageInfo.version} does not support this version of The Lounge. Supports: ${packageInfo.thelounge.supports}`;
		}

		packageFile = require(packagePath);
	} catch (e) {
		log.error(`Package ${colors.bold(packageName)} could not be loaded: ${colors.red(e)}`);
		log.debug(e.stack);
		return;
	}

	const version = packageInfo.version;
	packageInfo = packageInfo.thelounge;
	packageInfo.packageName = packageName;
	packageInfo.version = version;

	packageMap.set(packageName, packageFile);

	if (packageInfo.type === "theme") {
		themes.addTheme(packageName, packageInfo);

		if (packageInfo.files) {
			packageInfo.files.forEach((file) => addFile(packageName, file));
		}
	}

	if (packageFile.onServerStart) {
		packageFile.onServerStart(packageApis(packageInfo));
	}

	log.info(`Package ${colors.bold(packageName)} ${colors.green("v" + version)} loaded`);

	if (packageInfo.type !== "theme" && !experimentalWarningPrinted) {
		experimentalWarningPrinted = true;

		log.info(
			"There are packages using the experimental plugin API. " +
				"Be aware that this API is not yet stable and may change in future The Lounge releases."
		);
	}
}

function loadPackages() {
	const packageJson = path.join(Config.getPackagesPath(), "package.json");
	const packages = getEnabledPackages(packageJson);

	packages.forEach(loadPackage);

	watchPackages(packageJson);
}

function watchPackages(packageJson) {
	fs.watch(
		packageJson,
		{
			persistent: false,
		},
		_.debounce(
			() => {
				const updated = getEnabledPackages(packageJson);

				for (const packageName of updated) {
					if (packageMap.has(packageName)) {
						continue;
					}

					loadPackage(packageName);
				}
			},
			1000,
			{maxWait: 10000}
		)
	);
}

async function outdated(cacheTimeout = TIME_TO_LIVE) {
	if (cache.outdated !== undefined) {
		return cache.outdated;
	}

	// Get paths to the location of packages directory
	const packagesPath = Config.getPackagesPath();
	const packagesConfig = path.join(packagesPath, "package.json");
	const packagesList = JSON.parse(fs.readFileSync(packagesConfig, "utf-8")).dependencies;
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
	if (!Object.entries(packagesList).length) {
		// CLI calls outdated with zero TTL, so we can print the warning there
		if (!cacheTimeout) {
			log.warn("There are no packages installed.");
		}

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
