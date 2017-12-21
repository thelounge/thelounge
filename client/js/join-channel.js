"use strict";

const $ = require("jquery");
const Mousetrap = require("mousetrap");

const socket = require("./socket");
const utils = require("./utils");

const sidebar = $("#sidebar");

function closeForm(network) {
	const form = network.find(".join-form");
	form.find("input[name='channel']").val("");
	form.find("input[name='key']").val("");
	form.hide();
}

sidebar.on("click", ".add-channel", (e) => {
	const id = $(e.target).data("id");
	const joinForm = $(`#join-channel-${id}`);
	joinForm.toggle();
	joinForm.find(".input[name='channel']").focus();
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
