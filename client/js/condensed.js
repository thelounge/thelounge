"use strict";

let templates = {};

module.exports = (conf) => {
	templates = conf.templates || {};
	return {
		updateText,
		strategy: strategy,
		condense: condense
	};
};

function updateText(condensed, msg) {
	const savedMessages = condensed.data("savedMessages") || [];
	savedMessages.push(msg);
	condensed.data("savedMessages", savedMessages);

	const text = condense(savedMessages);

	condensed.find(".condensed-summary .content")
		.html(text + templates.msg_condensed_toggle());
}

const condense = function(messages) {
	let messageList = messages.slice(0); // clone input
	let output = "";
	for (let i = 0, len = strategy.length; i < len; i++) {
		const currentStrategy = strategy[i];
		const parsedData = currentStrategy.parse(messageList);
		messageList = parsedData.saved;
		const text = currentStrategy.template(parsedData);
		if (text.length) {
			output += output === "" ? "" : " | ";
			output += text;
		}
		if (!parsedData.saved.length) {
			break;
		}
	}
	return output;
};

const quitStrategy = {
	type: "quit",
	parse: (messages) => {
		const filtered = [];
		const saved = [];
		const messageList = messages;
		let msg = {};
		while ((msg = messageList.pop()) !== undefined) {
			if (msg.type === "quit") {
				filtered.push(msg);
			} else {
				saved.push(msg);
			}
		}
		return {saved: saved.reverse(), filtered: filtered};
	},
	template: (split) => {
		const list = split.filtered;
		const count = list.length;
		const maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				const last = list.pop();
				text += list.map((n) => templates.user_name({nick: n.from})).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map((n) => templates.user_name({nick: n.from})).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " quit";
		}
		return text;
	},
};

const partStrategy = {
	type: "part",
	parse: (messages) => {
		const filtered = [];
		const saved = [];
		const messageList = messages;
		let msg = {};
		while ((msg = messageList.pop()) !== undefined) {
			if (msg.type === "part") {
				filtered.push(msg);
			} else {
				saved.push(msg);
			}
		}
		return {saved: saved.reverse(), filtered: filtered};
	},
	template: (split) => {
		const list = split.filtered;
		const count = list.length;
		const maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				const last = list.pop();
				text += list.map((n) => templates.user_name({nick: n.from})).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map((n) => templates.user_name({nick: n.from})).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " leaved";
		}
		return text;
	},
};

const joinedStrategy = {
	type: "join",
	parse: (messages) => {
		const filtered = [];
		const saved = [];
		const messageList = messages;
		let msg = {};
		while ((msg = messageList.pop()) !== undefined) {
			if (msg.type === "join") {
				filtered.push(msg);
			} else {
				saved.push(msg);
			}
		}
		return {saved: saved.reverse(), filtered: filtered};
	},
	template: (split) => {
		const list = split.filtered;
		const count = list.length;
		const maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				const last = list.pop();
				text += list.map((n) => templates.user_name({nick: n.from})).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map((n) => templates.user_name({nick: n.from})).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " joined";
		}
		return text;
	},
};

const reconnectStrategy = {
	type: "reconnect",
	parse: (messages) => {
		const messageList = messages;
		const filtered = [];
		const saved = [];
		// run messages in reverse, newest first
		let msg = {};
		while ((msg = messageList.pop()) !== undefined) {
			if (msg.type === "join") {
				// first apperance of join in this user
				// search if there where part or quit messages from that user
				if (messageList.findIndex((m) => (m.from === msg.from && (m.type === "part" || m.type === "quit"))) !== -1) {
					// put join message to filtered list
					filtered.push(msg);
					// find all join, part and quit messages from that user and remove from list
					const removeMessages = messageList.filter((m) => (m.from === msg.from && (m.type === "join" || m.type === "part" || m.type === "quit")));
					removeMessages.forEach((m) => messageList.splice(messageList.findIndex((n) => n === m),1));
				} else {
					// single join from that user, pass trough
					saved.push(msg);
				}
			} else {
				// pass trough other messages
				saved.push(msg);
			}
		}
		return {saved: saved.reverse(), filtered: filtered};
	},
	template: (split) => {
		const list = split.filtered;
		const count = list.length;
		const maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				const last = list.pop();
				text += list.map((n) => templates.user_name({nick: n.from})).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map((n) => templates.user_name({nick: n.from})).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " reconnected";
		}
		return text;
	},
};

const peekinStrategy = {
	type: "peekin",
	parse: (messages) => {
		const messageList = messages;
		const filtered = [];
		const saved = [];
		// run messages in reverse, newest first
		let msg = {};
		while ((msg = messageList.pop()) !== undefined) {
			if (msg.type === "quit" || msg.type === "part") {
				// first apperance of quit/part in this user
				// search if there where join messages from that user
				if (messageList.findIndex((m) => (m.from === msg.from && (m.type === "join"))) !== -1) {
					// put quit/part message to filtered list
					filtered.push(msg);
					// find all join, part and quit messages from that user and remove from list
					const removeMessages = messageList.filter((m) => (m.from === msg.from && (m.type === "join" || m.type === "part" || m.type === "quit")));
					removeMessages.forEach((m) => messageList.splice(messageList.findIndex((n) => n === m),1));
				} else {
					// single quit/part from that user, pass trough
					saved.push(msg);
				}
			} else {
				// pass trough other messages
				saved.push(msg);
			}
		}
		return {saved: saved.reverse(), filtered: filtered};
	},
	template: (split) => {
		const list = split.filtered;
		const count = list.length;
		const maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				const last = list.pop();
				text += list.map((n) => templates.user_name({nick: n.from})).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map((n) => templates.user_name({nick: n.from})).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " peeked in";
		}
		return text;
	},
};

const modeStrategy = {
	type: "mode",
	parse: (messages) => {
		const messageList = messages;
		const filtered = [];
		const saved = [];
		// run messages in reverse, newest first
		let msg = {};
		while ((msg = messageList.pop()) !== undefined) {
			if (msg.type === "mode") {
				filtered.push(msg);
			} else {
				// pass trough other messages
				saved.push(msg);
			}
		}
		return {saved: saved.reverse(), filtered: filtered.reverse()};
	},
	template: (split) => {
		const list = split.filtered;
		const count = list.length;
		const maxnames = 3;
		let text = "";
		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				const last = list.pop();
				text += list.map((n) => templates.user_name({nick: n.from})).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map((n) => templates.user_name({nick: n.from})).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " changed mode";
		}
		return text;
	},
};

const nickStrategy = {
	type: "nick",
	parse: (messages) => {
		const messageList = messages;
		const filtered = [];
		const saved = [];
		// run messages in reverse, newest first
		let msg = {};
		while ((msg = messageList.pop()) !== undefined) {
			if (msg.type === "nick") {
				filtered.push(msg);
			} else {
				// pass trough other messages
				saved.push(msg);
			}
		}
		return {saved: saved.reverse(), filtered: filtered.reverse()};
	},
	template: (split) => {
		const list = split.filtered;
		const count = list.length;
		let text = "";
		if (count) {
			let msg = {};
			while ((msg = list.pop()) !== undefined) {
				text += text === "" ? "" : " | ";
				text += templates.user_name({nick: msg.from}) + " changed name to " + templates.user_name({nick: msg.new_nick});
			}
		}
		return text;
	},
};

const strategy = [nickStrategy, modeStrategy, peekinStrategy, reconnectStrategy, joinedStrategy, partStrategy, quitStrategy];
