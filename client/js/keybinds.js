"use strict";

const $ = require("jquery");
const Mousetrap = require("mousetrap");
const input = $("#input");
const sidebar = $("#sidebar");
const windows = $("#windows");
const contextMenuContainer = $("#context-menu-container");

Mousetrap.bind([
	"pageup",
	"pagedown",
], function(e, key) {
	let container = windows.find(".window.active");

	// Chat windows scroll message container
	if (container.attr("id") === "chat-container") {
		container = container.find(".chan.active .chat");
	}

	container.finish();

	const offset = container.get(0).clientHeight * 0.9;
	let scrollTop = container.scrollTop();

	if (key === "pageup") {
		scrollTop = Math.floor(scrollTop - offset);
	} else {
		scrollTop = Math.ceil(scrollTop + offset);
	}

	container.animate({
		scrollTop: scrollTop,
	}, 200);

	return false;
});

Mousetrap.bind([
	"command+up",
	"command+down",
	"ctrl+up",
	"ctrl+down",
], function(e, keys) {
	const channels = sidebar.find(".chan");
	const index = channels.index(channels.filter(".active"));
	const direction = keys.split("+").pop();
	let target;

	switch (direction) {
	case "up":
		target = (channels.length + (index - 1 + channels.length)) % channels.length;
		break;

	case "down":
		target = (channels.length + (index + 1 + channels.length)) % channels.length;
		break;
	}

	channels.eq(target).click();
});

Mousetrap.bind([
	"escape",
], function() {
	contextMenuContainer.hide();
});

const colorsHotkeys = {
	k: "\x03",
	b: "\x02",
	u: "\x1F",
	i: "\x1D",
	o: "\x0F",
};

for (const hotkey in colorsHotkeys) {
	Mousetrap.bind([
		"command+" + hotkey,
		"ctrl+" + hotkey,
	], function(e) {
		e.preventDefault();

		const cursorPosStart = input.prop("selectionStart");
		const cursorPosEnd = input.prop("selectionEnd");
		const value = input.val();
		let newValue = value.substring(0, cursorPosStart) + colorsHotkeys[e.key];

		if (cursorPosStart === cursorPosEnd) {
			// If no text is selected, insert at cursor
			newValue += value.substring(cursorPosEnd, value.length);
		} else {
			// If text is selected, insert formatting character at start and the end
			newValue += value.substring(cursorPosStart, cursorPosEnd) + colorsHotkeys[e.key] + value.substring(cursorPosEnd, value.length);
		}

		input
			.val(newValue)
			.get(0).setSelectionRange(cursorPosStart + 1, cursorPosEnd + 1);
	});
}
