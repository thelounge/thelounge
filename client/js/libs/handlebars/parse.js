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
const LinkPreviewFileSize = require("../../../components/LinkPreviewFileSize.vue").default;
const InlineChannel = require("../../../components/InlineChannel.vue").default;
const emojiModifiersRegex = /[\u{1f3fb}-\u{1f3ff}]/gu;

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

	const data = {};
	let hasData = false;

	if (classes.length > 0) {
		hasData = true;
		data.class = classes;
	}

	if (fragment.hexColor) {
		hasData = true;
		data.style = {
			color: `#${fragment.hexColor}`,
		};

		if (fragment.hexBgColor) {
			data.style["background-color"] = `#${fragment.hexBgColor}`;
		}
	}

	return hasData ? createElement("span", data, fragment.text) : fragment.text;
}

// Transform an IRC message potentially filled with styling control codes, URLs,
// nicknames, and channels into a string of HTML elements to display on the client.
module.exports = function parse(createElement, text, message = undefined, network = undefined) {
	// Extract the styling information and get the plain text version from it
	const styleFragments = parseStyle(text);
	const cleanText = styleFragments.map((fragment) => fragment.text).join("");

	// On the plain text, find channels and URLs, returned as "parts". Parts are
	// arrays of objects containing start and end markers, as well as metadata
	// depending on what was found (channel or link).
	const channelPrefixes = network ? network.serverOptions.CHANTYPES : ["#", "&"];
	const userModes = network ? network.serverOptions.PREFIX : ["!", "@", "%", "+"];
	const channelParts = findChannels(cleanText, channelPrefixes, userModes);
	const linkParts = findLinks(cleanText);
	const emojiParts = findEmoji(cleanText);
	const nameParts = findNames(cleanText, message ? message.users || [] : []);

	const parts = channelParts
		.concat(linkParts)
		.concat(emojiParts)
		.concat(nameParts);

	// Merge the styling information with the channels / URLs / nicks / text objects and
	// generate HTML strings with the resulting fragments
	return merge(parts, styleFragments, cleanText).map((textPart) => {
		const fragments = textPart.fragments.map((fragment) =>
			createFragment(fragment, createElement)
		);

		// Wrap these potentially styled fragments with links and channel buttons
		if (textPart.link) {
			const preview =
				message &&
				message.previews &&
				message.previews.find((p) => p.link === textPart.link);
			const link = createElement(
				"a",
				{
					attrs: {
						href: textPart.link,
						dir: preview ? null : "auto",
						target: "_blank",
						rel: "noopener",
					},
				},
				fragments
			);

			if (!preview) {
				return link;
			}

			const linkEls = [link];

			if (preview.size > 0) {
				linkEls.push(
					createElement(LinkPreviewFileSize, {
						props: {
							size: preview.size,
						},
					})
				);
			}

			linkEls.push(
				createElement(LinkPreviewToggle, {
					props: {
						link: preview,
					},
				})
			);

			// We wrap the link, size, and the toggle button into <span dir="auto">
			// to correctly keep the left-to-right order of these elements
			return createElement(
				"span",
				{
					attrs: {
						dir: "auto",
					},
				},
				linkEls
			);
		} else if (textPart.channel) {
			return createElement(
				InlineChannel,
				{
					props: {
						channel: textPart.channel,
					},
				},
				fragments
			);
		} else if (textPart.emoji) {
			const emojiWithoutModifiers = textPart.emoji.replace(emojiModifiersRegex, "");
			const title = emojiMap[emojiWithoutModifiers]
				? `Emoji: ${emojiMap[emojiWithoutModifiers]}`
				: null;

			return createElement(
				"span",
				{
					class: ["emoji"],
					attrs: {
						role: "img",
						"aria-label": title,
						title: title,
					},
				},
				fragments
			);
		} else if (textPart.nick) {
			return createElement(
				"span",
				{
					class: ["user", colorClass(textPart.nick)],
					attrs: {
						role: "button",
						dir: "auto",
						"data-name": textPart.nick,
					},
				},
				fragments
			);
		}

		return fragments;
	});
};
