"use strict";

const parseStyle = require("./ircmessageparser/parseStyle");
const findChannels = require("./ircmessageparser/findChannels");
const findLinks = require("./ircmessageparser/findLinks");
const findEmoji = require("./ircmessageparser/findEmoji");
const findNames = require("./ircmessageparser/findNames");
const merge = require("./ircmessageparser/merge");
const colorClass = require("./colorClass");
const emojiMap = require("../fullnamemap.json");
const LinkPreviewToggle = require("../../../components/LinkPreviewToggle.vue").default;

// Create an HTML `span` with styling information for a given fragment
function createFragment(fragment, createElement) {
	const classes = [];

	if (fragment.bold) {
		classes.push("irc-bold");
	}

	if (fragment.textColor !== undefined) {
		classes.push("irc-fg" + fragment.textColor);
	}

	if (fragment.bgColor !== undefined) {
		classes.push("irc-bg" + fragment.bgColor);
	}

	if (fragment.italic) {
		classes.push("irc-italic");
	}

	if (fragment.underline) {
		classes.push("irc-underline");
	}

	if (fragment.strikethrough) {
		classes.push("irc-strikethrough");
	}

	if (fragment.monospace) {
		classes.push("irc-monospace");
	}

	if (classes.length === 0 && !fragment.hexColor) {
		return fragment.text;
	}

	return createElement("span", {
		class: classes,
		style: {
			"color": `#${fragment.hexColor}`,
			"background-color": fragment.hexBgColor ? `#${fragment.hexBgColor}` : null,
		},
	}, fragment.text);
}

// Transform an IRC message potentially filled with styling control codes, URLs,
// nicknames, and channels into a string of HTML elements to display on the client.
module.exports = function parse(createElement, text, message = null) {
	// Extract the styling information and get the plain text version from it
	const styleFragments = parseStyle(text);
	const cleanText = styleFragments.map((fragment) => fragment.text).join("");

	// On the plain text, find channels and URLs, returned as "parts". Parts are
	// arrays of objects containing start and end markers, as well as metadata
	// depending on what was found (channel or link).
	const channelPrefixes = ["#", "&"]; // TODO Channel prefixes should be RPL_ISUPPORT.CHANTYPES
	const userModes = ["!", "@", "%", "+"]; // TODO User modes should be RPL_ISUPPORT.PREFIX
	const channelParts = findChannels(cleanText, channelPrefixes, userModes);
	const linkParts = findLinks(cleanText);
	const emojiParts = findEmoji(cleanText);
	const nameParts = findNames(cleanText, message ? (message.users || []) : []);

	const parts = channelParts
		.concat(linkParts)
		.concat(emojiParts)
		.concat(nameParts);

	// Merge the styling information with the channels / URLs / nicks / text objects and
	// generate HTML strings with the resulting fragments
	return merge(parts, styleFragments, cleanText).map((textPart) => {
		const fragments = textPart.fragments.map((fragment) => createFragment(fragment, createElement));

		// Wrap these potentially styled fragments with links and channel buttons
		if (textPart.link) {
			const preview = message && message.previews.find((p) => p.link === textPart.link);
			const link = createElement("a", {
				attrs: {
					href: textPart.link,
					target: "_blank",
					rel: "noopener",
				},
			}, fragments);

			if (!preview) {
				return link;
			}

			return [link, createElement(LinkPreviewToggle, {
				class: ["toggle-button", "toggle-preview"],
				props: {
					link: preview,
				},
			}, fragments)];
		} else if (textPart.channel) {
			return createElement("span", {
				class: [
					"inline-channel",
				],
				attrs: {
					"role": "button",
					"tabindex": 0,
					"data-chan": textPart.channel,
				},
			}, fragments);
		} else if (textPart.emoji) {
			return createElement("span", {
				class: [
					"emoji",
				],
				attrs: {
					"role": "img",
					"aria-label": emojiMap[textPart.emoji] ? `Emoji: ${emojiMap[textPart.emoji]}` : null,
				},
			}, fragments);
		} else if (textPart.nick) {
			return createElement("span", {
				class: [
					"user",
					colorClass(textPart.nick),
				],
				attrs: {
					"role": "button",
					"data-name": textPart.nick,
				},
			}, fragments);
		}

		return fragments;
	});
};
