"use strict";

const templates = require("../views");

let quitStrategy = {
	type: "quit",
	split: (messages) => {
		let filtered = [];
		let saved = [];
		let messageList = messages;
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
	template: (split)=>{
		let list = split.filtered;
		let count = list.length;
		let maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				let last = list.pop();
				text += list.map(n => templates.user_name({nick: n.from}).trim()).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map(n => templates.user_name({nick: n.from}).trim()).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " quit";
		}
		return text;
	},
};

let partStrategy = {
	type: "part",
	split: (messages) => {
		let filtered = [];
		let saved = [];
		let messageList = messages;
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
	template: (split)=>{
		let list = split.filtered;
		let count = list.length;
		let maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				let last = list.pop();
				text += list.map(n => templates.user_name({nick: n.from}).trim()).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map(n => templates.user_name({nick: n.from}).trim()).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " leaved";
		}
		return text;
	},
};

let joinedStrategy = {
	type: "join",
	split: (messages) => {
		let filtered = [];
		let saved = [];
		let messageList = messages;
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
	template: (split)=>{
		let list = split.filtered;
		let count = list.length;
		let maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				let last = list.pop();
				text += list.map(n => templates.user_name({nick: n.from}).trim()).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map(n => templates.user_name({nick: n.from}).trim()).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " joined";
		}
		return text;
	},
};

let reconnectStrategy = {
	type: "reconnect",
	split: (messages) => {
		let messageList = messages;
		let filtered = [];
		let saved = [];
		// run messages in reverse, newest first
		let msg = {};
		while ((msg = messageList.pop()) !== undefined) {
			if (msg.type === "join") {
				// first apperance of join in this user
				// search if there where part or quit messages from that user
				if (messageList.findIndex(m => (m.from === msg.from && (m.type === "part" || m.type === "quit"))) !== -1) {
					// put join message to filtered list
					filtered.push(msg);
					// find all join, part and quit messages from that user and remove from list
					let removeMessages = messageList.filter(m => (m.from === msg.from && (m.type === "join" || m.type === "part" || m.type === "quit")));
					removeMessages.forEach(m => messageList.splice(messageList.findIndex(n => n === m),1));
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
	template: (split)=>{
		let list = split.filtered;
		let count = list.length;
		let maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				let last = list.pop();
				text += list.map(n => templates.user_name({nick: n.from}).trim()).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map(n => templates.user_name({nick: n.from}).trim()).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " reconnected";
		}
		return text;
	},
};

let peekinStrategy = {
	type: "peekin",
	split: (messages) => {
		let messageList = messages;
		let filtered = [];
		let saved = [];
		// run messages in reverse, newest first
		let msg = {};
		while ((msg = messageList.pop()) !== undefined) {
			if (msg.type === "quit" || msg.type === "part") {
				// first apperance of quit/part in this user
				// search if there where join messages from that user
				if (messageList.findIndex(m => (m.from === msg.from && (m.type === "join"))) !== -1) {
					// put quit/part message to filtered list
					filtered.push(msg);
					// find all join, part and quit messages from that user and remove from list
					let removeMessages = messageList.filter(m => (m.from === msg.from && (m.type === "join" || m.type === "part" || m.type === "quit")));
					removeMessages.forEach(m => messageList.splice(messageList.findIndex(n => n === m),1));
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
	template: (split)=>{
		let list = split.filtered;
		let count = list.length;
		let maxnames = 3;
		let text = "";

		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				let last = list.pop();
				text += list.map(n => templates.user_name({nick: n.from}).trim()).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map(n => templates.user_name({nick: n.from}).trim()).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " peeked in";
		}
		return text;
	},
};

let modeStrategy = {
	type: "mode",
	split: (messages) => {
		let messageList = messages;
		let filtered = [];
		let saved = [];
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
	template: (split)=>{
		let list = split.filtered;
		let count = list.length;
		let maxnames = 3;
		let text = "";
		if (count) {
			if (count === 1) {
				text += templates.user_name({nick: list[0].from});
			} else if (count > 1 && count <= maxnames) {
				list.reverse();
				let last = list.pop();
				text += list.map(n => templates.user_name({nick: n.from}).trim()).join(", ") + " and " + templates.user_name({nick: last.from});
			} else if (count > maxnames) {
				text += list.map(n => templates.user_name({nick: n.from}).trim()).slice(0,maxnames).join(", ") + " and " + (count - maxnames) + " others";
			}
			text += " changed mode";
		}
		return text;
	},
};

let nickStrategy = {
	type: "nick",
	split: (messages) => {
		let messageList = messages;
		let filtered = [];
		let saved = [];
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
	template: (split)=>{
		let list = split.filtered;
		let count = list.length;
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

let condense = {
	strategy: [nickStrategy, modeStrategy, peekinStrategy, reconnectStrategy, joinedStrategy, partStrategy, quitStrategy],
	condense: function(messages) {
		let messageList = messages.slice(0); // clone input
		let output = "";
		for (let i = 0, len = this.strategy.length; i < len; i++) {
			let currentStrategy = this.strategy[i];
			let splitted = currentStrategy.split(messageList);
			messageList = splitted.saved;
			let text = currentStrategy.template(splitted);
			if (text.length) {
				output += output === "" ? "" : " | ";
				output += text;
			}
			if (!splitted.saved.length) {
				break;
			}
		}
		return output;
	}

};

module.exports = condense;
