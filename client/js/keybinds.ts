import Mousetrap from "mousetrap";

import {store} from "./store";
import {switchToChannel, router, navigate} from "./router";
import isChannelCollapsed from "./helpers/isChannelCollapsed";
import isIgnoredKeybind from "./helpers/isIgnoredKeybind";
import listenForTwoFingerSwipes from "./helpers/listenForTwoFingerSwipes";
import {ClientChan} from "./types";

// Switch to the next/previous window in the channel list.
Mousetrap.bind(["alt+up", "alt+down"], function (e, keys) {
	if (isIgnoredKeybind(e)) {
		return true;
	}

	navigateWindow(keys.split("+").pop() === "up" ? -1 : 1);

	return false;
});

listenForTwoFingerSwipes(function (cardinalDirection: string) {
	if (cardinalDirection === "e" || cardinalDirection === "w") {
		navigateWindow(cardinalDirection === "e" ? -1 : 1);
	}
});

function navigateWindow(direction: number) {
	if (store.state.networks.length === 0) {
		return;
	}

	const flatChannels: ClientChan[] = [];
	let index = -1;

	for (const network of store.state.networks) {
		for (const channel of network.channels) {
			if (isChannelCollapsed(network, channel)) {
				continue;
			}

			if (index === -1 && store.state.activeChannel?.channel === channel) {
				index = flatChannels.length;
			}

			flatChannels.push(channel);
		}
	}

	// Circular array, and a modulo bug workaround because in JS it stays negative
	const length = flatChannels.length;
	index = (((index + direction) % length) + length) % length;

	jumpToChannel(flatChannels[index]);
}

// Switch to the next/previous lobby in the channel list
Mousetrap.bind(["alt+shift+up", "alt+shift+down"], function (e, keys) {
	if (isIgnoredKeybind(e)) {
		return true;
	}

	const length = store.state.networks.length;

	if (length === 0) {
		return false;
	}

	const direction = keys.split("+").pop() === "up" ? -1 : 1;
	let index = 0;

	// If we're in another window, jump to first lobby
	if (store.state.activeChannel) {
		index = store.state.networks.findIndex((n) => n === store.state.activeChannel?.network);

		// If we're in a channel, and it's not the lobby, jump to lobby of this network when going up
		if (direction !== -1 || store.state.activeChannel?.channel.type === "lobby") {
			index = (((index + direction) % length) + length) % length;
		}
	}

	jumpToChannel(store.state.networks[index].channels[0]);

	return false;
});

// Jump to the first window with a highlight in it, or the first with unread
// activity if there are none with highlights.
Mousetrap.bind(["alt+a"], function (e) {
	if (isIgnoredKeybind(e)) {
		return true;
	}

	let targetChannel;

	outer_loop: for (const network of store.state.networks) {
		for (const chan of network.channels) {
			if (chan.highlight) {
				targetChannel = chan;
				break outer_loop;
			}

			if (chan.unread && !targetChannel) {
				targetChannel = chan;
			}
		}
	}

	if (targetChannel) {
		jumpToChannel(targetChannel);
	}

	return false;
});

// Show the help menu.
Mousetrap.bind(["alt+/"], function (e) {
	if (isIgnoredKeybind(e)) {
		return true;
	}

	/* eslint-disable no-console */
	navigate("Help").catch((err) => console.log(err));
	return false;
});

function jumpToChannel(targetChannel: ClientChan) {
	switchToChannel(targetChannel);

	const element = document.querySelector(
		`#sidebar .channel-list-item[aria-controls="#chan-${targetChannel.id}"]`
	);

	if (element) {
		scrollIntoViewNicely(element);
	}
}

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

document.addEventListener("keydown", (e) => {
	// Allow navigating back to the previous page when on the help screen.
	if (e.key === "Escape" && router.currentRoute.value.name === "Help") {
		router.go(-1);
		return;
	}

	// Ignore any key that uses alt modifier
	// Ignore keys defined above
	if (e.altKey || ignoredKeys[e.which]) {
		return;
	}

	// Ignore all ctrl keys except for ctrl+v to allow pasting
	if ((e.ctrlKey || e.metaKey) && e.which !== 86) {
		return;
	}

	// Redirect pagedown/pageup keys to messages container so it scrolls
	if (e.which === 33 || e.which === 34) {
		const chat = document.querySelector(".window .chat-content .chat");

		if (chat) {
			(chat as HTMLDivElement).focus();
		}

		return;
	}

	const tagName = (e.target as HTMLElement).tagName;

	// Ignore if we're already typing into <input> or <textarea>
	if (tagName === "INPUT" || tagName === "TEXTAREA") {
		return;
	}

	const input = document.getElementById("input");

	if (!input) {
		return;
	}

	input.focus();

	// On enter, focus the input but do not propagate the event
	// This way, a new line is not inserted
	if (e.which === 13) {
		e.preventDefault();
	}
});

function scrollIntoViewNicely(el) {
	// Ideally this would use behavior: "smooth", but that does not consistently work in e.g. Chrome
	// https://github.com/iamdustan/smoothscroll/issues/28#issuecomment-364061459
	el.scrollIntoView({block: "center", inline: "nearest"});
}
