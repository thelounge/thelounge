"use strict";

const crypto = require("crypto");
const {execSync} = require("child_process");
const pkg = require("../package.json");

let _gitCommit;
let _gitCommitFetched = false;

function getGitCommit() {
	if (_gitCommitFetched) {
		return _gitCommit;
	}

	_gitCommitFetched = true;

	try {
		_gitCommit = execSync("git rev-parse --short HEAD", {
			encoding: "utf-8",
			timeout: 2000,
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
	} catch {
		_gitCommit = null;
	}

	return _gitCommit;
}

function getVersion() {
	const gitCommit = getGitCommit();
	const version = `v${pkg.version}`;
	return gitCommit ? `source (${gitCommit} / ${version})` : version;
}

let _cacheBust;

function getVersionCacheBust() {
	if (!_cacheBust) {
		const hash = crypto.createHash("sha256").update(getVersion()).digest("hex");
		_cacheBust = hash.substring(0, 10);
	}

	return _cacheBust;
}

module.exports = {getVersion, getVersionNumber: () => pkg.version, getVersionCacheBust, getGitCommit};
