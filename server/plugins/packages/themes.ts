import fs from "fs";
import path from "path";
import _ from "lodash";

import Config from "../../config";
import Utils from "../../command-line/utils";

type Module = {
	type?: string;
	name?: string;
};

type ThemeModule = Module & {
	type: "theme";
	themeColor: string;
	css: string;
};

export type ThemeForClient = {
	displayName: string;
	filename?: string;
	name: string;
	themeColor: string | null;
};

const themes = new Map<string, ThemeForClient>();

export default {
	addTheme,
	getAll,
	getByName,
	loadLocalThemes,
};

function loadLocalThemes() {
	const builtInThemes = fs.readdirSync(Utils.getFileFromRelativeToRoot("public", "themes"));

	builtInThemes
		.filter((theme) => theme.endsWith(".css"))
		.map(makeLocalThemeObject)
		.forEach((theme) => themes.set(theme.name, theme));
}

function addTheme(packageName: string, packageObject: ThemeModule) {
	const theme = makePackageThemeObject(packageName, packageObject);

	if (theme) {
		themes.set(theme.name, theme);
	}
}

function getAll() {
	const filteredThemes: ThemeForClient[] = [];

	for (const theme of themes.values()) {
		filteredThemes.push(_.pick(theme, ["displayName", "name", "themeColor"]));
	}

	return _.sortBy(filteredThemes, "displayName");
}

function getByName(name: string) {
	return themes.get(name);
}

function makeLocalThemeObject(css: string) {
	const themeName = css.slice(0, -4);
	return {
		displayName: themeName.charAt(0).toUpperCase() + themeName.slice(1),
		name: themeName,
		themeColor: null,
	};
}

function makePackageThemeObject(
	moduleName: string,
	module: ThemeModule
): ThemeForClient | undefined {
	if (!module || module.type !== "theme") {
		return;
	}

	const themeColor = /^#[0-9A-F]{6}$/i.test(module.themeColor) ? module.themeColor : null;
	const modulePath = Config.getPackageModulePath(moduleName);
	return {
		displayName: module.name || moduleName,
		filename: path.join(modulePath, module.css),
		name: moduleName,
		themeColor: themeColor,
	};
}
