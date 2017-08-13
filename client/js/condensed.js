"use strict";

const constants = require("./constants");
const templates = require("../views");

module.exports = {
	updateText
};

function updateText(condensed, addedTypes) {
	const obj = {};

	constants.condensedTypes.forEach((type) => {
		obj[type] = condensed.data(type) || 0;
	});

	addedTypes.forEach((type) => {
		obj[type]++;
		condensed.data(type, obj[type]);
	});

	const strings = [];
	constants.condensedTypes.forEach((type) => {
		if (obj[type]) {
			switch (type) {
			case "join":
				strings.push(obj[type] + (obj[type] > 1 ? " users have joined the channel" : " user has joined the channel"));
				break;
			case "part":
				strings.push(obj[type] + (obj[type] > 1 ? " users have left the channel" : " user has left the channel"));
				break;
			case "quit":
				strings.push(obj[type] + (obj[type] > 1 ? " users have quit" : " user has quit"));
				break;
			case "nick":
				strings.push(obj[type] + (obj[type] > 1 ? " users have changed nick" : " user has changed nick"));
				break;
			case "kick":
				strings.push(obj[type] + (obj[type] > 1 ? " users were kicked" : " user was kicked"));
				break;
			case "mode":
				strings.push(obj[type] + (obj[type] > 1 ? " modes were set" : " mode was set"));
				break;
			}
		}
	});

	let text = strings.pop();
	if (strings.length) {
		text = strings.join(", ") + ", and " + text;
	}

	condensed.find(".condensed-text")
		.html(text + templates.msg_condensed_toggle());
}
