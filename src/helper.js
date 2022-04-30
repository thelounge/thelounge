"use strict";

const pkg = require("../package.json");
const _ = require("lodash");
const path = require("path");
const os = require("os");
const fs = require("fs");
const net = require("net");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Helper = {
	expandHome,
	getVersion,
	getVersionCacheBust,
	getVersionNumber,
	getGitCommit,
	ip2hex,
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
