var _ = require("lodash");
var Msg = require("../../models/msg");
var config = require("../../../config.json");
var fs = require("fs");
var mkdirp = require("mkdirp");
var http = require("http");

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
				type: Msg.Type.THUMB,
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
	var name = new Date().getTime().toString()
	mkdirp(path, function(e) {
		if (e) {
			console.log(e);
		}
		var stream = fs.createWriteStream(path + "/" + name);
		stream.on("error", function(e) {
			// ..
		});
		http.get(url, function(res) {
			res.on("data", function(chunk) {
				stream.write(chunk);
			});
			res.on("end", function() {
				stream.end();
				callback(name);
			});
		});
	});
}
