var _ = require("lodash");
var Msg = require("../../models/msg");
var config = require("../../../config.json");
var fs = require("fs");
var mkdirp = require("mkdirp");
var request = require("superagent");

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
		fetchImage(image, function(name) {
			var msg = new Msg({
				type: Msg.Type.IMAGE,
				from: data.from,
				text: "thumbs/" + name
			});
			chan.messages.push(msg);
			client.emit("msg", {
				chan: chan.id,
				msg: msg
			});
		});
	});
};

function fetchImage(url, callback) {
	var path = process.env.HOME + "/.shout/cache/thumbs";
	var name = new Date().getTime().toString();
	mkdirp(path, function(e) {
		if (e) {
			console.log(e);
			return;
		}
		var stream = fs.createWriteStream(
			path + "/" + name,
			{mode: "0777"}
		);
		var req = request.get(url);
		req.pipe(stream);
		req.on("error", function(e) {
			console.log(e);
		});
		req.on("end", function() {
			if (this.req.res.statusCode == 200) {
				callback(name);	
			}
		});
		
	});
}
