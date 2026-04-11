"use strict";

const crypto = require("crypto");
const {execSync} = require("child_process");
const pkg = require("../package.json");

function getGitCommit() {
	try {
		return execSync("git rev-parse --short HEAD", {
			encoding: "utf-8",
			timeout: 2000,
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
	} catch {
		return null;
	}
}

function getVersion() {
	const gitCommit = getGitCommit();
	const version = `v${pkg.version}`;
	return gitCommit ? `source (${gitCommit} / ${version})` : version;
}

function getVersionCacheBust() {
	const hash = crypto.createHash("sha256").update(getVersion()).digest("hex");
	return hash.substring(0, 10);
}

module.exports = {getVersion, getVersionNumber: () => pkg.version, getVersionCacheBust, getGitCommit};
