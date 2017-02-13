const Handlebars = require("handlebars/runtime");
const URI = require("urijs");
const parseStyle = require("ircmessageparser/lib/parseStyle");
const findChannels = require("ircmessageparser/lib/findChannels");
const merge = require("ircmessageparser/lib/merge");


const commonSchemes = [
	"http", "https",
	"ftp", "sftp",
	"smb", "file",
	"irc", "ircs",
	"svn", "git",
	"steam", "mumble", "ts3server",
	"svn+ssh", "ssh",
];

function findLinks(text) {

	var result = [];
	var lastPosition = 0;

	URI.withinString(text, function(url, start, end) {

		// v-- fix: url was modified and does not match input string -> cant be mapped
		if (text.indexOf(url, lastPosition) < 0) {
			return;
		}
		// ^-- /fix: url was modified and does not match input string -> cant be mapped

		// v-- fix: use prefered scheme
		const parsed = URI(url);
		const parsedScheme = parsed.scheme().toLowerCase();
		const matchedScheme = commonSchemes.find(scheme => parsedScheme.endsWith(scheme));

		if (matchedScheme) {
			const prefix = parsedScheme.length - matchedScheme.length;
			start += prefix;
			url = url.slice(prefix);
		}
		// ^-- /fix: use prefered scheme

		result.push({
			start: start,
			end: end,
			link: url
		});
	});

	return result;
}

function createFragment(fragment) {
	let className = "";
	if (fragment.bold) {
		className += " irc-bold";
	}
	if (fragment.textColor !== undefined) {
		className += " irc-fg" + fragment.textColor;
	}
	if (fragment.bgColor !== undefined) {
		className += " irc-bg" + fragment.bgColor;
	}
	if (fragment.italic) {
		className += " irc-italic";
	}
	if (fragment.underline) {
		className += " irc-underline";
	}
	const escapedText = Handlebars.Utils.escapeExpression(fragment.text);
	if (className) {
		return "<span class='" + className.trim() + "'>" + escapedText + "</span>";
	}
	return escapedText;
}

module.exports = function parse(text) {
	const styleFragments = parseStyle(text);
	const cleanText = styleFragments.map(fragment => fragment.text).join("");

	const channelPrefixes = ["#", "&"]; // RPL_ISUPPORT.CHANTYPES
	const userModes = ["!", "@", "%", "+"]; // RPL_ISUPPORT.PREFIX
	const channelParts = findChannels(cleanText, channelPrefixes, userModes);

	const linkParts = findLinks(cleanText);

	const parts = channelParts.concat(linkParts);

	return merge(parts, styleFragments).map(textPart => {
		const fragments = textPart.fragments.map(createFragment).join("");

		if (textPart.link) {
			const escapedLink = Handlebars.Utils.escapeExpression(textPart.link);
			return (
				"<a href='" + escapedLink + "' target='_blank' rel='noopener'>" +
					fragments +
				"</a>");
		} else if (textPart.channel) {
			const escapedChannel = Handlebars.Utils.escapeExpression(textPart.channel);
			return (
				"<span class='inline-channel' role='button' tabindex='0' data-chan='" + escapedChannel + "'>" +
					fragments +
				"</span>");
		}

		return fragments;
	}).join("");
};
