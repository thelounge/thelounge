"use strict";

const pkg = require("../../package.json");
const request = require("request");

module.exports = {
	sendChangelog: handleChangelog,
};

function handleChangelog(callback) {
	const changelog = {
		current: {
			version: `v${pkg.version}`,
		},
	};

	request.get({
		uri: "https://api.github.com/repos/thelounge/lounge/releases",
		headers: {
			Accept: "application/vnd.github.v3.html", // Request rendered markdown
			"User-Agent": pkg.name + "; +" + pkg.repository.git, // Identify the client
		},
	}, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			callback(changelog);

			return;
		}

		let i = 0;
		let release;
		let prerelease = false;

		body = JSON.parse(body);

		for (i = 0; i < body.length; i++) {
			release = body[i];
			if (release.tag_name === changelog.current.version) {
				changelog.current.changelog = release.body_html;
				prerelease = release.prerelease;

				break;
			}
		}

		if (i > 0 && changelog.current) {
			for (i = 0; i < body.length; i++) {
				release = body[i];

				// Find latest release or pre-release if current version is also a pre-release
				if (!release.prerelease || release.prerelease === prerelease) {
					changelog.latest = {
						prerelease: release.prerelease,
						version: release.tag_name,
						url: release.html_url,
					};

					break;
				}
			}
		}

		callback(changelog);
	});
}
