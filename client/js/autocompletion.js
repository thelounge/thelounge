"use strict";

const $ = require("jquery");
const fuzzy = require("fuzzy");
const Mousetrap = require("mousetrap");
const {Textcomplete, Textarea} = require("textcomplete");
const emojiMap = require("./libs/simplemap.json");
const constants = require("./constants");
const {vueApp} = require("./vue");

let input;
let textcomplete;
let enabled = false;

module.exports = {
	enable: enableAutocomplete,
	disable() {
		if (enabled) {
			$("#form").off("submit.tabcomplete");
			input.off("input.tabcomplete");
			Mousetrap(input.get(0)).unbind("tab", "keydown");
			textcomplete.destroy();
			enabled = false;
		}
	},
};

const emojiSearchTerms = Object.keys(emojiMap);
const emojiStrategy = {
	id: "emoji",
	match: /\B:([-+\w:?]{2,}):?$/,
	search(term, callback) {
		// Trim colon from the matched term,
		// as we are unable to get a clean string from match regex
		term = term.replace(/:$/, ""),
		callback(fuzzyGrep(term, emojiSearchTerms));
	},
	template([string, original]) {
		return `<span class="emoji">${emojiMap[original]}</span> ${string}`;
	},
	replace([, original]) {
		return emojiMap[original];
	},
	index: 1,
};

const nicksStrategy = {
	id: "nicks",
	match: /\B(@([a-zA-Z_[\]\\^{}|`@][a-zA-Z0-9_[\]\\^{}|`-]*)?)$/,
	search(term, callback) {
		term = term.slice(1);

		if (term[0] === "@") {
			callback(completeNicks(term.slice(1), true)
				.map((val) => ["@" + val[0], "@" + val[1]]));
		} else {
			callback(completeNicks(term, true));
		}
	},
	template([string]) {
		return string;
	},
	replace([, original], position = 1) {
		// If no postfix specified, return autocompleted nick as-is
		if (!vueApp.settings.nickPostfix) {
			return original;
		}

		// If there is whitespace in the input already, append space to nick
		if (position > 0 && /\s/.test($("#input").val())) {
			return original + " ";
		}

		// If nick is first in the input, append specified postfix
		return original + vueApp.settings.nickPostfix;
	},
	index: 1,
};

const chanStrategy = {
	id: "chans",
	match: /\B((#|\+|&|![A-Z0-9]{5})([^\x00\x0A\x0D\x20\x2C\x3A]+(:[^\x00\x0A\x0D\x20\x2C\x3A]*)?)?)$/,
	search(term, callback, match) {
		callback(completeChans(match[0]));
	},
	template([string]) {
		return string;
	},
	replace([, original]) {
		return original;
	},
	index: 1,
};

const commandStrategy = {
	id: "commands",
	match: /^\/(\w*)$/,
	search(term, callback) {
		callback(completeCommands("/" + term));
	},
	template([string]) {
		return string;
	},
	replace([, original]) {
		return original;
	},
	index: 1,
};

const foregroundColorStrategy = {
	id: "foreground-colors",
	match: /\x03(\d{0,2}|[A-Za-z ]{0,10})$/,
	search(term, callback) {
		term = term.toLowerCase();

		const matchingColorCodes = constants.colorCodeMap
			.filter((i) => fuzzy.test(term, i[0]) || fuzzy.test(term, i[1]))
			.map((i) => {
				if (fuzzy.test(term, i[1])) {
					return [i[0], fuzzy.match(term, i[1], {
						pre: "<b>",
						post: "</b>",
					}).rendered];
				}

				return i;
			});

		callback(matchingColorCodes);
	},
	template(value) {
		return `<span class="irc-fg${parseInt(value[0], 10)}">${value[1]}</span>`;
	},
	replace(value) {
		return "\x03" + value[0];
	},
	index: 1,
};

const backgroundColorStrategy = {
	id: "background-colors",
	match: /\x03(\d{2}),(\d{0,2}|[A-Za-z ]{0,10})$/,
	search(term, callback, match) {
		term = term.toLowerCase();
		const matchingColorCodes = constants.colorCodeMap
			.filter((i) => fuzzy.test(term, i[0]) || fuzzy.test(term, i[1]))
			.map((pair) => {
				if (fuzzy.test(term, pair[1])) {
					return [pair[0], fuzzy.match(term, pair[1], {
						pre: "<b>",
						post: "</b>",
					}).rendered];
				}

				return pair;
			})
			.map((pair) => pair.concat(match[1])); // Needed to pass fg color to `template`...

		callback(matchingColorCodes);
	},
	template(value) {
		return `<span class="irc-fg${parseInt(value[2], 10)} irc-bg irc-bg${parseInt(value[0], 10)}">${value[1]}</span>`;
	},
	replace(value) {
		return "\x03$1," + value[0];
	},
	index: 2,
};

function enableAutocomplete(inputRef) {
	enabled = true;
	let autocompleting = false;
	let tabCount = 0;
	let lastMatch = "";
	let currentMatches = [];
	input = $(inputRef);

	input.on("input.tabcomplete", (e) => {
		if (e.detail === "autocomplete") {
			return;
		}

		tabCount = 0;
		currentMatches = [];
		lastMatch = "";
	});

	Mousetrap(input.get(0)).bind("tab", (e) => {
		if (autocompleting) {
			return;
		}

		e.preventDefault();

		const text = input.val();

		if (input.get(0).selectionStart !== text.length) {
			return;
		}

		if (tabCount === 0) {
			lastMatch = text.split(/\s/).pop();

			if (lastMatch.length === 0) {
				return;
			}

			currentMatches = completeNicks(lastMatch, false);

			if (currentMatches.length === 0) {
				return;
			}
		}

		const position = input.get(0).selectionStart - lastMatch.length;
		const newMatch = nicksStrategy.replace([0, currentMatches[tabCount % currentMatches.length]], position);

		input.val(text.substr(0, position) + newMatch);

		// Propagate change to Vue model
		input.get(0).dispatchEvent(new CustomEvent("input", {
			detail: "autocomplete",
		}));

		lastMatch = newMatch;
		tabCount++;
	}, "keydown");

	const editor = new Textarea(input.get(0));
	textcomplete = new Textcomplete(editor, {
		dropdown: {
			className: "textcomplete-menu",
			placement: "top",
		},
	});

	textcomplete.register([
		emojiStrategy,
		nicksStrategy,
		chanStrategy,
		commandStrategy,
		foregroundColorStrategy,
		backgroundColorStrategy,
	]);

	// Activate the first item by default
	// https://github.com/yuku-t/textcomplete/issues/93
	textcomplete.on("rendered", () => {
		if (textcomplete.dropdown.items.length > 0) {
			textcomplete.dropdown.items[0].activate();
		}
	});

	textcomplete.on("show", () => {
		autocompleting = true;
	});

	textcomplete.on("hidden", () => {
		autocompleting = false;
	});

	$("#form").on("submit.tabcomplete", () => {
		textcomplete.hide();
	});
}

function fuzzyGrep(term, array) {
	const results = fuzzy.filter(
		term,
		array,
		{
			pre: "<b>",
			post: "</b>",
		}
	);
	return results.map((el) => [el.string, el.original]);
}

function rawNicks() {
	if (vueApp.activeChannel.channel.users.length > 0) {
		const users = vueApp.activeChannel.channel.users.slice();

		return users.sort((a, b) => b.lastMessage - a.lastMessage).map((u) => u.nick);
	}

	const me = vueApp.activeChannel.network.nick;
	const otherUser = vueApp.activeChannel.channel.name;

	// If this is a query, add their name to autocomplete
	if (me !== otherUser && vueApp.activeChannel.channel.type === "query") {
		return [otherUser, me];
	}

	// Return our own name by default for anything that isn't a channel or query
	return [me];
}

function completeNicks(word, isFuzzy) {
	const users = rawNicks();
	word = word.toLowerCase();

	if (isFuzzy) {
		return fuzzyGrep(word, users);
	}

	return $.grep(
		users,
		(w) => !w.toLowerCase().indexOf(word)
	);
}

function completeCommands(word) {
	const words = constants.commands.slice();

	return fuzzyGrep(word, words);
}

function completeChans(word) {
	const words = [];

	for (const channel of vueApp.activeChannel.network.channels) {
		if (channel.type === "channel") {
			words.push(channel.name);
		}
	}

	return fuzzyGrep(word, words);
}
