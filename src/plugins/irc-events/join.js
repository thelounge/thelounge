var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");
var User = require("../../models/user");

module.exports = function(irc, network) {
	var client = this;
	irc.on("join", function(data) {
		var chan = _.find(network.channels, {name: data.channel});
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
		}
		chan.users.push(new User({name: data.nick}));
		chan.sortUsers();
		client.emit("users", {
			chan: chan.id
		});
		var self = false;
		if (data.nick.toLowerCase() === irc.me.toLowerCase()) {
			self = true;
		}
		var msg = new Msg({
			from: data.nick,
			hostmask: data.hostmask.username + "@" + data.hostmask.hostname,
			type: Msg.Type.JOIN,
			self: self
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
