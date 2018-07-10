"use strict";

const cheerio = require("cheerio");
const request = require("request");
const URL = require("url").URL;
const mime = require("mime-types");
const Helper = require("../../helper");
const cleanIrcMessage = require("../../../client/js/libs/handlebars/ircmessageparser/cleanIrcMessage");
const findLinks = require("../../../client/js/libs/handlebars/ircmessageparser/findLinks");
const storage = require("../storage");
const currentFetchPromises = new Map();
const mediaTypeRegex = /^(audio|video)\/.+/;

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

	msg.previews = findLinks(cleanText).reduce((cleanLinks, link) => {
		const url = normalizeURL(link.link);

		// If the URL is invalid and cannot be normalized, don't fetch it
		if (url === null) {
			return cleanLinks;
		}

		// If there are too many urls in this message, only fetch first X valid links
		if (cleanLinks.length > 4) {
			return cleanLinks;
		}

		// Do not fetch duplicate links twice
		if (cleanLinks.some((l) => l.link === link.link)) {
			return cleanLinks;
		}

		const preview = {
			type: "loading",
			head: "",
			body: "",
			thumb: "",
			link: link.link, // Send original matched link to the client
			shown: true,
		};

		cleanLinks.push(preview);

		fetch(url, {
			accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			language: client.language,
		}).then((res) => {
			parse(msg, chan, preview, res, client);
		}).catch((err) => {
			preview.type = "error";
			preview.error = "message";
			preview.message = err.message;
			handlePreview(client, chan, msg, preview, null);
		});

		return cleanLinks;
	}, []);
};

function parseHtml(preview, res, client) {
	return new Promise((resolve) => {
		const $ = cheerio.load(res.data);

		return parseHtmlMedia($, preview, client)
			.then((newRes) => resolve(newRes))
			.catch(() => {
				preview.type = "link";
				preview.head =
					$('meta[property="og:title"]').attr("content")
					|| $("head > title, title").first().text()
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

				// Make sure thumbnail is a valid and absolute url
				if (preview.thumb.length) {
					preview.thumb = normalizeURL(preview.thumb, preview.link) || "";
				}

				// Verify that thumbnail pic exists and is under allowed size
				if (preview.thumb.length) {
					fetch(preview.thumb, {language: client.language}).then((resThumb) => {
						if (resThumb === null
						|| !(/^image\/.+/.test(resThumb.type))
						|| resThumb.size > (Helper.config.prefetchMaxImageSize * 1024)) {
							preview.thumb = "";
						}

						resolve(resThumb);
					}).catch(() => {
						preview.thumb = "";
						resolve(null);
					});
				} else {
					resolve(res);
				}
			});
	});
}

function parseHtmlMedia($, preview, client) {
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
					let mediaUrl = $($(`meta[property="og:${type}"]`).get(i)).attr("content");

					// Make sure media is a valid url
					mediaUrl = normalizeURL(mediaUrl, preview.link, true);

					// Make sure media is a valid url
					if (!mediaUrl) {
						return;
					}

					foundMedia = true;

					fetch(mediaUrl, {
						accept: type === "video" ?
							"video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5" :
							"audio/webm, audio/ogg, audio/wav, audio/*;q=0.9, application/ogg;q=0.7, video/*;q=0.6; */*;q=0.5",
						language: client.language,
					}).then((resMedia) => {
						if (resMedia === null || !mediaTypeRegex.test(resMedia.type)) {
							return reject();
						}

						preview.type = type;
						preview.media = mediaUrl;
						preview.mediaType = resMedia.type;

						resolve(resMedia);
					}).catch(reject);

					return false;
				}
			});
		});

		if (!foundMedia) {
			reject();
		}
	});
}

function parse(msg, chan, preview, res, client) {
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
		return removePreview(msg, preview);
	}

	if (!promise) {
		return handlePreview(client, chan, msg, preview, res);
	}

	promise.then((newRes) => handlePreview(client, chan, msg, preview, newRes));
}

function handlePreview(client, chan, msg, preview, res) {
	if (!preview.thumb.length || !Helper.config.prefetchStorage) {
		return emitPreview(client, chan, msg, preview);
	}

	// Get the correct file extension for the provided content-type
	// This is done to prevent user-input being stored in the file name (extension)
	const extension = mime.extension(res.type);

	if (!extension) {
		// For link previews, drop the thumbnail
		// For other types, do not display preview at all
		if (preview.type !== "link") {
			return removePreview(msg, preview);
		}

		preview.thumb = "";
		return emitPreview(client, chan, msg, preview);
	}

	storage.store(res.data, extension, (uri) => {
		preview.thumb = uri;

		emitPreview(client, chan, msg, preview);
	});
}

function emitPreview(client, chan, msg, preview) {
	// If there is no title but there is preview or description, set title
	// otherwise bail out and show no preview
	if (!preview.head.length && preview.type === "link") {
		if (preview.thumb.length || preview.body.length) {
			preview.head = "Untitled page";
		} else {
			return removePreview(msg, preview);
		}
	}

	client.emit("msg:preview", {
		id: msg.id,
		chan: chan.id,
		preview: preview,
	});
}

function removePreview(msg, preview) {
	// If a preview fails to load, remove the link from msg object
	// So that client doesn't attempt to display an preview on page reload
	const index = msg.previews.indexOf(preview);

	if (index > -1) {
		msg.previews.splice(index, 1);
	}
}

function getRequestHeaders(headers) {
	const formattedHeaders = {
		"User-Agent": "Mozilla/5.0 (compatible; The Lounge IRC Client; +https://github.com/thelounge/thelounge)",
		"Accept": headers.accept || "*/*",
		"X-Purpose": "preview",
	};

	if (headers.language) {
		formattedHeaders["Accept-Language"] = headers.language;
	}

	return formattedHeaders;
}

function fetch(uri, headers) {
	// Stringify the object otherwise the objects won't compute to the same value
	const cacheKey = JSON.stringify([uri, headers]);
	let promise = currentFetchPromises.get(cacheKey);

	if (promise) {
		return promise;
	}

	promise = new Promise((resolve, reject) => {
		let req;

		try {
			req = request.get({
				url: uri,
				maxRedirects: 5,
				timeout: 5000,
				headers: getRequestHeaders(headers),
			});
		} catch (e) {
			return reject(e);
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
			.on("error", (e) => reject(e))
			.on("data", (data) => {
				length += data.length;
				buffers.push(data);

				if (length > limit) {
					req.abort();
				}
			})
			.on("end", () => {
				if (req.response.statusCode < 200 || req.response.statusCode > 299) {
					return reject(new Error(`HTTP ${req.response.statusCode}`));
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
				resolve({data, type, size});
			});
	});

	const removeCache = () => currentFetchPromises.delete(cacheKey);

	promise.then(removeCache).catch(removeCache);

	currentFetchPromises.set(cacheKey, promise);

	return promise;
}

function normalizeURL(link, baseLink, disallowHttp = false) {
	try {
		const url = new URL(link, baseLink);

		// Only fetch http and https links
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return null;
		}

		if (disallowHttp && url.protocol === "http:") {
			return null;
		}

		// Do not fetch links without hostname or ones that contain authorization
		if (!url.hostname || url.username || url.password) {
			return null;
		}

		// Drop hash from the url, if any
		url.hash = "";

		return url.toString();
	} catch (e) {
		// if an exception was thrown, the url is not valid
	}

	return null;
}
