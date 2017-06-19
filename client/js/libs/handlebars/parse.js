"use strict";

const Handlebars = require("handlebars/runtime");
const parseStyle = require("./ircmessageparser/parseStyle");
const findChannels = require("./ircmessageparser/findChannels");
const findLinks = require("./ircmessageparser/findLinks");
const merge = require("./ircmessageparser/merge");

// Create an HTML `span` with styling information for a given fragment
function createFragment(fragment) {
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

	let attributes = classes.length ? ` class="${classes.join(" ")}"` : "";
	const escapedText = Handlebars.Utils.escapeExpression(fragment.text);

	if (fragment.hexColor) {
		attributes += ` style="color:#${fragment.hexColor}`;

		if (fragment.hexBgColor) {
			attributes += `;background-color:#${fragment.hexBgColor}`;
		}

		attributes += "\"";
	}

	if (attributes.length) {
		return `<span${attributes}>${escapedText}</span>`;
	}

	return escapedText;
}

// Transform an IRC message potentially filled with styling control codes, URLs
// and channels into a string of HTML elements to display on the client.
module.exports = function parse(text) {
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

	// Sort all parts identified based on their position in the original text
	const parts = channelParts
		.concat(linkParts)
		.sort((a, b) => a.start - b.start);

	// Merge the styling information with the channels / URLs / text objects and
	// generate HTML strings with the resulting fragments
	return merge(parts, styleFragments).map((textPart) => {
		// Create HTML strings with styling information
		const fragments = textPart.fragments.map(createFragment).join("");

		// Wrap these potentially styled fragments with links and channel buttons
		if (textPart.link) {
			const escapedLink = Handlebars.Utils.escapeExpression(textPart.link);
			return `<a href="${escapedLink}" target="_blank" rel="noopener">${fragments}</a>`;
		} else if (textPart.channel) {
			const escapedChannel = Handlebars.Utils.escapeExpression(textPart.channel);
			return `<span class="inline-channel" role="button" tabindex="0" data-chan="${escapedChannel}">${fragments}</span>`;
		}

		return fragments;
	}).join("");
};
