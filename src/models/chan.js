"use strict";

var _ = require("lodash");
var Helper = require("../helper");
const storage = require("../plugins/storage");

module.exports = Chan;

Chan.Type = {
	CHANNEL: "channel",
	LOBBY: "lobby",
	QUERY: "query",
	SPECIAL: "special",
};

var id = 0;

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
		highlight: false,
		users: []
	});
}

Chan.prototype.destroy = function() {
	this.dereferencePreviews(this.messages);
};

Chan.prototype.pushMessage = function(client, msg, increasesUnread) {
	var obj = {
		chan: this.id,
		msg: msg
	};

	// If this channel is open in any of the clients, do not increase unread counter
	var isOpen = _.includes(client.attachedClients, this.id);

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

	if (Helper.config.maxHistory >= 0 && this.messages.length > Helper.config.maxHistory) {
		const deleted = this.messages.splice(0, this.messages.length - Helper.config.maxHistory);

		// If maxHistory is 0, image would be dereferenced before client had a chance to retrieve it,
		// so for now, just don't implement dereferencing for this edge case.
		if (Helper.config.prefetch && Helper.config.prefetchStorage && Helper.config.maxHistory > 0) {
			this.dereferencePreviews(deleted);
		}
	}

	if (!msg.self && !isOpen) {
		if (!this.firstUnread) {
			this.firstUnread = msg.id;
		}

		if (msg.highlight) {
			this.highlight = true;
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

Chan.prototype.sortUsers = function(irc) {
	var userModeSortPriority = {};
	irc.network.options.PREFIX.forEach((prefix, index) => {
		userModeSortPriority[prefix.symbol] = index;
	});

	userModeSortPriority[""] = 99; // No mode is lowest

	this.users = this.users.sort(function(a, b) {
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
	return _.find(this.users, {nick: nick});
};

Chan.prototype.getMode = function(name) {
	var user = this.findUser(name);
	if (user) {
		return user.mode;
	}

	return "";
};

Chan.prototype.toJSON = function() {
	var clone = _.clone(this);
	clone.users = []; // Do not send user list, the client will explicitly request it when needed
	clone.messages = clone.messages.slice(-100);
	return clone;
};
