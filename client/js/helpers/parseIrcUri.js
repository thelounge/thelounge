"use strict";

export default (stringUri) => {
	const data = {};

	try {
		// https://tools.ietf.org/html/draft-butcher-irc-url-04
		const uri = new URL(stringUri);

		// Replace protocol with a "special protocol" (that's what it's called in WHATWG spec)
		// So that the uri can be properly parsed
		if (uri.protocol === "irc:") {
			uri.protocol = "http:";

			if (!uri.port) {
				uri.port = 6667;
			}

			data.tls = false;
		} else if (uri.protocol === "ircs:") {
			uri.protocol = "https:";

			if (!uri.port) {
				uri.port = 6697;
			}

			data.tls = true;
		} else {
			return;
		}

		if (!uri.hostname) {
			return {};
		}

		data.host = data.name = uri.hostname;
		data.port = uri.port;
		data.username = decodeURIComponent(uri.username);
		data.password = decodeURIComponent(uri.password);

		let channel = "";

		if (uri.pathname.length > 1) {
			channel = uri.pathname;
		} else if (uri.hash.length > 1) {
			channel = uri.hash;
		}

		if (channel) {
			channel = channel.substr(1); // remove / or #

			const index = channel.indexOf(",");

			if (index > -1) {
				channel = channel.substring(0, index);
			}
		}

		data.join = channel;
	} catch (e) {
		// do nothing on invalid uri
	}

	return data;
};
