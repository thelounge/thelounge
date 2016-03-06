Handlebars.registerHelper("parse", function(msg) {
	return parseMessage(msg, 0);
});


/**
 * Parses an IRC message and converts it into HTML
 */
function parseMessage(msg, parser) {
	var processed = false;

	/**
	 * Parses URLs
	 *
	 * https://tools.ietf.org/html/rfc3986#section-2
	 */
	function parseUrl(msg) {
		return msg.replace(
			/^(.*?<?)([a-z]+:\/\/[a-z0-9-._~:\/?#[\]@!$&'()*+,;=]+)(>?.*)$/i,
			function(match, before, url, after) {
				url = parseText(url);
				return parseMessage(before, parser)
					+ "<a href='"+ url + "' target='_blank'>" + url + "</a>"
					+ parseMessage(after, parser);
			}
		);
	}


	/**
	 * Parses channel names and make them clickable
	 *
	 * Channels names are strings (beginning with a '&', '#', '+' or '!'
	 * character) of length up to fifty (50) characters.  Apart from the
	 * requirement that the first character is either '&', '#', '+' or '!',
	 * the only restriction on a channel name is that it SHALL NOT contain
	 * any spaces (' '), a control G (^G or ASCII 7), a comma (',').  Space
	 * is used as parameter separator and command is used as a list item
	 * separator by the protocol).  A colon (':') can also be used as a
	 * delimiter for the channel mask.  Channel names are case insensitive.
	 *
	 * https://tools.ietf.org/html/rfc2812#section-1.3
	 */
	function parseInlineChannel(msg) {
		return msg.replace(
			/^(.*)([#&+!][^\s\x07,]{1,49})(.*)$/,
			function(match, before, channel, after) {
				channel = parseText(channel);
				return parseMessage(before, parser)
					+ "<span class='inline-channel' role='button' tabindex='0' data-chan='"
						+ channel + "'>" + channel + "</span>"
					+ parseMessage(after, parser);
			}
		);
	}


	/**
	 * Parse mIRC formatting (bold, italic and underline)
	 * https://github.com/myano/jenni/wiki/IRC-String-Formatting
	 */
	function parseFormatting(msg) {
		return msg.replace(
			/^(.*?)(\x02|\x1D|\x1F)([^\x0F\2]+)[\x0F\2]?(.*)$/,
			function(match, before, format, formatted, after) {
				processed = true;

				var classes = {
					"\x02": "irc-bold",
					"\x1D": "irc-italic",
					"\x1F": "irc-underline"
				};

				return parseMessage(before, parser+1)
					+ "<span class='" + classes[format] + "'>"
					+ parseMessage(formatted, parser)
					+ "</span>"
					+ parseMessage(after, parser);
			}
		);
	}


	/**
	 * Parse mIRC color formatting
	 * https://github.com/myano/jenni/wiki/IRC-String-Formatting
	 */
	function parseColors(msg) {
		return msg.replace(
			/^(.*?)\x03([0-9]{1,2})(?:,([0-9]{1,2}))?([^\x0F\x03]+)\x0F?(.*)$/,
			function(match, before, fg, bg, formatted, after) {
				processed = true;

				var classes = "irc-fg" + parseInt(fg, 10);

				if (bg) {
					classes += " irc-bg" + parseInt(bg, 10);
				}

				return parseMessage(before, parser+1)
					+ "<span class='" + classes + "'>"
					+ parseMessage(formatted, parser)
					+ "</span>"
					+ parseMessage(after, parser);
			}
		);
	}


	/**
	 * Parses plaintext into safe HTML
	 */
	function parseText(msg) {
		processed = true;
		return msg.replace(/[&<>"'`=]/g, function(c) {
			return "&#" + c.charCodeAt(0) + ";";
		}).replace(/[\x02\x03\x1D\x1F\x0F]/g, "");
	}


	// Define which parsers to use and their order
	var parsers = [
		parseUrl,
		parseInlineChannel,
		parseFormatting,
		parseColors,
		parseText
	];

	// Pass the input text through all parsers
	while (processed === false && parser < parsers.length) {
		msg = parsers[parser](msg);
		parser++;
	}

	return msg;
}
