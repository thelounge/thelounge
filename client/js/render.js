"use strict";
const $ = require("jquery");
const templates = require("../views");
const options = require("./options");
const utils = require("./utils");

const chat = $("#chat");
const sidebar = $("#sidebar, #footer");

module.exports = {
	buildChannelMessages,
	buildChatMessage,
	renderChannel,
	renderChannelMessages,
	renderChannelUsers,
	renderNetworks
};

function buildChannelMessages(channel, messages) {
	return messages.reduce(function(docFragment, message) {
		docFragment.append(buildChatMessage({
			chan: channel,
			msg: message
		}));
		return docFragment;
	}, $(document.createDocumentFragment()));
}

function buildChatMessage(data) {
	var type = data.msg.type;
	var target = "#chan-" + data.chan;
	if (type === "error") {
		target = "#chan-" + chat.find(".active").data("id");
	}

	var chan = chat.find(target);
	var template = "msg";

	if (!data.msg.highlight && !data.msg.self && (type === "message" || type === "notice") && options.highlights.some(function(h) {
		return data.msg.text.toLocaleLowerCase().indexOf(h.toLocaleLowerCase()) > -1;
	})) {
		data.msg.highlight = true;
	}

	if ([
		"invite",
		"join",
		"mode",
		"kick",
		"nick",
		"part",
		"quit",
		"topic",
		"topic_set_by",
		"action",
		"whois",
		"ctcp",
		"channel_list",
	].indexOf(type) !== -1) {
		template = "msg_action";
	} else if (type === "unhandled") {
		template = "msg_unhandled";
	}

	var msg = $(templates[template](data.msg));
	var text = msg.find(".text");

	if (template === "msg_action") {
		text.html(templates.actions[type](data.msg));
	}

	if ((type === "message" || type === "action") && chan.hasClass("channel")) {
		var nicks = chan.find(".users").data("nicks");
		if (nicks) {
			var find = nicks.indexOf(data.msg.from);
			if (find !== -1 && typeof utils.move === "function") {
				utils.move(nicks, find, 0);
			}
		}
	}

	return msg;
}

function renderChannel(data) {
	renderChannelMessages(data);
	renderChannelUsers(data);
}

function renderChannelMessages(data) {
	var documentFragment = buildChannelMessages(data.id, data.messages);
	var channel = chat.find("#chan-" + data.id + " .messages").append(documentFragment);

	if (data.firstUnread > 0) {
		var first = channel.find("#msg-" + data.firstUnread);

		// TODO: If the message is far off in the history, we still need to append the marker into DOM
		if (!first.length) {
			channel.prepend(templates.unread_marker());
		} else {
			first.before(templates.unread_marker());
		}
	} else {
		channel.append(templates.unread_marker());
	}

	if (data.type !== "lobby") {
		var lastDate;
		$(chat.find("#chan-" + data.id + " .messages .msg[data-time]")).each(function() {
			var msg = $(this);
			var msgDate = new Date(msg.attr("data-time"));

			// Top-most message in a channel
			if (!lastDate) {
				lastDate = msgDate;
				msg.before(templates.date_marker({msgDate: msgDate}));
			}

			if (lastDate.toDateString() !== msgDate.toDateString()) {
				msg.before(templates.date_marker({msgDate: msgDate}));
			}

			lastDate = msgDate;
		});
	}
}

function renderChannelUsers(data) {
	var users = chat.find("#chan-" + data.id).find(".users");
	var nicks = users.data("nicks") || [];
	var i, oldSortOrder = {};

	for (i in nicks) {
		oldSortOrder[nicks[i]] = i;
	}

	nicks = [];

	for (i in data.users) {
		nicks.push(data.users[i].name);
	}

	nicks = nicks.sort(function(a, b) {
		return (oldSortOrder[a] || Number.MAX_VALUE) - (oldSortOrder[b] || Number.MAX_VALUE);
	});

	users.html(templates.user(data)).data("nicks", nicks);
}

function renderNetworks(data) {
	sidebar.find(".empty").hide();
	sidebar.find(".networks").append(
		templates.network({
			networks: data.networks
		})
	);

	var channels = $.map(data.networks, function(n) {
		return n.channels;
	});
	chat.append(
		templates.chat({
			channels: channels
		})
	);
	channels.forEach(renderChannel);

	utils.confirmExit();
	utils.sortable();

	if (sidebar.find(".highlight").length) {
		utils.toggleNotificationMarkers(true);
	}
}
