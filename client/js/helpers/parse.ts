// TODO: type
// @ts-nocheck

import {h as createElement, VNode} from "vue";
import parseStyle from "./ircmessageparser/parseStyle";
import findChannels from "./ircmessageparser/findChannels";
import {findLinks} from "../../../shared/linkify";
import findEmoji from "./ircmessageparser/findEmoji";
import findNames from "./ircmessageparser/findNames";
import merge, {MergedParts} from "./ircmessageparser/merge";
import emojiMap from "./fullnamemap.json";
import LinkPreviewToggle from "../../components/LinkPreviewToggle.vue";
import LinkPreviewFileSize from "../../components/LinkPreviewFileSize.vue";
import InlineChannel from "../../components/InlineChannel.vue";
import Username from "../../components/Username.vue";
import {ClientMessage, ClientNetwork} from "../types";

const emojiModifiersRegex = /[\u{1f3fb}-\u{1f3ff}]|\u{fe0f}/gu;

type Fragment = {
	class?: string[];
	text?: string;
};

type StyledFragment = Fragment & {
	textColor?: string;
	bgColor?: string;
	hexColor?: string;
	hexBgColor?: string;

	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	monospace?: boolean;
	strikethrough?: boolean;
};

// Build the class list and inline style shared by styled and emoji fragments
function fragmentStyle(fragment: StyledFragment): {
	classes: string[];
	style?: Record<string, string>;
} {
	const classes: string[] = [];

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

	let style: Record<string, string> | undefined;

	if (fragment.hexColor) {
		style = {
			color: `#${fragment.hexColor}`,
		};

		if (fragment.hexBgColor) {
			style["background-color"] = `#${fragment.hexBgColor}`;
		}
	}

	return {classes, style};
}

// Create an HTML `span` with styling information for a given fragment
function createFragment(fragment: StyledFragment): VNode | string | undefined {
	const {classes, style} = fragmentStyle(fragment);

	const data: {
		class?: string[];
		style?: Record<string, string>;
	} = {};

	let hasData = false;

	if (classes.length > 0) {
		hasData = true;
		data.class = classes;
	}

	if (style) {
		hasData = true;
		data.style = style;
	}

	return hasData ? createElement("span", data, fragment.text) : fragment.text;
}

// Create an emoji `span` (always carrying the `emoji` class) for a fragment whose
// text is a single emoji, merging in any surrounding style so that styled emoji
// produce a single span instead of nested ones.
function createEmojiFragment(fragment: StyledFragment): VNode {
	const {classes, style} = fragmentStyle(fragment);
	const emojiWithoutModifiers = (fragment.text || "").replace(emojiModifiersRegex, "");
	const title = emojiMap[emojiWithoutModifiers]
		? `Emoji: ${emojiMap[emojiWithoutModifiers]}`
		: null;

	const data: {
		role: string;
		"aria-label": string | null;
		title: string | null;
		class: string[];
		style?: Record<string, string>;
	} = {
		role: "img",
		"aria-label": title,
		title: title,
		class: ["emoji", ...classes],
	};

	if (style) {
		data.style = style;
	}

	return createElement("span", data, fragment.text);
}

// Split a fragment into emoji and non-emoji runs so that emoji anywhere in the
// visible text (including inside links, channels and nicks) get the `emoji` class,
// while attributes such as a link's `href` remain untouched.
function createFragments(fragment: StyledFragment): (VNode | string | undefined)[] {
	const text = fragment.text;

	if (!text) {
		return [createFragment(fragment)];
	}

	const emojis = findEmoji(text);

	if (emojis.length === 0) {
		return [createFragment(fragment)];
	}

	const result: (VNode | string | undefined)[] = [];
	let position = 0;

	for (const emoji of emojis) {
		if (emoji.start > position) {
			result.push(createFragment({...fragment, text: text.slice(position, emoji.start)}));
		}

		result.push(createEmojiFragment({...fragment, text: text.slice(emoji.start, emoji.end)}));
		position = emoji.end;
	}

	if (position < text.length) {
		result.push(createFragment({...fragment, text: text.slice(position)}));
	}

	return result;
}

// Transform an IRC message potentially filled with styling control codes, URLs,
// nicknames, and channels into a string of HTML elements to display on the client.
function parse(text: string, message?: ClientMessage, network?: ClientNetwork) {
	// Each line of a draft/multiline message is its own PRIVMSG on the wire, so
	// parse them separately and join them with a <br>, which keeps per-line
	// styling and lets the text wrap as usual.
	if (text && text.includes("\n")) {
		return text
			.split("\n")
			.flatMap((line, i) =>
				i === 0
					? parseLine(line, message, network)
					: [createElement("br"), ...parseLine(line, message, network)]
			);
	}

	return parseLine(text, message, network);
}

function parseLine(text: string, message?: ClientMessage, network?: ClientNetwork) {
	// Extract the styling information and get the plain text version from it
	const styleFragments = parseStyle(text);
	const cleanText = styleFragments.map((fragment) => fragment.text).join("");

	// On the plain text, find channels and URLs, returned as "parts". Parts are
	// arrays of objects containing start and end markers, as well as metadata
	// depending on what was found (channel or link).
	const channelPrefixes = network ? network.serverOptions.CHANTYPES : ["#", "&"];
	const userModes = network
		? network.serverOptions.PREFIX?.prefix?.map((pref) => pref.symbol)
		: ["!", "@", "%", "+"];
	const channelParts = findChannels(cleanText, channelPrefixes, userModes);
	const linkParts = findLinks(cleanText);
	const nameParts = findNames(cleanText, message ? message.users || [] : []);

	const parts = (channelParts as MergedParts).concat(linkParts).concat(nameParts);

	// Merge the styling information with the channels / URLs / nicks / text objects and
	// generate HTML strings with the resulting fragments. Emoji are wrapped at the
	// fragment level so they keep the `emoji` class even inside links, channels and nicks.
	return merge(parts, styleFragments, cleanText).map((textPart) => {
		const fragments = textPart.fragments.flatMap((fragment) => createFragments(fragment));

		// Wrap these potentially styled fragments with links and channel buttons
		if (textPart.link) {
			const preview =
				message &&
				message.previews &&
				message.previews.find((p) => p.link === textPart.link);
			const link = createElement(
				"a",
				{
					href: textPart.link,
					dir: preview ? null : "auto",
					target: "_blank",
					rel: "noopener",
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
						size: preview.size,
					})
				);
			}

			linkEls.push(
				createElement(LinkPreviewToggle, {
					link: preview,
					message: message,
				})
			);

			// We wrap the link, size, and the toggle button into <span dir="auto">
			// to correctly keep the left-to-right order of these elements
			return createElement(
				"span",
				{
					dir: "auto",
				},
				linkEls
			);
		} else if (textPart.channel) {
			return createElement(
				InlineChannel,
				{
					channel: textPart.channel,
				},
				{
					default: () => fragments,
				}
			);
		} else if (textPart.nick) {
			return createElement(
				Username,
				{
					user: {
						nick: textPart.nick,
					},
					dir: "auto",
				},
				{
					default: () => fragments,
				}
			);
		}

		return fragments;
	});
}

export default parse;
