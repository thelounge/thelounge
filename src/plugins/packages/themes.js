"use strict";

const fs = require("fs");
const Helper = require("../../helper");
const path = require("path");
const _ = require("lodash");
const themes = new Map();

module.exports = {
	addTheme,
	getAll,
	getByName,
	loadLocalThemes,
};

function loadLocalThemes() {
	const builtInThemes = fs.readdirSync(
		path.join(__dirname, "..", "..", "..", "public", "themes")
	);

	builtInThemes
		.filter((theme) => theme.endsWith(".css"))
		.map(makeLocalThemeObject)
		.forEach((theme) => themes.set(theme.name, theme));
}

function addTheme(packageName, packageObject) {
	const theme = makePackageThemeObject(packageName, packageObject);

	if (theme) {
		themes.set(theme.name, theme);
	}
}

function getAll() {
	const filteredThemes = [];

	for (const theme of themes.values()) {
		filteredThemes.push(_.pick(theme, ["displayName", "name", "themeColor"]));
	}

	return _.sortBy(filteredThemes, "displayName");
}

function getByName(name) {
	return themes.get(name);
}

function makeLocalThemeObject(css) {
	const themeName = css.slice(0, -4);
	return {
		displayName: themeName.charAt(0).toUpperCase() + themeName.slice(1),
		name: themeName,
		themeColor: null,
	};
}

function makePackageThemeObject(moduleName, module) {
	if (!module || module.type !== "theme") {
		return;
	}

	const themeColor = /^#[0-9A-F]{6}$/i.test(module.themeColor) ? module.themeColor : null;
	const modulePath = Helper.getPackageModulePath(moduleName);
	return {
		displayName: module.name || moduleName,
		filename: path.join(modulePath, module.css),
		name: moduleName,
		themeColor: themeColor,
	};
}
