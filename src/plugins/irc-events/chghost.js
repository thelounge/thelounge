"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	// If server supports CHGHOST cap, then changing the hostname does not require
	// sending PART and JOIN, which means less work for us over all
	irc.on("user updated", function(data) {
		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);

			if (typeof user === "undefined") {
				return;
			}

			const msg = new Msg({
				time: data.time,
				type: Msg.Type.CHGHOST,
				new_ident: data.ident !== data.new_ident ? data.new_ident : "",
				new_host: data.hostname !== data.new_hostname ? data.new_hostname : "",
				self: data.nick === irc.user.nick,
				from: user,
			});

			chan.pushMessage(client, msg);
		});
	});
};
