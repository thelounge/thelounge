"use strict";

const $ = require("jquery");
const Mousetrap = require("mousetrap");
const wrapCursor = require("undate").wrapCursor;
const utils = require("./utils");
const input = $("#input");
const sidebar = $("#sidebar");
const windows = $("#windows");

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
	const channels = sidebar.find(".chan").not(".network.collapsed :not(.lobby)");
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

	target = channels.eq(target).click();
	utils.scrollIntoViewNicely(target[0]);

	return false;
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

	target = lobbies.eq(target).click();
	utils.scrollIntoViewNicely(target[0]);

	return false;
});

const inputTrap = Mousetrap(input.get(0));

function enableHistory() {
	const history = [""];
	let position = 0;

	input.on("input", () => {
		position = 0;
	});

	inputTrap.bind("enter", function(e) {
		position = 0;
		const input = $(e.target);

		if (input.data("autocompleting")) {
			return false;
		}

		const text = input.val();

		if (text.length === 0) {
			return false;
		}

		// Store new message in history if last message isn't already equal
		if (history[1] !== text) {
			history.splice(1, 0, text);
		}

		return false;
	});

	inputTrap.bind(["up", "down"], function(e, key) {
		if (e.target.selectionStart !== e.target.selectionEnd || input.data("autocompleting")) {
			return;
		}

		if (position === 0) {
			history[position] = input.val();
		}

		if (key === "up") {
			if (position < history.length - 1) {
				position++;
			}
		} else if (position > 0) {
			position--;
		}

		input.val(history[position]);

		return false;
	});
}

enableHistory();

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
	inputTrap.bind("mod+" + hotkey, function(e) {
		// Key is lowercased because keybinds also get processed if caps lock is on
		const modifier = colorsHotkeys[e.key.toLowerCase()];

		wrapCursor(
			e.target,
			modifier,
			e.target.selectionStart === e.target.selectionEnd ? "" : modifier
		);

		return false;
	});
}

// Autocomplete bracket and quote characters like in a modern IDE
// For example, select `text`, press `[` key, and it becomes `[text]`
const bracketWraps = {
	'"': '"',
	"'": "'",
	"(": ")",
	"<": ">",
	"[": "]",
	"{": "}",
	"*": "*",
	"`": "`",
	"~": "~",
	"_": "_",
};

inputTrap.bind(Object.keys(bracketWraps), function(e) {
	if (e.target.selectionStart !== e.target.selectionEnd) {
		wrapCursor(e.target, e.key, bracketWraps[e.key]);

		return false;
	}
});

// Ignored keys which should not automatically focus the input bar
const ignoredKeys = {
	8: true, // Backspace
	9: true, // Tab
	12: true, // Clear
	16: true, // Shift
	17: true, // Control
	18: true, // Alt
	19: true, // Pause
	20: true, // CapsLock
	27: true, // Escape
	33: true, // PageUp
	34: true, // PageDown
	35: true, // End
	36: true, // Home
	37: true, // ArrowLeft
	38: true, // ArrowUp
	39: true, // ArrowRight
	40: true, // ArrowDown
	45: true, // Insert
	46: true, // Delete
	112: true, // F1
	113: true, // F2
	114: true, // F3
	115: true, // F4
	116: true, // F5
	117: true, // F6
	118: true, // F7
	119: true, // F8
	120: true, // F9
	121: true, // F10
	122: true, // F11
	123: true, // F12
	144: true, // NumLock
	145: true, // ScrollLock
	224: true, // Meta
};

$(document).on("keydown", (e) => {
	// Ignore any key that uses alt modifier
	// Ignore keys defined above
	if (e.altKey || ignoredKeys[e.which]) {
		return;
	}

	// Ignore all ctrl keys except for ctrl+v to allow pasting
	if ((e.ctrlKey || e.metaKey) && e.which !== 86) {
		return;
	}

	const tagName = e.target.tagName;

	// Ignore if we're already typing into <input> or <textarea>
	if (tagName === "INPUT" || tagName === "TEXTAREA") {
		return;
	}

	// On enter, focus the input but do not propagate the event
	// This way, a new line is not inserted
	if (e.which === 13) {
		input.trigger("focus");
		return false;
	}

	input.trigger("focus");
});
