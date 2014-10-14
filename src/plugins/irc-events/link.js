var _ = require("lodash");
var cheerio = require("cheerio");
var Msg = require("../../models/msg");
var request = require("superagent");
var Helper = require("../../helper");

module.exports = function(irc, network) {
	var client = this;
	irc.on("message", function(data) {
		var config = Helper.getConfig();
		if (!config.prefetch) {
			return;
		}
		
		var links = [];
		var split = data.message.split(" ");
		_.each(split, function(w) {
			var match = w.indexOf("http://") === 0 || w.indexOf("https://") === 0;
			if (match) {
				links.push(w);
			}
		});

		if (links.length === 0) {
			return;
		}

		var self = data.to.toLowerCase() == irc.me.toLowerCase();
		var chan = _.findWhere(network.channels, {name: self ? data.from : data.to});
		if (typeof chan === "undefined") {
			return;
		}

		var msg = new Msg({
			type: Msg.Type.TOGGLE,
			time: ""
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});

		_.each(links, function(url) {
			fetch(url, function(res) {
				parse(msg, url, res, client);
			});
		});
	});
};

function parse(msg, url, res, client) {
	var toggle = msg.toggle = {
		id: msg.id,
		type: "",
		head: "",
		body: "",
		thumb: "",
		link: url
	};

	switch (res.type) {
	case "text/html":
		var $ = cheerio.load(res.res.text);
		toggle.type = "link";
		toggle.head = $("title").text();
		toggle.body =
			   $('meta[name=description]').attr('content')
			|| $('meta[property="og:description"]').attr('content')
			|| "No description found.";
		toggle.thumb = 
			   $('meta[property="og:image"]').attr('content')
			|| $('meta[name="twitter:image:src"]').attr('content')
			|| "";
		break;

	case "image/png":
	case "image/gif":
	case "image/jpg":
	case "image/jpeg":
		toggle.type = "image";
		break;

	default:
		return;
	}

	client.emit("toggle", toggle);
}

function fetch(url, cb) {
	var req = request.get(url);
	req.end(function(e, res) {
		if (res) {
			cb(res);
		}
	});
}
