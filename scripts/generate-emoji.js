"use strict";

const got = require("got");
const path = require("path");
const fs = require("fs");

(async () => {
	const response = await got(
		"https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json"
	);
	const emojiStrategy = JSON.parse(response.body);
	const emojiMap = {};
	const fullNameEmojiMap = {};

	for (const emoji of emojiStrategy) {
		fullNameEmojiMap[emoji.emoji] = emoji.description;

		for (const alias of emoji.aliases) {
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
