"use strict";

const fs = require("fs");
const colors = require("colors/safe");
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
	fs.readdir(Helper.getPackagesPath(), (err, packages) => {
		if (err) {
			return;
		}
		packages.forEach((packageName) => {
			const packageFile = getModuleInfo(packageName);
			if (!packageFile) {
				return;
			}
			packageMap.set(packageName, packageFile);
			if (packageFile.type === "theme") {
				themes.addTheme(packageName, packageFile);
			}

			if (packageFile.onServerStart) {
				packageFile.onServerStart(packageApis(packageName));
			}
		});
	});
}

function getModuleInfo(packageName) {
	let module;
	try {
		module = require(Helper.getPackageModulePath(packageName));
	} catch (e) {
		log.warn(`Specified package ${colors.yellow(packageName)} is not installed in packages directory`);
		return;
	}
	if (!module.thelounge) {
		log.warn(`Specified package ${colors.yellow(packageName)} doesn't have required information.`);
		return;
	}
	return module.thelounge;
}
