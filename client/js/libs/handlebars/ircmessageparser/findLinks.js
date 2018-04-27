"use strict";

const linkify = require("linkify-it")()
	.tlds(require("tlds"))
	.tlds("onion", true);

// Known schemes to detect in text
const commonSchemes = [
	"sftp",
	"smb", "file",
	"irc", "ircs",
	"svn", "git",
	"steam", "mumble", "ts3server",
	"svn+ssh", "ssh",
];

for (const schema of commonSchemes) {
	linkify.add(schema + ":", "http:");
}

function findLinks(text) {
	const matches = linkify.match(text);

	if (!matches) {
		return [];
	}

	return matches.map((url) => {
		// Prefix protocol to protocol-aware urls
		if (url.schema === "//") {
			url.url = `http:${url.url}`;
		}

		return {
			start: url.index,
			end: url.lastIndex,
			link: url.url,
		};
	});
}

module.exports = findLinks;
