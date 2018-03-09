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
	const fullNameEmojiMap = {};

	for (const key in emojiStrategy) {
		if (emojiStrategy.hasOwnProperty(key)) {
			const shortname = prepareShortName(emojiStrategy[key].shortname);
			const unicode = stringToUnicode(emojiStrategy[key].unicode_output);
			fullNameEmojiMap[unicode] = emojiStrategy[key].name;

			// Skip tones, at least for now
			if (shortname.includes("tone")) {
				continue;
			}

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

	const emojiMapOutput = JSON.stringify(emojiMap, null, 2) + "\n";
	const fullNameEmojiMapOutput = JSON.stringify(fullNameEmojiMap, null, 2) + "\n";

	fs.writeFileSync(path.resolve(path.join(
		__dirname,
		"..",
		"client",
		"js",
		"libs",
		"simplemap.json"
	)), emojiMapOutput);

	fs.writeFileSync(path.resolve(path.join(
		__dirname,
		"..",
		"client",
		"js",
		"libs",
		"fullnamemap.json"
	)), fullNameEmojiMapOutput);
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
