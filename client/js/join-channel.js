"use strict";

const $ = require("jquery");
const Mousetrap = require("mousetrap");

const socket = require("./socket");
const utils = require("./utils");

const sidebar = $("#sidebar");

function toggleButton(network) {
	// Transform the + button to a ×
	network.find("button.add-channel").toggleClass("opened");

	// Toggle content of tooltip
	const tooltip = network.find(".add-channel-tooltip");
	const altLabel = tooltip.data("alt-label");
	tooltip.data("alt-label", tooltip.attr("aria-label"));
	tooltip.attr("aria-label", altLabel);
}

function closeForm(network) {
	const form = network.find(".join-form");
	form.find("input[name='channel']").val("");
	form.find("input[name='key']").val("");
	form.hide();

	toggleButton(network);
}

sidebar.on("click", ".add-channel", function(e) {
	const id = $(e.target).data("id");
	const joinForm = $(`#join-channel-${id}`);
	const network = joinForm.closest(".network");

	if (joinForm.is(":visible")) {
		closeForm(network);
	} else {
		joinForm.show();
		joinForm.find(".input[name='channel']").focus();
		toggleButton(network);
	}

	return false;
});

sidebar.on("submit", ".join-form", function() {
	const form = $(this);
	const channel = form.find("input[name='channel']");
	const channelString = channel.val();
	const key = form.find("input[name='key']");
	const keyString = key.val();
	const chan = utils.findCurrentNetworkChan(channelString);
	if (chan.length) {
		chan.click();
	} else {
		socket.emit("input", {
			text: `/join ${channelString} ${keyString}`,
			target: form.prev().data("id"),
		});
	}
	closeForm(form.closest(".network"));
	return false;
});

exports.handleKeybinds = function() {
	sidebar.find(".join-form input, .join-form button").each(function() {
		const network = $(this).closest(".network");
		Mousetrap(this).bind("esc", () => closeForm(network));
	});
};
