"use strict";

const $ = require("jquery");
const templates = require("../views");
const options = require("./options");
const renderPreview = require("./renderPreview");
const utils = require("./utils");
const sorting = require("./sorting");
const constants = require("./constants");
const condensed = require("./condensed");

const chat = $("#chat");
const sidebar = $("#sidebar");

require("intersection-observer");

const historyObserver = window.IntersectionObserver ?
	new window.IntersectionObserver(loadMoreHistory, {
		root: chat.get(0)
	}) : null;

module.exports = {
	appendMessage,
	buildChannelMessages,
	renderChannel,
	renderChannelUsers,
	renderNetworks,
};

function buildChannelMessages(chanId, chanType, messages) {
	return messages.reduce((docFragment, message) => {
		appendMessage(docFragment, chanId, chanType, message);
		return docFragment;
	}, $(document.createDocumentFragment()));
}

function appendMessage(container, chanId, chanType, msg) {
	if (utils.lastMessageId < msg.id) {
		utils.lastMessageId = msg.id;
	}

	let lastChild = container.children(".msg, .date-marker-container").last();
	const renderedMessage = buildChatMessage(msg);

	// Check if date changed
	const msgTime = new Date(msg.time);
	const prevMsgTime = new Date(lastChild.data("time"));

	// Insert date marker if date changed compared to previous message
	if (prevMsgTime.toDateString() !== msgTime.toDateString()) {
		lastChild = $(templates.date_marker({time: msg.time}));
		container.append(lastChild);
	}

	// If current window is not a channel or this message is not condensable,
	// then just append the message to container and be done with it
	if (constants.condensedTypes.indexOf(msg.type) === -1 || chanType !== "channel") {
		container.append(renderedMessage);
		return;
	}

	// If the previous message is already condensed,
	// we just append to it and update text
	if (lastChild.hasClass("condensed")) {
		lastChild.append(renderedMessage);
		condensed.updateText(lastChild, [msg.type]);
		return;
	}

	// Always create a condensed container
	const newCondensed = $(templates.msg_condensed({time: msg.time}));

	condensed.updateText(newCondensed, [msg.type]);
	newCondensed.append(renderedMessage);
	container.append(newCondensed);
}

function buildChatMessage(msg) {
	const type = msg.type;
	let template = "msg";

	// See if any of the custom highlight regexes match
	if (!msg.highlight && !msg.self
		&& options.highlightsRE
		&& (type === "message" || type === "notice")
		&& options.highlightsRE.exec(msg.text)) {
		msg.highlight = true;
	}

	if (constants.actionTypes.indexOf(type) !== -1) {
		msg.template = "actions/" + type;
		template = "msg_action";
	} else if (type === "unhandled") {
		template = "msg_unhandled";
	}

	const renderedMessage = $(templates[template](msg));
	const content = renderedMessage.find(".content");

	if (template === "msg_action") {
		content.html(templates.actions[type](msg));
	}

	msg.previews.forEach((preview) => {
		renderPreview(preview, renderedMessage);
	});

	return renderedMessage;
}

function renderChannel(data) {
	renderChannelMessages(data);

	if (data.type === "channel") {
		renderChannelUsers(data);
	}

	if (historyObserver) {
		historyObserver.observe(chat.find("#chan-" + data.id + " .show-more").get(0));
	}
}

function renderChannelMessages(data) {
	const documentFragment = buildChannelMessages(data.id, data.type, data.messages);
	const channel = chat.find("#chan-" + data.id + " .messages").append(documentFragment);

	const template = $(templates.unread_marker());

	if (data.firstUnread > 0) {
		let first = channel.find("#msg-" + data.firstUnread);

		if (!first.length) {
			template.data("unread-id", data.firstUnread);
			channel.prepend(template);
		} else {
			const parent = first.parent();

			if (parent.hasClass("condensed")) {
				first = parent;
			}

			first.before(template);
		}
	} else {
		channel.append(template);
	}
}

function renderChannelUsers(data) {
	const users = chat.find("#chan-" + data.id).find(".users");
	const nicks = data.users
		.concat() // Make a copy of the user list, sort is applied in-place
		.sort((a, b) => b.lastMessage - a.lastMessage)
		.map((a) => a.nick);

	const search = users
		.find(".search")
		.attr("placeholder", nicks.length + " " + (nicks.length === 1 ? "user" : "users"));

	users
		.data("nicks", nicks)
		.find(".names-original")
		.html(templates.user(data));

	// Refresh user search
	if (search.val().length) {
		search.trigger("input");
	}
}

function renderNetworks(data) {
	sidebar.find(".empty").hide();
	sidebar.find(".networks").append(
		templates.network({
			networks: data.networks
		})
	);

	const channels = $.map(data.networks, function(n) {
		return n.channels;
	});
	chat.append(
		templates.chat({
			channels: channels
		})
	);
	channels.forEach((channel) => {
		renderChannel(channel);

		if (channel.type === "channel") {
			chat.find("#chan-" + channel.id).data("needsNamesRefresh", true);
		}
	});

	utils.confirmExit();
	sorting();

	if (sidebar.find(".highlight").length) {
		utils.toggleNotificationMarkers(true);
	}
}

function loadMoreHistory(entries) {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) {
			return;
		}

		var target = $(entry.target).find(".show-more-button");

		if (target.attr("disabled")) {
			return;
		}

		target.click();
	});
}
