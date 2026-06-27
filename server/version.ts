import crypto from "crypto";
import {execSync} from "child_process";
import pkg from "../package.json";

let _gitCommit: string | null | undefined;
let _gitCommitFetched = false;

export function getGitCommit(): string | null {
	if (_gitCommitFetched) {
		return _gitCommit ?? null;
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

export function getVersion(): string {
	const gitCommit = getGitCommit();
	const version = `v${pkg.version}`;
	return gitCommit ? `source (${gitCommit} / ${version})` : version;
}

export function getVersionNumber(): string {
	return pkg.version;
}

let _cacheBust: string;

export function getVersionCacheBust(): string {
	if (!_cacheBust) {
		const hash = crypto.createHash("sha256").update(getVersion()).digest("hex");
		_cacheBust = hash.substring(0, 10);
	}

	return _cacheBust;
}
