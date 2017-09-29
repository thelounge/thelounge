"use strict";

const fs = require("fs");
const Helper = require("../helper");
const colors = require("colors/safe");
const path = require("path");
const _ = require("lodash");
const themes = new Map();

module.exports = {
	getAll: getAll,
	getFilename: getFilename
};

fs.readdir("client/themes/", (err, builtInThemes) => {
	if (err) {
		return;
	}
	builtInThemes
		.filter((theme) => theme.endsWith(".css"))
		.map(makeLocalThemeObject)
		.forEach((theme) => themes.set(theme.name, theme));
});

fs.readdir(Helper.getPackagesPath(), (err, packages) => {
	if (err) {
		return;
	}
	packages
		.map(makePackageThemeObject)
		.forEach((theme) => {
			if (theme) {
				themes.set(theme.name, theme);
			}
		});
});

function getAll() {
	return _.sortBy(Array.from(themes.values()), "displayName");
}

function getFilename(module) {
	if (themes.has(module)) {
		return themes.get(module).filename;
	}
}

function makeLocalThemeObject(css) {
	const themeName = css.slice(0, -4);
	return {
		displayName: themeName.charAt(0).toUpperCase() + themeName.slice(1),
		filename: path.join(__dirname, "..", "client", "themes", `${themeName}.css`),
		name: themeName
	};
}

function getModuleInfo(packageName) {
	let module;
	try {
		module = require(Helper.getPackageModulePath(packageName));
	} catch (e) {
		log.warn(`Specified theme ${colors.yellow(packageName)} is not installed in packages directory`);
		return;
	}
	if (!module.thelounge) {
		log.warn(`Specified theme ${colors.yellow(packageName)} doesn't have required information.`);
		return;
	}
	return module.thelounge;
}

function makePackageThemeObject(moduleName) {
	const module = getModuleInfo(moduleName);
	if (!module || module.type !== "theme") {
		return;
	}
	const modulePath = Helper.getPackageModulePath(moduleName);
	const displayName = module.name || moduleName;
	const filename = path.join(modulePath, module.css);
	return {
		displayName: displayName,
		filename: filename,
		name: moduleName
	};
}
