"use strict";

const pkg = require("../../package.json");
const request = require("request");

const TIME_TO_LIVE = 15 * 60 * 1000; // 15 minutes, in milliseconds

module.exports = {
	fetch,
};

const versions = {
	current: {
		version: `v${pkg.version}`,
	},
};

function fetch(callback) {
	// Serving information from cache
	if (versions.current.changelog) {
		callback(versions);
		return;
	}

	request.get({
		uri: "https://api.github.com/repos/thelounge/thelounge/releases",
		headers: {
			"Accept": "application/vnd.github.v3.html", // Request rendered markdown
			"User-Agent": pkg.name + "; +" + pkg.repository.git, // Identify the client
		},
	}, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			callback(versions);
			return;
		}

		let i;
		let release;
		let prerelease = false;

		body = JSON.parse(body);

		// Find the current release among releases on GitHub
		for (i = 0; i < body.length; i++) {
			release = body[i];

			if (release.tag_name === versions.current.version) {
				versions.current.changelog = release.body_html;
				prerelease = release.prerelease;

				break;
			}
		}

		// Find the latest release made after the current one if there is one
		if (i > 0) {
			for (let j = 0; j < i; j++) {
				release = body[j];

				// Find latest release or pre-release if current version is also a pre-release
				if (!release.prerelease || release.prerelease === prerelease) {
					versions.latest = {
						prerelease: release.prerelease,
						version: release.tag_name,
						url: release.html_url,
					};

					break;
				}
			}
		}

		// Add expiration date to the data to send to the client for later refresh
		versions.expiresAt = Date.now() + TIME_TO_LIVE;

		// Emptying cached information after reaching said expiration date
		setTimeout(() => {
			delete versions.current.changelog;
			delete versions.latest;
		}, TIME_TO_LIVE);

		callback(versions);
	});
}
