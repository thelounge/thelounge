"use strict";

const constants = require("./constants");
const templates = require("../views");

module.exports = {
	updateText,
	getStoredTypes,
};

function getStoredTypes(condensed) {
	const obj = {};

	constants.condensedTypes.forEach((type) => {
		obj[type] = condensed.data(type) || 0;
	});

	return obj;
}

function updateText(condensed, addedTypes) {
	const obj = getStoredTypes(condensed);

	Object.keys(addedTypes).map((type) => {
		obj[type] += addedTypes[type];
		condensed.data(type, obj[type]);
	});

	const strings = [];
	constants.condensedTypes.forEach((type) => {
		if (obj[type]) {
			switch (type) {
			case "away":
				strings.push(obj[type] + (obj[type] > 1 ? " users have gone away" : " user has gone away"));
				break;
			case "back":
				strings.push(obj[type] + (obj[type] > 1 ? " users have come back" : " user has come back"));
				break;
			case "chghost":
				strings.push(obj[type] + (obj[type] > 1 ? " users have changed hostname" : " user has changed hostname"));
				break;
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

	condensed.find(".condensed-summary .content")
		.html(text + templates.msg_condensed_toggle());
}
