"use strict";

const request = require("request");
const path = require("path");
const fs = require("fs");
const fuzzy = require("fuzzy");

request.get({
	url: "https://raw.githubusercontent.com/emojione/emojione/master/emoji_strategy.json",
	json: true,
}, (error, response, emojiStrategy) => {
	const emojiMap = {};

	for (const key in emojiStrategy) {
		if (emojiStrategy.hasOwnProperty(key)) {
			const shortname = prepareShortName(emojiStrategy[key].shortname);

			// Skip tones, at least for now
			if (shortname.indexOf("tone") > -1) {
				continue;
			}

			const unicode = stringToUnicode(key);

			emojiMap[shortname] = unicode;

			for (let alternative of emojiStrategy[key].shortname_alternates) {
				alternative = prepareShortName(alternative);

				if (fuzzy.test(shortname, alternative) || fuzzy.test(alternative, shortname)) {
					continue;
				}

				emojiMap[alternative] = unicode;
			}
		}
	}

	const output = JSON.stringify(emojiMap, null, 2) + "\n";

	fs.writeFileSync(path.resolve(path.join(
		__dirname,
		"..",
		"client",
		"js",
		"libs",
		"simplemap.json"
	)), output);
});

function stringToUnicode(key) {
	return key
		.split("-")
		.map((c) => String.fromCodePoint(`0x${c}`))
		.join("");
}

function prepareShortName(shortname) {
	if (shortname === ":-1:") {
		// We replace dashes, but should keep :-1: working
		return "-1";
	} else if (shortname === ":e-mail:") {
		// :email: exists as an alternative, should figure out how to use it instead
		return "email";
	}

	return shortname
		.slice(1, -1)
		.replace("-", "_");
}
