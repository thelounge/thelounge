import parseStyle from "./ircmessageparser/parseStyle";
import findChannels from "./ircmessageparser/findChannels";
import {findLinks} from "./ircmessageparser/findLinks";
import findEmoji from "./ircmessageparser/findEmoji";
import findNames from "./ircmessageparser/findNames";
import merge from "./ircmessageparser/merge";
import emojiMap from "./fullnamemap.json";
import LinkPreviewToggle from "../../components/LinkPreviewToggle.vue";
import LinkPreviewFileSize from "../../components/LinkPreviewFileSize.vue";
import InlineChannel from "../../components/InlineChannel.vue";
import Username from "../../components/Username.vue";
import {h as createElement, VNode} from "vue";
import {ClientMessage, ClientNetwork} from "../types";

const emojiModifiersRegex = /[\u{1f3fb}-\u{1f3ff}]|\u{fe0f}/gu;

// Create an HTML `span` with styling information for a given fragment
// TODO: remove any
function createFragment(fragment: Record<any, any>) {
	const classes: string[] = [];

	if (fragment.bold) {
		classes.push("irc-bold");
	}

	if (fragment.textColor !== undefined) {
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		classes.push("irc-fg" + fragment.textColor);
	}

	if (fragment.bgColor !== undefined) {
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
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

	const data = {} as Record<string, any>;
	let hasData = false;

	if (classes.length > 0) {
		hasData = true;
		data.class = classes;
	}

	if (fragment.hexColor) {
		hasData = true;
		data.style = {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			color: `#${fragment.hexColor}`,
		};

		if (fragment.hexBgColor) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			data.style["background-color"] = `#${fragment.hexBgColor}`;
		}
	}

	return hasData ? createElement("span", data, fragment.text) : (fragment.text as string);
}

// Transform an IRC message potentially filled with styling control codes, URLs,
// nicknames, and channels into a string of HTML elements to display on the client.
function parse(text: string, message?: ClientMessage, network?: ClientNetwork) {
	// Extract the styling information and get the plain text version from it
	const styleFragments = parseStyle(text);
	const cleanText = styleFragments.map((fragment) => fragment.text).join("");

	// On the plain text, find channels and URLs, returned as "parts". Parts are
	// arrays of objects containing start and end markers, as well as metadata
	// depending on what was found (channel or link).
	const channelPrefixes = network?.serverOptions?.CHANTYPES || ["#", "&"];
	const userModes = network?.serverOptions?.PREFIX.symbols || ["!", "@", "%", "+"];
	const channelParts = findChannels(cleanText, channelPrefixes, userModes);
	const linkParts = findLinks(cleanText);
	const emojiParts = findEmoji(cleanText);
	// TODO: remove type casting.
	const nameParts = findNames(cleanText, message ? (message.users as string[]) || [] : []);

	const parts = [...channelParts, ...linkParts, ...emojiParts, ...nameParts];

	// Merge the styling information with the channels / URLs / nicks / text objects and
	// generate HTML strings with the resulting fragments
	return merge(parts, styleFragments, cleanText).map((textPart) => {
		const fragments = textPart.fragments?.map((fragment) => createFragment(fragment)) as (
			| VNode
			| string
		)[];

		// Wrap these potentially styled fragments with links and channel buttons
		// TODO: fix typing
		if ("link" in textPart) {
			const preview =
				message &&
				message.previews &&
				// @ts-ignore
				message.previews.find((p) => p.link === textPart.link);
			const link = createElement(
				"a",
				{
					attrs: {
						// @ts-ignore
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
					// @ts-ignore
					createElement(LinkPreviewFileSize, {
						props: {
							size: preview.size,
						},
					})
				);
			}

			linkEls.push(
				// @ts-ignore
				createElement(LinkPreviewToggle, {
					props: {
						link: preview,
						message: message,
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
			// @ts-ignore
		} else if (textPart.channel) {
			return createElement(
				InlineChannel,
				{
					props: {
						// @ts-ignore
						channel: textPart.channel,
					},
				},
				fragments
			);
			// @ts-ignore
		} else if (textPart.emoji) {
			// @ts-ignore
			const emojiWithoutModifiers = textPart.emoji.replace(emojiModifiersRegex, "");
			const title = emojiMap[emojiWithoutModifiers]
				? `Emoji: ${emojiMap[emojiWithoutModifiers] as string}`
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
			// @ts-ignore
		} else if (textPart.nick) {
			return createElement(
				// @ts-ignore
				Username,
				{
					props: {
						user: {
							// @ts-ignore
							nick: textPart.nick,
						},
						// @ts-ignore
						channel: messageChannel,
						network,
					},
					attrs: {
						dir: "auto",
					},
				},
				fragments
			);
		}

		return fragments;
	});
}

export default parse;
