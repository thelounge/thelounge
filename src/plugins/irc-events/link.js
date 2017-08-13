"use strict";

const cheerio = require("cheerio");
const request = require("request");
const url = require("url");
const Helper = require("../../helper");
const findLinks = require("../../../client/js/libs/handlebars/ircmessageparser/findLinks");
const es = require("event-stream");
const storage = require("../storage");

process.setMaxListeners(0);

module.exports = function(client, chan, msg) {
	if (!Helper.config.prefetch) {
		return;
	}

	// Remove all IRC formatting characters before searching for links
	const cleanText = msg.text.replace(/\x02|\x1D|\x1F|\x16|\x0F|\x03(?:[0-9]{1,2}(?:,[0-9]{1,2})?)?/g, "");

	// We will only try to prefetch http(s) links
	const links = findLinks(cleanText).filter((w) => /^https?:\/\//.test(w.link));

	if (links.length === 0) {
		return;
	}

	msg.previews = Array.from(new Set( // Remove duplicate links
		links.map((link) => escapeHeader(link.link))
	)).map((link) => ({
		type: "loading",
		head: "",
		body: "",
		thumb: "",
		link: link,
		shown: true,
	})).slice(0, 5); // Only preview the first 5 URLs in message to avoid abuse

	msg.previews.forEach((preview) => {
		fetch(preview.link, function(res) {
			if (res === null) {
				return;
			}

			parse(msg, preview, res, client);
		});
	});
};

function parse(msg, preview, res, client) {
	switch (res.type) {
	case "text/html":
		var $ = cheerio.load(res.data);
		preview.type = "link";
		preview.head =
			$("meta[property=\"og:title\"]").attr("content")
			|| $("title").text()
			|| "";
		preview.body =
			$("meta[property=\"og:description\"]").attr("content")
			|| $("meta[name=\"description\"]").attr("content")
			|| "";
		preview.thumb =
			$("meta[property=\"og:image\"]").attr("content")
			|| $("meta[name=\"twitter:image:src\"]").attr("content")
			|| $("link[rel=\"image_src\"]").attr("href")
			|| "";

		if (preview.thumb.length) {
			preview.thumb = url.resolve(preview.link, preview.thumb);
		}

		// Make sure thumbnail is a valid url
		if (!/^https?:\/\//.test(preview.thumb)) {
			preview.thumb = "";
		}

		// Verify that thumbnail pic exists and is under allowed size
		if (preview.thumb.length) {
			fetch(escapeHeader(preview.thumb), (resThumb) => {
				if (resThumb === null
				|| !(/^image\/.+/.test(resThumb.type))
				|| resThumb.size > (Helper.config.prefetchMaxImageSize * 1024)) {
					preview.thumb = "";
				}

				handlePreview(client, msg, preview, resThumb);
			});

			return;
		}

		break;

	case "image/png":
	case "image/gif":
	case "image/jpg":
	case "image/jpeg":
		if (res.size > (Helper.config.prefetchMaxImageSize * 1024)) {
			return;
		}

		preview.type = "image";
		preview.thumb = preview.link;

		break;

	default:
		return;
	}

	handlePreview(client, msg, preview, res);
}

function handlePreview(client, msg, preview, res) {
	if (!preview.thumb.length || !Helper.config.prefetchStorage) {
		return emitPreview(client, msg, preview);
	}

	storage.store(res.data, res.type.replace("image/", ""), (uri) => {
		preview.thumb = uri;

		emitPreview(client, msg, preview);
	});
}

function emitPreview(client, msg, preview) {
	// If there is no title but there is preview or description, set title
	// otherwise bail out and show no preview
	if (!preview.head.length && preview.type === "link") {
		if (preview.thumb.length || preview.body.length) {
			preview.head = "Untitled page";
		} else {
			return;
		}
	}

	client.emit("msg:preview", {
		id: msg.id,
		preview: preview
	});
}

function fetch(uri, cb) {
	let req;
	try {
		req = request.get({
			url: uri,
			maxRedirects: 5,
			timeout: 5000,
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; The Lounge IRC Client; +https://github.com/thelounge/lounge)"
			}
		});
	} catch (e) {
		return cb(null);
	}
	var length = 0;
	var limit = Helper.config.prefetchMaxImageSize * 1024;
	req
		.on("response", function(res) {
			if (!(/^image\/.+/.test(res.headers["content-type"]))) {
				// if not image, limit download to 50kb, since we need only meta tags
				// twitter.com sends opengraph meta tags within ~20kb of data for individual tweets
				limit = 1024 * 50;
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
			if (err) {
				return cb(null);
			}

			if (req.response.statusCode < 200 || req.response.statusCode > 299) {
				return cb(null);
			}

			let type = "";
			let size = parseInt(req.response.headers["content-length"], 10) || length;

			if (size < length) {
				size = length;
			}

			if (req.response.headers["content-type"]) {
				type = req.response.headers["content-type"].split(/ *; */).shift();
			}

			data = {
				data: data,
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
