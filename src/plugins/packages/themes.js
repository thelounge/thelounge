"use strict";

const fs = require("fs");
const Helper = require("../../helper");
const path = require("path");
const _ = require("lodash");
const themes = new Map();

module.exports = {
	addTheme,
	getAll,
	getFilename,
	loadLocalThemes,
};

function loadLocalThemes() {
	fs.readdir(path.join(__dirname, "..", "..", "..", "public", "themes"), (err, builtInThemes) => {
		if (err) {
			return;
		}

		builtInThemes
			.filter((theme) => theme.endsWith(".css"))
			.map(makeLocalThemeObject)
			.forEach((theme) => themes.set(theme.name, theme));
	});
}

function addTheme(packageName, packageObject) {
	const theme = makePackageThemeObject(packageName, packageObject);

	if (theme) {
		themes.set(theme.name, theme);
	}
}

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
		name: themeName,
	};
}

function makePackageThemeObject(moduleName, module) {
	if (!module || module.type !== "theme") {
		return;
	}

	const modulePath = Helper.getPackageModulePath(moduleName);
	return {
		displayName: module.name || moduleName,
		filename: path.join(modulePath, module.css),
		name: moduleName,
	};
}
