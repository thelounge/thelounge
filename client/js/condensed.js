"use strict";

const constants = require("./constants");
const templates = require("../views");

module.exports = {
	updateText
};

function updateText(condensed, addedTypes) {
	var obj = {};

	for (var i in constants.condensedTypes) {
		var msgType = constants.condensedTypes[i];
		obj[msgType] = condensed.data(msgType) || 0;
	}

	for (var k in addedTypes) {
		var added = addedTypes[k];
		obj[added]++;
		condensed.data(added, obj[added]);
	}

	var text = "";

	for (var j in constants.condensedTypes) {
		var messageType = constants.condensedTypes[j];
		if (obj[messageType]) {
			text += text === "" ? "" : ", ";
			text += obj[messageType] + " " + messageType;
			if (messageType === "nick" || messageType === "mode") {
				text += " change";
			}
			text += obj[messageType] > 1 ? "s" : "";
		}
	}
	condensed.find(".condensed-text")
		.html(text + templates.msg_condensed_toggle());
}
