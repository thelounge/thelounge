"use strict";

const $ = require("jquery");

const socket = require("./socket");
const utils = require("./utils");

const sidebar = $("#sidebar");

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
	channel.val("");
	key.val("");
	form.hide();
	return false;
});
