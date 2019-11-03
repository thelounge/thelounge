"use strict";

const $ = require("jquery");
const escape = require("css.escape");

module.exports = {
	hasRoleInChannel,
};

// Given a channel element will determine if the lounge user or a given nick is one of the supplied roles.
function hasRoleInChannel(channel, roles, nick) {
	if (!channel || !roles) {
		return false;
	}

	const channelID = channel.attr("data-id");
	const network = $("#sidebar .network").has(`.chan[data-id="${channelID}"]`);
	const target = nick || network.attr("data-nick");
	const user = channel.find(`.names .user[data-name="${escape(target)}"]`).first();
	return user.parent().is("." + roles.join(", ."));
}
