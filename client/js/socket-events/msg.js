"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const options = require("../options");
const utils = require("../utils");
const templates = require("../../views");
const helpers_roundBadgeNumber = require("../libs/handlebars/roundBadgeNumber");

const sidebar = $("#sidebar");
const chat = $("#chat");
const messageQueue = [];
let lastNotificationSoundPlay = 0;

let processOnIdle;
if (window.requestIdleCallback) {
	processOnIdle = (callback) => {
		window.requestIdleCallback(callback, {timeout: 2000});
	};
} else {
	processOnIdle = (callback) => callback();
}

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
	messageQueue.push(data);

	if (messageQueue.length === 1) {
		processOnIdle(processReceivedMessages);
	}
});

function processReceivedMessages() {
	let target = null;
	let channel;
	let container;
	let previousMessage;
	let documentFragment;

	const activeChannelId = chat.find(".chan.active").data("id");

	// TODO: sorting too much?
	messageQueue.sort((a, b) => {
		if (a.chan === b.chan) {
			return a.msg.id - b.msg.id;
		}

		// TODO: Prioritize active channel?

		return a.chan - b.chan;
	});

	while (messageQueue[0] !== undefined) {
		if (target !== null && target !== messageQueue[0].chan) {
			processOnIdle(processReceivedMessages);
			break;
		}

		const data = messageQueue.shift();
		const msg = render.buildChatMessage(data);

		if (target === null) {
			target = data.chan;
			channel = chat.find("#chan-" + target);
			container = channel.find(".messages");

			if (data.msg.type === "channel_list" || data.msg.type === "ban_list") {
				container.empty();
			}

			documentFragment = $(document.createDocumentFragment());
			previousMessage = container.find(".msg").last();
		}

		// Check if date changed
		const prevMsgTime = new Date(previousMessage.attr("data-time"));
		const msgTime = new Date(msg.attr("data-time"));

		if (previousMessage.length === 0 || prevMsgTime.toDateString() !== msgTime.toDateString()) {
			// TODO: Condensed stuff
			var parent = previousMessage.parent();
			if (parent.hasClass("condensed")) {
				previousMessage = parent;
			}

			documentFragment.append(templates.date_marker({msgDate: msgTime}));
		}

		// Add message to the container
		previousMessage = msg;
		render.appendMessage( // TODO: condensed stuff
			documentFragment,
			data.chan,
			$(target).attr("data-type"),
			data.msg.type,
			msg
		);

		const lastVisible = container.find("div:visible").last();
		if (data.msg.self
			|| lastVisible.hasClass("unread-marker")
			|| (lastVisible.hasClass("date-marker")
			&& lastVisible.prev().hasClass("unread-marker"))) {
			const unreadMarker = container.find(".unread-marker") || documentFragment.find(".unread-marker");

			unreadMarker.appendTo(documentFragment);
		}

		if (!data.msg.self) {
			notifyChannelMessage("#chan-" + target, data);
		}
	}

	if (container) {
		container
			.append(documentFragment)
			.trigger("keepToBottom");

		// Message arrived in a non active channel, trim it to 100 messages
		if (activeChannelId !== target && container.find(".msg").slice(0, -100).remove().length) {
			channel.find(".show-more").addClass("show");

			// Remove date-seperators that would otherwise
			// be "stuck" at the top of the channel
			channel.find(".date-marker-container").each(function() {
				if ($(this).next().hasClass("date-marker-container")) {
					$(this).remove();
				}
			});
		}
	}
}

function notifyChannelMessage(target, msg) {
	const unread = msg.unread;
	msg = msg.msg;

	const button = sidebar.find(".chan[data-target='" + target + "']");
	if (msg.highlight || (options.notifyAllMessages && msg.type === "message")) {
		if (!document.hasFocus() || !$(target).hasClass("active")) {
			const time = Date.now();

			if (options.notification && (time - lastNotificationSoundPlay) > 500) {
				// Fixes "The play() request was interrupted by a call to pause()"
				lastNotificationSoundPlay = time;

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
						tag: target
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

	if (button.hasClass("active")) {
		return;
	}

	if (!unread) {
		return;
	}

	const badge = button
		.find(".badge")
		.html(helpers_roundBadgeNumber(unread));

	if (msg.highlight) {
		badge.addClass("highlight");
	}
}
