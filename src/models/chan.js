var _ = require("lodash");
var Helper = require("../helper");

module.exports = Chan;

Chan.Type = {
	CHANNEL: "channel",
	LOBBY: "lobby",
	QUERY: "query",
	SPECIAL: "special",
};

var id = 0;

function Chan(attr) {
	_.merge(this, _.extend({
		id: id++,
		messages: [],
		name: "",
		topic: "",
		type: Chan.Type.CHANNEL,
		firstUnread: 0,
		unread: 0,
		highlight: false,
		users: []
	}, attr));
}

Chan.prototype.pushMessage = function(client, msg) {
	client.emit("msg", {
		chan: this.id,
		msg: msg
	});

	// Never store messages in public mode as the session
	// is completely destroyed when the page gets closed
	if (Helper.config.public) {
		return;
	}

	this.messages.push(msg);

	if (Helper.config.maxHistory >= 0 && this.messages.length > Helper.config.maxHistory) {
		this.messages.splice(0, this.messages.length - Helper.config.maxHistory);
	}

	if (!msg.self && this.id !== client.activeChannel) {
		if (!this.firstUnread) {
			this.firstUnread = msg.id;
		}

		if (msg.highlight) {
			this.highlight = true;
		}
	}
};

Chan.prototype.sortUsers = function(irc) {
	var userModeSortPriority = {};
	irc.network.options.PREFIX.forEach(function(prefix, index) {
		userModeSortPriority[prefix.symbol] = index;
	});

	userModeSortPriority[""] = 99; // No mode is lowest

	this.users = this.users.sort(function(a, b) {
		if (a.mode === b.mode) {
			return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
		}

		return userModeSortPriority[a.mode] - userModeSortPriority[b.mode];
	});
};

Chan.prototype.getMode = function(name) {
	var user = _.find(this.users, {name: name});
	if (user) {
		return user.mode;
	} else {
		return "";
	}
};

Chan.prototype.toJSON = function() {
	var clone = _.clone(this);
	clone.messages = clone.messages.slice(-100);
	return clone;
};
