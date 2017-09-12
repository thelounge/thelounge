"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const utils = require("../utils");
const options = require("../options");
const helpers_roundBadgeNumber = require("../libs/handlebars/roundBadgeNumber");
const chat = $("#chat");
const sidebar = $("#sidebar");

let pop;
try {
	pop = new Audio();
	pop.src = "audio/pop.ogg";
} catch (e) {
	pop = {
		play: $.noop
	};
}

$("#play").on("click", () => pop.play());

socket.on("msg", function(data) {
	// We set a maximum timeout of 2 seconds so that messages don't take too long to appear.
	utils.requestIdleCallback(() => processReceivedMessage(data), 2000);
});

function processReceivedMessage(data) {
	const targetId = data.chan;
	const target = "#chan-" + targetId;
	const channel = chat.find(target);
	const container = channel.find(".messages");

	const activeChannelId = chat.find(".chan.active").data("id");

	if (data.msg.type === "channel_list" || data.msg.type === "ban_list") {
		$(container).empty();
	}

	// Add message to the container
	render.appendMessage(
		container,
		targetId,
		channel.attr("data-type"),
		data.msg
	);

	container.trigger("keepToBottom");

	notifyMessage(targetId, channel, data);

	var lastVisible = container.find("div:visible").last();
	if (data.msg.self
		|| lastVisible.hasClass("unread-marker")
		|| (lastVisible.hasClass("date-marker")
		&& lastVisible.prev().hasClass("unread-marker"))) {
		container
			.find(".unread-marker")
			.data("unread-id", 0)
			.appendTo(container);
	}

	// Message arrived in a non active channel, trim it to 100 messages
	if (activeChannelId !== targetId && container.find(".msg").slice(0, -100).remove().length) {
		channel.find(".show-more").addClass("show");

		// Remove date-separators that would otherwise
		// be "stuck" at the top of the channel
		channel.find(".date-marker-container").each(function() {
			if ($(this).next().hasClass("date-marker-container")) {
				$(this).remove();
			}
		});
	}

	if ((data.msg.type === "message" || data.msg.type === "action" || data.msg.type === "notice") && channel.hasClass("channel")) {
		const nicks = channel.find(".users").data("nicks");
		if (nicks) {
			const find = nicks.indexOf(data.msg.from);
			if (find !== -1) {
				nicks.splice(find, 1);
				nicks.unshift(data.msg.from);
			}
		}
	}
}

function notifyMessage(targetId, channel, msg) {
	const unread = msg.unread;
	msg = msg.msg;

	if (msg.self) {
		return;
	}

	const button = sidebar.find(".chan[data-id='" + targetId + "']");
	if (msg.highlight || (options.notifyAllMessages && msg.type === "message")) {
		if (!document.hasFocus() || !channel.hasClass("active")) {
			if (options.notification) {
				try {
					pop.play();
				} catch (exception) {
					// On mobile, sounds can not be played without user interaction.
				}
			}

			utils.toggleNotificationMarkers(true);

			if (options.desktopNotifications && Notification.permission === "granted") {
				let title;
				let body;

				if (msg.type === "invite") {
					title = "New channel invite:";
					body = msg.from + " invited you to " + msg.channel;
				} else {
					title = msg.from;
					if (!button.hasClass("query")) {
						title += " (" + button.data("title").trim() + ")";
					}
					if (msg.type === "message") {
						title += " says:";
					}
					body = msg.text.replace(/\x03(?:[0-9]{1,2}(?:,[0-9]{1,2})?)?|[\x00-\x1F]|\x7F/g, "").trim();
				}

				try {
					const notify = new Notification(title, {
						body: body,
						icon: "img/logo-64.png",
						tag: `lounge-${targetId}`
					});
					notify.addEventListener("click", function() {
						window.focus();
						button.click();
						this.close();
					});
				} catch (exception) {
					// `new Notification(...)` is not supported and should be silenced.
				}
			}
		}
	}

	if (!unread || button.hasClass("active")) {
		return;
	}

	const badge = button.find(".badge").html(helpers_roundBadgeNumber(unread));

	if (msg.highlight) {
		badge.addClass("highlight");
	}
}
