"use strict";

const $ = require("jquery");
const escape = require("css.escape");
const viewport = $("#viewport");
const {vueApp} = require("./vue");

var serverHash = -1; // eslint-disable-line no-var

module.exports = {
	// Same value as media query in CSS that forces sidebars to become overlays
	mobileViewportPixels: 768,
	findCurrentNetworkChan,
	serverHash,
	confirmExit,
	scrollIntoViewNicely,
	hasRoleInChannel,
	move,
	closeChan,
	toggleNotificationMarkers,
	updateTitle,
	togglePasswordField,
	requestIdleCallback,
	togglePreviewMoreButtonsIfNeeded,
};

function findCurrentNetworkChan(name) {
	name = name.toLowerCase();

	return vueApp.activeChannel.network.channels.find((c) => c.name.toLowerCase() === name);
}

// Given a channel element will determine if the lounge user or a given nick is one of the supplied roles.
function hasRoleInChannel(channel, roles, nick) {
	if (!channel || !roles) {
		return false;
	}

	const channelID = channel.data("id");
	const network = $("#sidebar .network").has(`.chan[data-id="${channelID}"]`);
	const target = nick || network.attr("data-nick");
	const user = channel.find(`.names-original .user[data-name="${escape(target)}"]`).first();
	return user.parent().is("." + roles.join(", ."));
}

// Reusable scrollIntoView parameters for channel list / user list
function scrollIntoViewNicely(el) {
	// Ideally this would use behavior: "smooth", but that does not consistently work in e.g. Chrome
	// https://github.com/iamdustan/smoothscroll/issues/28#issuecomment-364061459
	el.scrollIntoView({block: "center", inline: "nearest"});
}

const favicon = $("#favicon");

function toggleNotificationMarkers(newState) {
	// Toggles the favicon to red when there are unread notifications
	if (favicon.data("toggled") !== newState) {
		const old = favicon.prop("href");
		favicon.prop("href", favicon.data("other"));
		favicon.data("other", old);
		favicon.data("toggled", newState);
	}

	// Toggles a dot on the menu icon when there are unread notifications
	viewport.toggleClass("notified", newState);
}

function updateTitle() {
	let title = vueApp.appName;

	if (vueApp.activeChannel) {
		title = `${vueApp.activeChannel.channel.name} — ${vueApp.activeChannel.network.name} — ${title}`;
	}

	// add highlight count to title
	let alertEventCount = 0;

	for (const network of vueApp.networks) {
		for (const channel of network.channels) {
			alertEventCount += channel.highlight;
		}
	}

	if (alertEventCount > 0) {
		title = `(${alertEventCount}) ${title}`;
	}

	document.title = title;
}

function togglePasswordField(elem) {
	$(elem).on("click", function() {
		const $this = $(this);
		const input = $this.closest("div").find("input");

		input.attr("type", input.attr("type") === "password" ? "text" : "password");

		swapLabel($this);
		swapLabel($this.find("span"));
		$this.toggleClass("visible");
	});
}

// Given a element, swap its aria-label with the content of `data-alt-label`
function swapLabel(element) {
	const altText = element.data("alt-label");
	element.data("alt-label", element.attr("aria-label")).attr("aria-label", altText);
}

function confirmExit() {
	if ($(document.body).hasClass("public")) {
		window.onbeforeunload = function() {
			return "Are you sure you want to navigate away from this page?";
		};
	}
}

function move(array, old_index, new_index) {
	if (new_index >= array.length) {
		let k = new_index - array.length;

		while ((k--) + 1) {
			this.push(undefined);
		}
	}

	array.splice(new_index, 0, array.splice(old_index, 1)[0]);
	return array;
}

function closeChan(chan) {
	const socket = require("./socket");
	let cmd = "/close";

	if (chan.hasClass("lobby")) {
		cmd = "/quit";
		const server = chan.find(".name").html();

		if (!confirm(`Are you sure you want to remove ${server}?`)) { // eslint-disable-line no-alert
			return false;
		}
	}

	socket.emit("input", {
		target: chan.data("id"),
		text: cmd,
	});
	chan.css({
		transition: "none",
		opacity: 0.4,
	});
	return false;
}

function requestIdleCallback(callback, timeout) {
	if (window.requestIdleCallback) {
		// During an idle period the user agent will run idle callbacks in FIFO order
		// until either the idle period ends or there are no more idle callbacks eligible to be run.
		window.requestIdleCallback(callback, {timeout});
	} else {
		callback();
	}
}

// Force handling preview display
function togglePreviewMoreButtonsIfNeeded() {
	$("#chat .chan.active .toggle-content.toggle-type-link.show")
		.trigger("showMoreIfNeeded");
}
