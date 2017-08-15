"use strict";

const URI = require("urijs");

// Known schemes to detect in a text. If a text contains `foo...bar://foo.com`,
// the parsed scheme should be `foo...bar` but if it contains
// `foo...http://foo.com`, we assume the scheme to extract will be `http`.
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
	const result = [];

	// URI.withinString() identifies URIs within text, e.g. to translate them to
	// <a>-Tags.
	// See https://medialize.github.io/URI.js/docs.html#static-withinString
	// In our case, we store each URI encountered in a result array.
	URI.withinString(text, function(url, start, end) {
		let parsedScheme;

		try {
			// Extract the scheme of the URL detected, if there is one
			parsedScheme = URI(url).scheme().toLowerCase();
		} catch (e) {
			// URI may throw an exception for malfored urls,
			// as to why withinString finds these in the first place is a mystery
			return;
		}

		// Check if the scheme of the detected URL matches a common one above.
		// In a URL like `foo..http://example.com`, the scheme would be `foo..http`,
		// so we need to clean up the end of the scheme and filter out the rest.
		const matchedScheme = commonSchemes.find((scheme) => parsedScheme.endsWith(scheme));

		// A known scheme was found, extract the unknown part from the URL
		if (matchedScheme) {
			const prefix = parsedScheme.length - matchedScheme.length;
			start += prefix;
			url = url.slice(prefix);
		}

		// The URL matched but does not start with a scheme (`www.foo.com`), add it
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
