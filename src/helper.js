"use strict";

const pkg = require("../package.json");
const _ = require("lodash");
const path = require("path");
const os = require("os");
const fs = require("fs");
const net = require("net");
const bcrypt = require("bcryptjs");
const colors = require("chalk");
const moment = require("moment");

let homePath;
let configPath;
let usersPath;
let storagePath;
let packagesPath;
let userLogsPath;

const Helper = {
	config: null,
	expandHome,
	getHomePath,
	getPackagesPath,
	getPackageModulePath,
	getStoragePath,
	getConfigPath,
	getUsersPath,
	getUserConfigPath,
	getUserLogsPath,
	setHome,
	getVersion,
	getGitCommit,
	getHumanDate,
	ip2hex,
	mergeConfig,
	getDefaultNick,
	parseHostmask,
	compareHostmask,

	password: {
		hash: passwordHash,
		compare: passwordCompare,
		requiresUpdate: passwordRequiresUpdate,
	},
};

module.exports = Helper;

Helper.config = require(path.resolve(path.join(
	__dirname,
	"..",
	"defaults",
	"config.js"
)));

function getVersion() {
	const gitCommit = getGitCommit();
	const version = `v${pkg.version}`;
	return gitCommit ? `source (${gitCommit} / ${version})` : version;
}

let _gitCommit;

function getGitCommit() {
	if (_gitCommit !== undefined) {
		return _gitCommit;
	}

	if (!fs.existsSync(path.resolve(__dirname, "..", ".git", "HEAD"))) {
		_gitCommit = null;
		return null;
	}

	try {
		_gitCommit = require("child_process")
			.execSync(
				"git rev-parse --short HEAD", // Returns hash of current commit
				{stdio: ["ignore", "pipe", "ignore"]}
			)
			.toString()
			.trim();
		return _gitCommit;
	} catch (e) {
		// Not a git repository or git is not installed
		_gitCommit = null;
		return null;
	}
}

function setHome(newPath) {
	homePath = expandHome(newPath);
	configPath = path.join(homePath, "config.js");
	usersPath = path.join(homePath, "users");
	storagePath = path.join(homePath, "storage");
	packagesPath = path.join(homePath, "packages");
	userLogsPath = path.join(homePath, "logs");

	// Reload config from new home location
	if (fs.existsSync(configPath)) {
		const userConfig = require(configPath);

		if (_.isEmpty(userConfig)) {
			log.warn(`The file located at ${colors.green(configPath)} does not appear to expose anything.`);
			log.warn(`Make sure it is non-empty and the configuration is exported using ${colors.bold("module.exports = { ... }")}.`);
			log.warn("Using default configuration...");
		}

		mergeConfig(this.config, userConfig);
	}

	if (!this.config.displayNetwork && !this.config.lockNetwork) {
		this.config.lockNetwork = true;

		log.warn(`${colors.bold("displayNetwork")} and ${colors.bold("lockNetwork")} are false, setting ${colors.bold("lockNetwork")} to true.`);
	}

	// Load theme color from manifest.json
	const manifest = require("../public/manifest.json");
	this.config.themeColor = manifest.theme_color;

	// TODO: Remove in future release
	if (["example", "crypto", "zenburn"].includes(this.config.theme)) {
		if (this.config.theme === "example") {
			log.warn(`The default theme ${colors.red("example")} was renamed to ${colors.green("default")} as of The Lounge v3.`);
		} else {
			log.warn(`The theme ${colors.red(this.config.theme)} was moved to a separate theme as of The Lounge v3.`);
			log.warn(`Install it with ${colors.bold("thelounge install thelounge-theme-" + this.config.theme)}.`);
		}

		log.warn(`Falling back to theme ${colors.green("default")} will be removed in a future release.`);
		log.warn("Please update your configuration file accordingly.");

		this.config.theme = "default";
	}
}

function getHomePath() {
	return homePath;
}

function getConfigPath() {
	return configPath;
}

function getUsersPath() {
	return usersPath;
}

function getUserConfigPath(name) {
	return path.join(usersPath, name + ".json");
}

function getUserLogsPath() {
	return userLogsPath;
}

function getStoragePath() {
	return storagePath;
}

function getPackagesPath() {
	return packagesPath;
}

function getPackageModulePath(packageName) {
	return path.join(Helper.getPackagesPath(), "node_modules", packageName);
}

function ip2hex(address) {
	// no ipv6 support
	if (!net.isIPv4(address)) {
		return "00000000";
	}

	return address.split(".").map(function(octet) {
		let hex = parseInt(octet, 10).toString(16);

		if (hex.length === 1) {
			hex = "0" + hex;
		}

		return hex;
	}).join("");
}

// Expand ~ into the current user home dir.
// This does *not* support `~other_user/tmp` => `/home/other_user/tmp`.
function expandHome(shortenedPath) {
	if (!shortenedPath) {
		return "";
	}

	const home = os.homedir().replace("$", "$$$$");
	return path.resolve(shortenedPath.replace(/^~($|\/|\\)/, home + "$1"));
}

function passwordRequiresUpdate(password) {
	return bcrypt.getRounds(password) !== 11;
}

function passwordHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(11));
}

function passwordCompare(password, expected) {
	return bcrypt.compare(password, expected);
}

function getHumanDate() {
	return moment().format("YYYY-MM-DD HH:mm:ss");
}

function getDefaultNick() {
	if (!this.config.defaults.nick) {
		return "thelounge";
	}

	return this.config.defaults.nick.replace(/%/g, () => Math.floor(Math.random() * 10));
}

function mergeConfig(oldConfig, newConfig) {
	return _.mergeWith(oldConfig, newConfig, (objValue, srcValue, key) => {
		// Do not override config variables if the type is incorrect (e.g. object changed into a string)
		if (typeof objValue !== "undefined" && objValue !== null && typeof objValue !== typeof srcValue) {
			log.warn(`Incorrect type for "${colors.bold(key)}", please verify your config.`);

			return objValue;
		}

		// For arrays, simply override the value with user provided one.
		if (_.isArray(objValue)) {
			return srcValue;
		}
	});
}

function parseHostmask(hostmask) {
	let nick = "";
	let ident = "*";
	let hostname = "*";
	let parts = [];

	// Parse hostname first, then parse the rest
	parts = hostmask.split("@");

	if (parts.length >= 2) {
		hostname = parts[1] || "*";
		hostmask = parts[0];
	}

	hostname = hostname.toLowerCase();

	parts = hostmask.split("!");

	if (parts.length >= 2) {
		ident = parts[1] || "*";
		hostmask = parts[0];
	}

	ident = ident.toLowerCase();

	nick = hostmask.toLowerCase() || "*";

	const result = {
		nick: nick,
		ident: ident,
		hostname: hostname,
	};

	return result;
}

function compareHostmask(a, b) {
	return (a.nick.toLowerCase() === b.nick.toLowerCase() || a.nick === "*") && (a.ident.toLowerCase() === b.ident.toLowerCase() || a.ident === "*") && (a.hostname.toLowerCase() === b.hostname.toLowerCase() || a.hostname === "*");
}
