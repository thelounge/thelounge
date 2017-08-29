"use strict";

var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("part", function(data) {
		var chan = network.getChannel(data.channel);
		if (typeof chan === "undefined") {
			return;
		}
		var from = data.nick;
		if (from === irc.user.nick) {
			network.channels = _.without(network.channels, chan);
			chan.destroy();
			client.save();
			client.emit("part", {
				chan: chan.id
			});
		} else {
			const user = chan.findUser(from);
			chan.users = _.without(chan.users, user);
			client.emit("users", {
				chan: chan.id
			});
			var msg = new Msg({
				type: Msg.Type.PART,
				time: data.time,
				mode: (user && user.mode) || "",
				text: data.message || "",
				hostmask: data.ident + "@" + data.hostname,
				from: from
			});
			chan.pushMessage(client, msg);
		}
	});
};
