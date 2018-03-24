"use strict";

const cheerio = require("cheerio");
const request = require("request");
const url = require("url");
const URI = require("urijs");
const mime = require("mime-types");
const Helper = require("../../helper");
const cleanIrcMessage = require("../../../client/js/libs/handlebars/ircmessageparser/cleanIrcMessage");
const findLinks = require("../../../client/js/libs/handlebars/ircmessageparser/findLinks");
const storage = require("../storage");

const mediaTypeRegex = /^(audio|video)\/.+/;
const linkRegex = /^https?:\/\//;

// Fix ECDH curve client compatibility in Node v8/v9
// This is fixed in Node 10, but The Lounge supports LTS versions
// https://github.com/nodejs/node/issues/16196
// https://github.com/nodejs/node/pull/16853
// https://github.com/nodejs/node/pull/15206
const tls = require("tls");
const semver = require("semver");

if (semver.gte(process.version, "8.6.0") && tls.DEFAULT_ECDH_CURVE === "prime256v1") {
	tls.DEFAULT_ECDH_CURVE = "auto";
}

module.exports = function(client, chan, msg) {
	if (!Helper.config.prefetch) {
		return;
	}

	// Remove all IRC formatting characters before searching for links
	const cleanText = cleanIrcMessage(msg.text);

	// We will only try to prefetch http(s) links
	const links = findLinks(cleanText).filter((w) => linkRegex.test(w.link));

	if (links.length === 0) {
		return;
	}

	msg.previews = Array.from(new Set( // Remove duplicate links
		links.map((link) => link.link)
	)).map((link) => ({
		type: "loading",
		head: "",
		body: "",
		thumb: "",
		link: link,
		shown: true,
	})).slice(0, 5); // Only preview the first 5 URLs in message to avoid abuse

	msg.previews.forEach((preview) => {
		fetch(normalizeURL(preview.link), {
			accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			language: client.language,
		}, function(res, err) {
			if (err) {
				preview.type = "error";
				preview.error = "message";
				preview.message = err.message;
				handlePreview(client, msg, preview, res);
			}

			if (res === null) {
				return;
			}

			parse(msg, preview, res, client);
		});
	});
};

function parseHtml(preview, res, client) {
	return new Promise((resolve) => {
		const $ = cheerio.load(res.data);

		return parseHtmlMedia($, preview, res, client)
			.then((newRes) => resolve(newRes))
			.catch(() => {
				preview.type = "link";
				preview.head =
					$('meta[property="og:title"]').attr("content")
					|| $("title").text()
					|| "";
				preview.body =
					$('meta[property="og:description"]').attr("content")
					|| $('meta[name="description"]').attr("content")
					|| "";
				preview.thumb =
					$('meta[property="og:image"]').attr("content")
					|| $('meta[name="twitter:image:src"]').attr("content")
					|| $('link[rel="image_src"]').attr("href")
					|| "";

				if (preview.thumb.length) {
					preview.thumb = url.resolve(preview.link, preview.thumb);
				}

				// Make sure thumbnail is a valid url
				if (!linkRegex.test(preview.thumb)) {
					preview.thumb = "";
				}

				// Verify that thumbnail pic exists and is under allowed size
				if (preview.thumb.length) {
					fetch(normalizeURL(preview.thumb), {language: client.language}, (resThumb) => {
						if (resThumb === null
						|| !(/^image\/.+/.test(resThumb.type))
						|| resThumb.size > (Helper.config.prefetchMaxImageSize * 1024)) {
							preview.thumb = "";
						}

						resolve(resThumb);
					});
				} else {
					resolve(res);
				}
			});
	});
}

function parseHtmlMedia($, preview, res, client) {
	return new Promise((resolve, reject) => {
		let foundMedia = false;

		["video", "audio"].forEach((type) => {
			if (foundMedia) {
				return;
			}

			$(`meta[property="og:${type}:type"]`).each(function(i) {
				const mimeType = $(this).attr("content");

				if (mediaTypeRegex.test(mimeType)) {
					// If we match a clean video or audio tag, parse that as a preview instead
					const mediaUrl = $($(`meta[property="og:${type}"]`).get(i)).attr("content");

					// Make sure media is a valid url
					if (!mediaUrl.startsWith("https://")) {
						return;
					}

					foundMedia = true;

					fetch(normalizeURL(mediaUrl), {
						accept: type === "video" ?
							"video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5" :
							"audio/webm, audio/ogg, audio/wav, audio/*;q=0.9, application/ogg;q=0.7, video/*;q=0.6; */*;q=0.5",
						language: client.language,
					}, (resMedia) => {
						if (resMedia === null || !mediaTypeRegex.test(resMedia.type)) {
							return reject();
						}

						preview.type = type;
						preview.media = mediaUrl;
						preview.mediaType = resMedia.type;

						resolve(resMedia);
					});

					return false;
				}
			});
		});

		if (!foundMedia) {
			reject();
		}
	});
}

function parse(msg, preview, res, client) {
	let promise;

	switch (res.type) {
	case "text/html":
		promise = parseHtml(preview, res, client);
		break;

	case "image/png":
	case "image/gif":
	case "image/jpg":
	case "image/jpeg":
	case "image/webp":
		if (res.size > (Helper.config.prefetchMaxImageSize * 1024)) {
			preview.type = "error";
			preview.error = "image-too-big";
			preview.maxSize = Helper.config.prefetchMaxImageSize * 1024;
		} else {
			preview.type = "image";
			preview.thumb = preview.link;
		}

		break;

	case "audio/midi":
	case "audio/mpeg":
	case "audio/mpeg3":
	case "audio/ogg":
	case "audio/wav":
	case "audio/x-mid":
	case "audio/x-midi":
	case "audio/x-mpeg":
	case "audio/x-mpeg-3":
		if (!preview.link.startsWith("https://")) {
			break;
		}

		preview.type = "audio";
		preview.media = preview.link;
		preview.mediaType = res.type;

		break;

	case "video/webm":
	case "video/ogg":
	case "video/mp4":
		if (!preview.link.startsWith("https://")) {
			break;
		}

		preview.type = "video";
		preview.media = preview.link;
		preview.mediaType = res.type;

		break;

	default:
		return;
	}

	if (!promise) {
		return handlePreview(client, msg, preview, res);
	}

	promise.then((newRes) => handlePreview(client, msg, preview, newRes));
}

function handlePreview(client, msg, preview, res) {
	if (!preview.thumb.length || !Helper.config.prefetchStorage) {
		return emitPreview(client, msg, preview);
	}

	// Get the correct file extension for the provided content-type
	// This is done to prevent user-input being stored in the file name (extension)
	const extension = mime.extension(res.type);

	if (!extension) {
		// For link previews, drop the thumbnail
		// For other types, do not display preview at all
		if (preview.type !== "link") {
			return;
		}

		preview.thumb = "";
		return emitPreview(client, msg, preview);
	}

	storage.store(res.data, extension, (uri) => {
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

	const id = msg.id;
	client.emit("msg:preview", {id, preview});
}

function getRequestHeaders(headers) {
	const formattedHeaders = {
		"User-Agent": "Mozilla/5.0 (compatible; The Lounge IRC Client; +https://github.com/thelounge/thelounge)",
		"Accept": headers.accept || "*/*",
	};

	if (headers.language) {
		formattedHeaders["Accept-Language"] = headers.language;
	}

	return formattedHeaders;
}

function fetch(uri, headers, cb) {
	let req;

	try {
		req = request.get({
			url: uri,
			maxRedirects: 5,
			timeout: 5000,
			headers: getRequestHeaders(headers),
		});
	} catch (e) {
		return cb(null, e);
	}

	const buffers = [];
	let length = 0;
	let limit = Helper.config.prefetchMaxImageSize * 1024;

	req
		.on("response", function(res) {
			if (/^image\/.+/.test(res.headers["content-type"])) {
				// response is an image
				// if Content-Length header reports a size exceeding the prefetch limit, abort fetch
				const contentLength = parseInt(res.headers["content-length"], 10) || 0;

				if (contentLength > limit) {
					req.abort();
				}
			} else if (mediaTypeRegex.test(res.headers["content-type"])) {
				// We don't need to download the file any further after we received content-type header
				req.abort();
			} else {
				// if not image, limit download to 50kb, since we need only meta tags
				// twitter.com sends opengraph meta tags within ~20kb of data for individual tweets
				limit = 1024 * 50;
			}
		})
		.on("error", (e) => cb(null, e))
		.on("data", (data) => {
			length += data.length;
			buffers.push(data);

			if (length > limit) {
				req.abort();
			}
		})
		.on("end", () => {
			if (req.response.statusCode < 200 || req.response.statusCode > 299) {
				return cb(null, new Error(`HTTP ${req.response.statusCode}`));
			}

			let type = "";
			let size = parseInt(req.response.headers["content-length"], 10) || length;

			if (size < length) {
				size = length;
			}

			if (req.response.headers["content-type"]) {
				type = req.response.headers["content-type"].split(/ *; */).shift();
			}

			const data = Buffer.concat(buffers, length);
			cb({data, type, size});
		});
}

function normalizeURL(header) {
	return URI(header).normalize().toString();
}
