"use strict";

const URI = require("urijs");

const commonSchemes = [
	"http", "https",
	"ftp", "sftp",
	"smb", "file",
	"irc", "ircs",
	"svn", "git",
	"steam", "mumble", "ts3server",
	"svn+ssh", "ssh",
];

function findLinks(text) {
	let result = [];
	let lastPosition = 0;

	URI.withinString(text, function(url, start, end) {
		// v-- fix: url was modified and does not match input string -> cant be mapped
		if (text.indexOf(url, lastPosition) < 0) {
			return;
		}
		// ^-- /fix: url was modified and does not match input string -> cant be mapped

		// v-- fix: use prefered scheme
		const parsed = URI(url);
		const parsedScheme = parsed.scheme().toLowerCase();
		const matchedScheme = commonSchemes.find(scheme => parsedScheme.endsWith(scheme));

		if (matchedScheme) {
			const prefix = parsedScheme.length - matchedScheme.length;
			start += prefix;
			url = url.slice(prefix);
		}
		// ^-- /fix: use prefered scheme

		// URL matched, but does not start with a protocol, add it
		if (!parsedScheme.length) {
			url = "http://" + url;
		}

		result.push({
			start: start,
			end: end,
			link: url
		});
	});

	return result;
}

module.exports = findLinks;
