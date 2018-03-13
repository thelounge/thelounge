"use strict";

const $ = require("jquery");
const Mousetrap = require("mousetrap");
const wrapCursor = require("undate").wrapCursor;
const input = $("#input").get(0);
const sidebar = $("#sidebar");
const windows = $("#windows");
const contextMenuContainer = $("#context-menu-container");

Mousetrap.bind([
	"pageup",
	"pagedown",
], function(e, key) {
	let container = windows.find(".window.active");

	// Chat windows scroll message container
	if (container.prop("id") === "chat-container") {
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

	container.animate({scrollTop}, 200);

	return false;
});

Mousetrap.bind([
	"alt+up",
	"alt+down",
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
	"alt+shift+up",
	"alt+shift+down",
], function(e, keys) {
	const lobbies = sidebar.find(".lobby");
	const direction = keys.split("+").pop();
	let index = lobbies.index(lobbies.filter(".active"));
	let target;

	switch (direction) {
	case "up":
		if (index < 0) {
			target = lobbies.index(sidebar.find(".channel").filter(".active").siblings(".lobby")[0]);
		} else {
			target = (lobbies.length + (index - 1 + lobbies.length)) % lobbies.length;
		}

		break;

	case "down":
		if (index < 0) {
			index = lobbies.index(sidebar.find(".channel").filter(".active").siblings(".lobby")[0]);
		}

		target = (lobbies.length + (index + 1 + lobbies.length)) % lobbies.length;

		break;
	}

	lobbies.eq(target).click();
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
	s: "\x1e",
	m: "\x11",
};

for (const hotkey in colorsHotkeys) {
	Mousetrap.bind("mod+" + hotkey, function(e) {
		// Do not handle modifier hotkeys if input is not focused
		if (document.activeElement !== input[0]) {
			return;
		}

		e.preventDefault();

		const modifier = colorsHotkeys[e.key];

		wrapCursor(input, modifier, input.selectionStart === input.selectionEnd ? "" : modifier);
	});
}
