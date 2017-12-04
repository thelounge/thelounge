"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const utils = require("../utils");
const options = require("../options");
const helpers_roundBadgeNumber = require("../libs/handlebars/roundBadgeNumber");
const cleanIrcMessage = require("../libs/handlebars/ircmessageparser/cleanIrcMessage");
const webpush = require("../webpush");
const chat = $("#chat");
const sidebar = $("#sidebar");

let pop;
try {
	pop = new Audio();
	pop.src = "audio/pop.ogg";
} catch (e) {
	pop = {
		play: $.noop,
	};
}

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

	if (activeChannelId === targetId) {
		container.trigger("keepToBottom");
	}

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

	// Clear unread/highlight counter if self-message
	if (data.msg.self) {
		sidebar.find("[data-target='" + target + "'] .badge").removeClass("highlight").empty();
	}

	let messageLimit = 0;

	if (activeChannelId !== targetId) {
		// If message arrives in non active channel, keep only 100 messages
		messageLimit = 100;
	} else if (container.isScrollBottom()) {
		// If message arrives in active channel, keep 500 messages if scroll is currently at the bottom
		messageLimit = 500;
	}

	if (messageLimit > 0) {
		render.trimMessageInChannel(channel, messageLimit);
	}

	if ((data.msg.type === "message" || data.msg.type === "action" || data.msg.type === "notice") && channel.hasClass("channel")) {
		const nicks = channel.find(".users").data("nicks");
		if (nicks) {
			const find = nicks.indexOf(data.msg.from.nick);
			if (find !== -1) {
				nicks.splice(find, 1);
				nicks.unshift(data.msg.from.nick);
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
					body = msg.from.nick + " invited you to " + msg.channel;
				} else {
					title = msg.from.nick;
					if (!button.hasClass("query")) {
						title += " (" + button.data("title").trim() + ")";
					}
					if (msg.type === "message") {
						title += " says:";
					}
					body = cleanIrcMessage(msg.text);
				}

				try {
					if (webpush.hasServiceWorker) {
						navigator.serviceWorker.ready.then((registration) => {
							registration.active.postMessage({
								type: "notification",
								chanId: targetId,
								timestamp: msg.time,
								title: title,
								body: body,
							});
						});
					} else {
						const notify = new Notification(title, {
							tag: `chan-${targetId}`,
							badge: "img/logo-64.png",
							icon: "img/touch-icon-192x192.png",
							body: body,
							timestamp: msg.time,
						});
						notify.addEventListener("click", function() {
							window.focus();
							button.click();
							this.close();
						});
					}
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
