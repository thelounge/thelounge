var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("message", function(data) {
		var image = "";
		var split = data.message.split(" ");
		_.each(split, function(w) {
			var match = w.match(/^(http|https).*\.(gif|png|jpg|jpeg)$/i);
			if (match !== null) {
				image = w;
			}
		});
		if (image === "") {
			return;
		}
		var target = data.to;
		var chan = _.findWhere(network.channels, {name: target.charAt(0) == "#" ? target : data.from});
		if (typeof chan === "undefined") {
			return;
		}
		var msg = new Msg({
			type: Msg.Type.THUMB,
			from: data.from,
			text: "http://placehold.it/320x320" // image
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
