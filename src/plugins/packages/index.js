"use strict";

const colors = require("chalk");
const path = require("path");
const Helper = require("../../helper");
const themes = require("./themes");
const packageMap = new Map();

const stylesheets = [];

module.exports = {
	getStylesheets,
	getPackage,
	loadPackages,
};

const packageApis = function(packageName) {
	return {
		Stylesheets: {
			addFile: addStylesheet.bind(this, packageName),
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
			packageInfo = require(path.join(Helper.getPackageModulePath(packageName), "package.json"));
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
		}

		if (packageFile.onServerStart) {
			packageFile.onServerStart(packageApis(packageName));
		}

		log.info(`Package ${colors.bold(packageName)} loaded`);
	});
}
