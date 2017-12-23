"use strict";

var _ = require("lodash");
var Helper = require("../helper");
const User = require("./user");
const userLog = require("../userLog");
const storage = require("../plugins/storage");

module.exports = Chan;

Chan.Type = {
	CHANNEL: "channel",
	LOBBY: "lobby",
	QUERY: "query",
	SPECIAL: "special",
};

let id = 1;

function Chan(attr) {
	_.defaults(this, attr, {
		id: id++,
		messages: [],
		name: "",
		key: "",
		topic: "",
		type: Chan.Type.CHANNEL,
		firstUnread: 0,
		unread: 0,
		highlight: 0,
		users: new Map(),
	});
}

Chan.prototype.destroy = function() {
	this.dereferencePreviews(this.messages);
};

Chan.prototype.pushMessage = function(client, msg, increasesUnread) {
	var obj = {
		chan: this.id,
		msg: msg,
	};

	// If this channel is open in any of the clients, do not increase unread counter
	const isOpen = _.find(client.attachedClients, {openChannel: this.id}) !== undefined;

	if ((increasesUnread || msg.highlight) && !isOpen) {
		obj.unread = ++this.unread;
	}

	client.emit("msg", obj);

	// Never store messages in public mode as the session
	// is completely destroyed when the page gets closed
	if (Helper.config.public) {
		return;
	}

	this.messages.push(msg);

	if (client.config.log === true) {
		writeUserLog.call(this, client, msg);
	}

	if (Helper.config.maxHistory >= 0 && this.messages.length > Helper.config.maxHistory) {
		const deleted = this.messages.splice(0, this.messages.length - Helper.config.maxHistory);

		// If maxHistory is 0, image would be dereferenced before client had a chance to retrieve it,
		// so for now, just don't implement dereferencing for this edge case.
		if (Helper.config.prefetch && Helper.config.prefetchStorage && Helper.config.maxHistory > 0) {
			this.dereferencePreviews(deleted);
		}
	}

	if (msg.self) {
		// reset counters/markers when receiving self-/echo-message
		this.firstUnread = 0;
		this.highlight = 0;
	} else if (!isOpen) {
		if (!this.firstUnread) {
			this.firstUnread = msg.id;
		}

		if (msg.highlight) {
			this.highlight++;
		}
	}
};

Chan.prototype.dereferencePreviews = function(messages) {
	messages.forEach((message) => {
		if (message.preview && message.preview.thumb) {
			storage.dereference(message.preview.thumb);
			message.preview.thumb = null;
		}
	});
};

Chan.prototype.getSortedUsers = function(irc) {
	var userModeSortPriority = {};
	irc.network.options.PREFIX.forEach((prefix, index) => {
		userModeSortPriority[prefix.symbol] = index;
	});

	userModeSortPriority[""] = 99; // No mode is lowest

	const users = Array.from(this.users.values());

	return users.sort(function(a, b) {
		if (a.mode === b.mode) {
			return a.nick.toLowerCase() < b.nick.toLowerCase() ? -1 : 1;
		}

		return userModeSortPriority[a.mode] - userModeSortPriority[b.mode];
	});
};

Chan.prototype.findMessage = function(msgId) {
	return this.messages.find((message) => message.id === msgId);
};

Chan.prototype.findUser = function(nick) {
	return this.users.get(nick.toLowerCase());
};

Chan.prototype.getUser = function(nick) {
	return this.findUser(nick) || new User({nick: nick});
};

Chan.prototype.setUser = function(user) {
	this.users.set(user.nick.toLowerCase(), user);
};

Chan.prototype.removeUser = function(user) {
	this.users.delete(user.nick.toLowerCase());
};

/**
 * Get a clean clone of this channel that will be sent to the client.
 * This function performs manual cloning of channel object for
 * better control of performance and memory usage.
 *
 * @param {(int|bool)} lastActiveChannel - Last known active user channel id (needed to control how many messages are sent)
 *                                         If true, channel is assumed active.
 * @param {int} lastMessage - Last message id seen by active client to avoid sending duplicates.
 */
Chan.prototype.getFilteredClone = function(lastActiveChannel, lastMessage) {
	return Object.keys(this).reduce((newChannel, prop) => {
		if (prop === "users") {
			// Do not send users, client requests updated user list whenever needed
			newChannel[prop] = [];
		} else if (prop === "messages") {
			// If client is reconnecting, only send new messages that client has not seen yet
			if (lastMessage > -1) {
				// When reconnecting, always send up to 100 messages to prevent message gaps on the client
				// See https://github.com/thelounge/lounge/issues/1883
				newChannel[prop] = this[prop]
					.filter((m) => m.id > lastMessage)
					.slice(-100);
			} else {
				// If channel is active, send up to 100 last messages, for all others send just 1
				// Client will automatically load more messages whenever needed based on last seen messages
				const messagesToSend = lastActiveChannel === true || this.id === lastActiveChannel ? -100 : -1;

				newChannel[prop] = this[prop].slice(messagesToSend);
			}
		} else {
			newChannel[prop] = this[prop];
		}

		return newChannel;
	}, {});
};

function writeUserLog(client, msg) {
	const target = client.find(this.id);

	if (!target) {
		return false;
	}

	userLog.write(
		client.name,
		target.network.host, // TODO: Fix #1392, multiple connections to same server results in duplicate logs
		this.type === Chan.Type.LOBBY ? target.network.host : this.name,
		msg
	);
}
