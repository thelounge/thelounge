"use strict";

const got = require("got");
const path = require("path");
const fs = require("fs");
//importing the emogi.json 
(async () => {
	const response = await got(
		"https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json"
	);
	const emojiStrategy = JSON.parse(response.body);
	const emojiMap = {};
	const fullNameEmojiMap = {};
// description of emogi 
	for (const emoji of emojiStrategy) {
		fullNameEmojiMap[emoji.emoji] = emoji.description;

		for (const alias of emoji.aliases) {
			emojiMap[alias] = emoji.emoji;
		}
	}

	const emojiMapOutput = JSON.stringify(emojiMap, null, 2) + "\n";
	const fullNameEmojiMapOutput = JSON.stringify(fullNameEmojiMap, null, 2) + "\n";
//syncing the simplemap.json
	fs.writeFileSync(
		path.resolve(path.join(__dirname, "..", "client", "js", "libs", "simplemap.json")),
		emojiMapOutput
	);
//syncing the fullnamemap.json
	fs.writeFileSync(
		path.resolve(path.join(__dirname, "..", "client", "js", "libs", "fullnamemap.json")),
		fullNameEmojiMapOutput
	);
})();
