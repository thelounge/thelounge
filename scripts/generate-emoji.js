"use strict";

const got = require("got");
const path = require("path");
const fs = require("fs");

// same regex as found in client/../parse.js
const emojiModifiersRegex = /[\u{1f3fb}-\u{1f3ff}]|\u{fe0f}/gu;

(async () => {
	const response = await got(
		"https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json"
	);
	const emojiStrategy = JSON.parse(response.body);
	const emojiMap = {};
	const fullNameEmojiMap = {};

	for (const emoji of emojiStrategy) {
		const cleanEmoji = emoji.emoji.replace(emojiModifiersRegex, "");
		fullNameEmojiMap[cleanEmoji] = emoji.description;

		for (let alias of emoji.aliases) {
			if (alias !== "-1") {
				// Replace dashes to underscores except for :-1:
				// This removes autocompletion prompt for :-P
				// prompting for :non-potable_water:
				alias = alias.replace(/-/g, "_");
			}

			emojiMap[alias] = emoji.emoji;
		}
	}

	const emojiMapOutput = JSON.stringify(emojiMap, null, 2) + "\n";
	const fullNameEmojiMapOutput = JSON.stringify(fullNameEmojiMap, null, 2) + "\n";

	fs.writeFileSync(
		path.resolve(path.join(__dirname, "..", "client", "js", "helpers", "simplemap.json")),
		emojiMapOutput
	);

	fs.writeFileSync(
		path.resolve(path.join(__dirname, "..", "client", "js", "helpers", "fullnamemap.json")),
		fullNameEmojiMapOutput
	);
})();
