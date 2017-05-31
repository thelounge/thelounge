"use strict";

var Chan = require("../../models/chan");
var Msg = require("../../models/msg");
var User = require("../../models/user");
var Helper = require("../../helper.js");

module.exports = function(irc, network) {
	var client = this;
	irc.on("join", function(data) {
		if (Helper.config.restrict.enable && data.channel.match(Helper.config.restrict.pattern) === null) {
			network.channels[0].pushMessage(client, new Msg({
				text: Helper.config.restrict.restrictMessage
			}));
			return;
		}
		var chan = network.getChannel(data.channel);
		if (typeof chan === "undefined") {
			chan = new Chan({
				name: data.channel
			});
			network.channels.push(chan);
			client.save();
			client.emit("join", {
				network: network.id,
				chan: chan
			});

			// Request channels' modes
			network.irc.raw("MODE", chan.name);
		}
		chan.users.push(new User({nick: data.nick}));
		chan.sortUsers(irc);
		client.emit("users", {
			chan: chan.id
		});
		var msg = new Msg({
			time: data.time,
			from: data.nick,
			hostmask: data.ident + "@" + data.hostname,
			type: Msg.Type.JOIN,
			self: data.nick === irc.user.nick
		});
		chan.pushMessage(client, msg);
	});
};
