"use strict";

var cheerio = require("cheerio");
var Msg = require("../../models/msg");
var request = require("request");
var Helper = require("../../helper");
var es = require("event-stream");

process.setMaxListeners(0);

module.exports = function(irc, network) {
	var client = this;
	irc.on("privmsg", function(data) {
		if (!Helper.config.prefetch) {
			return;
		}

		const links = data.message
			.replace(/\x02|\x1D|\x1F|\x16|\x0F|\x03(?:[0-9]{1,2}(?:,[0-9]{1,2})?)?/g, "")
			.split(" ")
			.filter(w => /^https?:\/\//.test(w));

		if (links.length === 0) {
			return;
		}

		var chan = network.getChannel(data.target);
		if (typeof chan === "undefined") {
			return;
		}

		var msg = new Msg({
			self: data.nick === irc.user.nick,
			type: Msg.Type.URL,
		});

		chan.pushMessage(client, msg);

		var link = escapeHeader(links[0]);
		parse(msg, link, client);
	});
};

function parse(msg, url, client) {
	var link = msg.url = {
		id: msg.id,
		link: url
	};

	client.emit("url", link);
}

// https://github.com/request/request/issues/2120
// https://github.com/nodejs/node/issues/1693
// https://github.com/alexeyten/descript/commit/50ee540b30188324198176e445330294922665fc
function escapeHeader(header) {
	return header
		.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])+/g, encodeURI)
		.replace(/[\uD800-\uDFFF]/g, "")
		.replace(/[\u0000-\u001F\u007F-\uFFFF]+/g, encodeURI);
}
