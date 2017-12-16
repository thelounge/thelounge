"use strict";

const $ = require("jquery");
const fuzzy = require("fuzzy");

const templates = require("../views");

const chat = $("#chat");

chat.on("input", ".users .search", function() {
	const value = $(this).val();
	const parent = $(this).closest(".users");
	const names = parent.find(".names-original");
	const container = parent.find(".names-filtered");

	if (!value.length) {
		container.hide();
		names.show();
		return;
	}

	const fuzzyOptions = {
		pre: "<b>",
		post: "</b>",
		extract: (el) => $(el).text(),
	};

	const result = fuzzy.filter(
		value,
		names.find(".user").toArray(),
		fuzzyOptions
	);

	names.hide();
	container.html(templates.user_filtered({matches: result})).show();
});
