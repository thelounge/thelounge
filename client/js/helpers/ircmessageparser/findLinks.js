"use strict";

const LinkifyIt = require("linkify-it");

LinkifyIt.prototype.normalize = function normalize(match) {
	if (!match.schema) {
		match.schema = "http:";
		match.url = "http://" + match.url;
		match.noschema = true;
	}

	if (match.schema === "//") {
		match.schema = "http:";
		match.url = "http:" + match.url;
		match.noschema = true;
	}

	if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) {
		match.url = "mailto:" + match.url;
	}
};

const linkify = LinkifyIt().tlds(require("tlds")).tlds("onion", true);

// Known schemes to detect in text
const commonSchemes = [
	"sftp",
	"smb",
	"file",
	"irc",
	"ircs",
	"svn",
	"git",
	"steam",
	"mumble",
	"ts3server",
	"svn+ssh",
	"ssh",
];

for (const schema of commonSchemes) {
	linkify.add(schema + ":", "http:");
}

function findLinks(text) {
	const matches = linkify.match(text);

	if (!matches) {
		return [];
	}

	return matches.map(returnUrl);
}

function findLinksWithSchema(text) {
	const matches = linkify.match(text);

	if (!matches) {
		return [];
	}

	return matches.filter((url) => !url.noschema).map(returnUrl);
}

function returnUrl(url) {
	return {
		start: url.index,
		end: url.lastIndex,
		link: url.url,
	};
}

module.exports = {
	findLinks,
	findLinksWithSchema,
};
