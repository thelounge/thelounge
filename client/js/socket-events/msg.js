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
	let targetId = data.chan;
	let target = "#chan-" + targetId;
	let channel = chat.find(target);
	let sidebarTarget = sidebar.find("[data-target='" + target + "']");

	// Display received notices and errors in currently active channel.
	// Reloading the page will put them back into the lobby window.
	if (data.msg.showInActive) {
		const activeOnNetwork = sidebarTarget.parent().find(".active");

		// We only want to put errors/notices in active channel if they arrive on the same network
		if (activeOnNetwork.length > 0) {
			targetId = data.chan = activeOnNetwork.data("id");

			target = "#chan-" + targetId;
			channel = chat.find(target);
			sidebarTarget = sidebar.find("[data-target='" + target + "']");
		}
	}

	const scrollContainer = channel.find(".chat");
	const container = channel.find(".messages");
	const activeChannelId = chat.find(".chan.active").data("id");

	if (data.msg.type === "channel_list" || data.msg.type === "ban_list") {
		$(container).empty();
	}

	// Add message to the container
	render.appendMessage(
		container,
		targetId,
		channel.data("type"),
		data.msg
	);

	if (activeChannelId === targetId) {
		scrollContainer.trigger("keepToBottom");
	}

	notifyMessage(targetId, channel, data);

	let shouldMoveMarker = data.msg.self;

	if (!shouldMoveMarker) {
		const lastChild = container.children().last();

		// If last element is hidden (e.g. hidden status messages) check the element before it.
		// If it's unread marker or date marker, then move unread marker to the bottom
		// so that it isn't displayed as the last element in chat.
		// display properly is checked instead of using `:hidden` selector because it doesn't work in non-active channels.
		if (lastChild.css("display") === "none") {
			const prevChild = lastChild.prev();

			shouldMoveMarker =
				prevChild.hasClass("unread-marker") ||
				(prevChild.hasClass("date-marker") && prevChild.prev().hasClass("unread-marker"));
		}
	}

	if (shouldMoveMarker) {
		container
			.find(".unread-marker")
			.data("unread-id", 0)
			.appendTo(container);
	}

	// Clear unread/highlight counter if self-message
	if (data.msg.self) {
		sidebarTarget.find(".badge").removeClass("highlight").empty();
	}

	let messageLimit = 0;

	if (activeChannelId !== targetId) {
		// If message arrives in non active channel, keep only 100 messages
		messageLimit = 100;
	} else if (scrollContainer.isScrollBottom()) {
		// If message arrives in active channel, keep 500 messages if scroll is currently at the bottom
		messageLimit = 500;
	}

	if (messageLimit > 0) {
		render.trimMessageInChannel(channel, messageLimit);
	}

	if ((data.msg.type === "message" || data.msg.type === "action") && channel.hasClass("channel")) {
		const nicks = channel.find(".userlist").data("nicks");

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

	if (msg.highlight || (options.settings.notifyAllMessages && msg.type === "message")) {
		if (!document.hasFocus() || !channel.hasClass("active")) {
			if (options.settings.notification) {
				try {
					pop.play();
				} catch (exception) {
					// On mobile, sounds can not be played without user interaction.
				}
			}

			utils.toggleNotificationMarkers(true);

			if (options.settings.desktopNotifications && ("Notification" in window) && Notification.permission === "granted") {
				let title;
				let body;

				if (msg.type === "invite") {
					title = "New channel invite:";
					body = msg.from.nick + " invited you to " + msg.channel;
				} else {
					title = msg.from.nick;

					if (!button.hasClass("query")) {
						title += " (" + button.attr("aria-label").trim() + ")";
					}

					if (msg.type === "message") {
						title += " says:";
					}

					body = cleanIrcMessage(msg.text);
				}

				const timestamp = Date.parse(msg.time);

				try {
					if (webpush.hasServiceWorker) {
						navigator.serviceWorker.ready.then((registration) => {
							registration.active.postMessage({
								type: "notification",
								chanId: targetId,
								timestamp: timestamp,
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
							timestamp: timestamp,
						});
						notify.addEventListener("click", function() {
							window.focus();
							button.trigger("click");
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
