var _ = require("lodash");
var cheerio = require("cheerio");
var Msg = require("../../models/msg");
var request = require("request");
var Helper = require("../../helper");
var es = require("event-stream");

process.setMaxListeners(0);

module.exports = function(irc, network) {
	var client = this;
	irc.on("privmsg", function(data) {
		var config = Helper.getConfig();
		if (!config.prefetch) {
			return;
		}

		var links = [];
		var split = data.message.replace(/\x02|\x1D|\x1F|\x16|\x0F|\x03(?:[0-9]{1,2}(?:,[0-9]{1,2})?)?/g, "").split(" ");
		_.each(split, function(w) {
			if (/^https?:\/\//.test(w)) {
				links.push(w);
			}
		});

		if (links.length === 0) {
			return;
		}

		var chan = network.getChannel(data.target);
		if (typeof chan === "undefined") {
			return;
		}

		var msg = new Msg({
			type: Msg.Type.TOGGLE,
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});

		var link = escapeHeader(links[0]);
		fetch(link, function(res) {
			parse(msg, link, res, client);
		});
	});
};

function parse(msg, url, res, client) {
	var config = Helper.getConfig();
	var toggle = msg.toggle = {
		id: msg.id,
		type: "",
		head: "",
		body: "",
		thumb: "",
		link: url
	};

	if (!config.prefetchMaxImageSize) {
		config.prefetchMaxImageSize = 512;
	}
	switch (res.type) {
	case "text/html":
		var $ = cheerio.load(res.text);
		toggle.type = "link";
		toggle.head = $("title").text();
		toggle.body =
			$("meta[name=description]").attr("content")
			|| $("meta[property=\"og:description\"]").attr("content")
			|| "No description found.";
		toggle.thumb =
			$("meta[property=\"og:image\"]").attr("content")
			|| $("meta[name=\"twitter:image:src\"]").attr("content")
			|| "";
		break;

	case "image/png":
	case "image/gif":
	case "image/jpg":
	case "image/jpeg":
		if (res.size < (config.prefetchMaxImageSize * 1024)) {
			toggle.type = "image";
		}
		else {
			return;
		}
		break;

	default:
		return;
	}

	client.emit("toggle", toggle);
}

function fetch(url, cb) {
	try {
		var req = request.get({
			url: url,
			maxRedirects: 5,
			timeout: 5000,
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; The Lounge IRC Client; +https://github.com/thelounge/lounge)"
			}
		});
	} catch (e) {
		return;
	}
	var length = 0;
	var limit = 1024 * 10;
	req
		.on("response", function(res) {
			if (!(/(text\/html|application\/json)/.test(res.headers["content-type"]))) {
				res.req.abort();
			}
		})
		.on("error", function() {})
		.pipe(es.map(function(data, next) {
			length += data.length;
			if (length > limit) {
				req.response.req.abort();
			}
			next(null, data);
		}))
		.pipe(es.wait(function(err, data) {
			if (err) return;
			var body;
			var type;
			var size = req.response.headers["content-length"];
			try {
				body = JSON.parse(data);
			} catch (e) {
				body = {};
			}
			try {
				type = req.response.headers["content-type"].split(/ *; */).shift();
			} catch (e) {
				type = {};
			}
			data = {
				text: data,
				body: body,
				type: type,
				size: size
			};
			cb(data);
		}));
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
