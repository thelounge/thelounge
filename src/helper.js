"use strict";

const pkg = require("../package.json");
const _ = require("lodash");
const log = require("./log");
const path = require("path");
const os = require("os");
const fs = require("fs");
const net = require("net");
const bcrypt = require("bcryptjs");
const colors = require("chalk");
const crypto = require("crypto");

let homePath;
let configPath;
let usersPath;
let storagePath;
let packagesPath;
let fileUploadPath;
let userLogsPath;
let clientCertificatesPath;

const Helper = {
	config: null,
	expandHome,
	getHomePath,
	getPackagesPath,
	getPackageModulePath,
	getStoragePath,
	getConfigPath,
	getFileUploadPath,
	getUsersPath,
	getUserConfigPath,
	getUserLogsPath,
	getClientCertificatesPath,
	setHome,
	getVersion,
	getVersionCacheBust,
	getVersionNumber,
	getGitCommit,
	ip2hex,
	mergeConfig,
	getDefaultNick,
	parseHostmask,
	compareHostmask,
	compareWithWildcard,

	password: {
		hash: passwordHash,
		compare: passwordCompare,
		requiresUpdate: passwordRequiresUpdate,
	},
};

module.exports = Helper;

Helper.config = require(path.resolve(path.join(__dirname, "..", "defaults", "config.js")));

function getVersion() {
	const gitCommit = getGitCommit();
	const version = `v${pkg.version}`;
	return gitCommit ? `source (${gitCommit} / ${version})` : version;
}

function getVersionNumber() {
	return pkg.version;
}

let _gitCommit;

function getGitCommit() {
	if (_gitCommit !== undefined) {
		return _gitCommit;
	}

	if (!fs.existsSync(path.resolve(__dirname, "..", ".git"))) {
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

function getVersionCacheBust() {
	const hash = crypto.createHash("sha256").update(Helper.getVersion()).digest("hex");

	return hash.substring(0, 10);
}

function setHome(newPath) {
	homePath = expandHome(newPath);
	configPath = path.join(homePath, "config.js");
	usersPath = path.join(homePath, "users");
	storagePath = path.join(homePath, "storage");
	fileUploadPath = path.join(homePath, "uploads");
	packagesPath = path.join(homePath, "packages");
	userLogsPath = path.join(homePath, "logs");
	clientCertificatesPath = path.join(homePath, "certificates");

	// Reload config from new home location
	if (fs.existsSync(configPath)) {
		const userConfig = require(configPath);

		if (_.isEmpty(userConfig)) {
			log.warn(
				`The file located at ${colors.green(
					configPath
				)} does not appear to expose anything.`
			);
			log.warn(
				`Make sure it is non-empty and the configuration is exported using ${colors.bold(
					"module.exports = { ... }"
				)}.`
			);
			log.warn("Using default configuration...");
		}

		mergeConfig(this.config, userConfig);
	}

	if (this.config.fileUpload.baseUrl) {
		try {
			new URL("test/file.png", this.config.fileUpload.baseUrl);
		} catch (e) {
			this.config.fileUpload.baseUrl = null;

			log.warn(`The ${colors.bold("fileUpload.baseUrl")} you specified is invalid: ${e}`);
		}
	}

	const manifestPath = path.resolve(
		path.join(__dirname, "..", "public", "thelounge.webmanifest")
	);

	// Check if manifest exists, if not, the app most likely was not built
	if (!fs.existsSync(manifestPath)) {
		log.error(
			`The client application was not built. Run ${colors.bold(
				"NODE_ENV=production yarn build"
			)} to resolve this.`
		);
		process.exit(1);
	}

	// Load theme color from the web manifest
	const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
	this.config.themeColor = manifest.theme_color;

	// log dir probably shouldn't be world accessible.
	// Create it with the desired permission bits if it doesn't exist yet.
	let logsStat = undefined;

	try {
		logsStat = fs.statSync(userLogsPath);
	} catch {
		// ignored on purpose, node v14.17.0 will give us {throwIfNoEntry: false}
	}

	if (!logsStat) {
		try {
			fs.mkdirSync(userLogsPath, {recursive: true, mode: 0o750});
		} catch (e) {
			log.error("Unable to create logs directory", e);
		}
	} else if (logsStat && logsStat.mode & 0o001) {
		log.warn(
			"contents of",
			userLogsPath,
			"can be accessed by any user, the log files may be exposed"
		);

		if (os.platform() !== "win32") {
			log.warn(`run \`chmod o-x ${userLogsPath}\` to correct it`);
		}
	}
}

function getHomePath() {
	return homePath;
}

function getConfigPath() {
	return configPath;
}

function getFileUploadPath() {
	return fileUploadPath;
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

function getClientCertificatesPath() {
	return clientCertificatesPath;
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

	return address
		.split(".")
		.map(function (octet) {
			let hex = parseInt(octet, 10).toString(16);

			if (hex.length === 1) {
				hex = "0" + hex;
			}

			return hex;
		})
		.join("");
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

function getDefaultNick() {
	if (!this.config.defaults.nick) {
		return "thelounge";
	}

	return this.config.defaults.nick.replace(/%/g, () => Math.floor(Math.random() * 10));
}

function mergeConfig(oldConfig, newConfig) {
	for (const key in newConfig) {
		if (!Object.prototype.hasOwnProperty.call(oldConfig, key)) {
			log.warn(`Unknown key "${colors.bold(key)}", please verify your config.`);
		}
	}

	return _.mergeWith(oldConfig, newConfig, (objValue, srcValue, key) => {
		// Do not override config variables if the type is incorrect (e.g. object changed into a string)
		if (
			typeof objValue !== "undefined" &&
			objValue !== null &&
			typeof objValue !== typeof srcValue
		) {
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
	return (
		compareWithWildcard(a.nick, b.nick) &&
		compareWithWildcard(a.ident, b.ident) &&
		compareWithWildcard(a.hostname, b.hostname)
	);
}

function compareWithWildcard(a, b) {
	// we allow '*' and '?' wildcards in our comparison.
	// this is mostly aligned with https://modern.ircdocs.horse/#wildcard-expressions
	// but we do not support the escaping. The ABNF does not seem to be clear as to
	// how to escape the escape char '\', which is valid in a nick,
	// whereas the wildcards tend not to be (as per RFC1459).

	// The "*" wildcard is ".*" in regex, "?" is "."
	// so we tokenize and join with the proper char back together,
	// escaping any other regex modifier
	const wildmany_split = a.split("*").map((sub) => {
		const wildone_split = sub.split("?").map((p) => _.escapeRegExp(p));
		return wildone_split.join(".");
	});
	const user_regex = wildmany_split.join(".*");
	const re = new RegExp(`^${user_regex}$`, "i"); // case insensitive
	return re.test(b);
}
