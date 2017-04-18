"use strict";

const Mousetrap = require("mousetrap");
const $ = require("jquery");
const utils = require("./utils");
const windows = $("#windows");
const sidebar = $("#sidebar, #footer");
const input = $("#input");
const contextMenuContainer = $("#context-menu-container");

Mousetrap.bind([
	"pageup",
	"pagedown"
], function(e, key) {
	let container = windows.find(".window.active");

	// Chat windows scroll message container
	if (container.attr("id") === "chat-container") {
		container = container.find(".chan.active .chat");
	}

	const offset = container.get(0).clientHeight * 0.9;
	let scrollTop = container.scrollTop();

	if (key === "pageup") {
		scrollTop = Math.floor(scrollTop - offset);
	} else {
		scrollTop = Math.ceil(scrollTop + offset);
	}

	container.stop().animate({
		scrollTop: scrollTop
	}, 200);

	return false;
});

Mousetrap.bind([
	"command+up",
	"command+down",
	"ctrl+up",
	"ctrl+down"
], function(e, keys) {
	var channels = sidebar.find(".chan");
	var index = channels.index(channels.filter(".active"));
	var direction = keys.split("+").pop();
	switch (direction) {
	case "up":
		// Loop
		var upTarget = (channels.length + (index - 1 + channels.length)) % channels.length;
		channels.eq(upTarget).click();
		break;

	case "down":
		// Loop
		var downTarget = (channels.length + (index + 1 + channels.length)) % channels.length;
		channels.eq(downTarget).click();
		break;
	}
});

Mousetrap.bind([
	"command+shift+l",
	"ctrl+shift+l"
], function(e) {
	if (e.target === input[0]) {
		utils.clear();
		e.preventDefault();
	}
});

Mousetrap.bind([
	"escape"
], function() {
	contextMenuContainer.hide();
});

var colorsHotkeys = {
	k: "\x03",
	b: "\x02",
	u: "\x1F",
	i: "\x1D",
	o: "\x0F",
};

for (var hotkey in colorsHotkeys) {
	Mousetrap.bind([
		"command+" + hotkey,
		"ctrl+" + hotkey
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
