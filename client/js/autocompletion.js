"use strict";

const $ = require("jquery");
const fuzzy = require("fuzzy");
const emojiMap = require("./libs/simplemap.json");
const constants = require("./constants");
require("./libs/jquery/tabcomplete");

const input = $("#input");
const Textcomplete = require("textcomplete/lib/textcomplete").default;
const Textarea = require("textcomplete/lib/textarea").default;
const editor = new Textarea(input.get(0));
let textcomplete;

module.exports = {
	enable: enableAutocomplete,
	disable: () => textcomplete.destroy(false),
};

const chat = $("#chat");
const sidebar = $("#sidebar");
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
	replace([, original]) {
		return original;
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

input
	.tab((word) => completeNicks(word, false), {hint: false})
	.on("autocomplete:on", function() {
		enableAutocomplete();
	});

function enableAutocomplete() {
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
		input.data("autocompleting", true);
	});

	textcomplete.on("hidden", () => {
		input.data("autocompleting", false);
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

function completeNicks(word, isFuzzy) {
	const users = chat.find(".active .users");
	word = word.toLowerCase();

	// Lobbies and private chats do not have an user list
	if (!users.length) {
		return [];
	}

	const words = users.data("nicks");
	if (isFuzzy) {
		return fuzzyGrep(word, words);
	}
	return $.grep(
		words,
		(w) => !w.toLowerCase().indexOf(word)
	);
}

function completeCommands(word) {
	const words = constants.commands.slice();

	return fuzzyGrep(word, words);
}

function completeChans(word) {
	const words = [];

	sidebar.find(".chan")
		.each(function() {
			const self = $(this);
			if (!self.hasClass("lobby")) {
				words.push(self.data("title"));
			}
		});

	return fuzzyGrep(word, words);
}
