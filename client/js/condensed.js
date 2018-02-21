"use strict";

const _ = require("lodash");
const constants = require("./constants");
const templates = require("../views");
const t = require("./translate");

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

	_.forOwn(addedTypes, (count, type) => {
		obj[type] += count;
		condensed.data(type, obj[type]);
	});

	const strings = [];
	constants.condensedTypes.forEach((type) => {
		if (obj[type]) {
			const key = `client.condensed.${type}`; // TODO after rebase: add new types to translations
			strings.push(t.translate(key, {count: obj[type]}));
		}
	});

	let text = strings.pop();

	if (strings.length) {
		text = strings.join(", ") + ", and " + text;
	}

	condensed.find(".condensed-summary .content")
		.html(text + templates.msg_condensed_toggle());
}
