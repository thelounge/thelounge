"use strict";

var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("quit", function(data) {
		network.channels.forEach((chan) => {
			var from = data.nick;
			var user = _.find(chan.users, {nick: from});
			if (typeof user === "undefined") {
				return;
			}
			chan.users = _.without(chan.users, user);
			client.emit("users", {
				chan: chan.id
			});
			var msg = new Msg({
				time: data.time,
				type: Msg.Type.QUIT,
				mode: user.mode || "",
				text: data.message || "",
				hostmask: data.ident + "@" + data.hostname,
				from: from
			});
			chan.pushMessage(client, msg);
		});
	});
};
