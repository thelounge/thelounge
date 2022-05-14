import emojiRegExp from "emoji-regex";
import {Part} from "./merge";

const regExp = emojiRegExp();

function findEmoji(text: string) {
	const result: EmojiPart[] = [];
	let match;

	while ((match = regExp.exec(text))) {
		result.push({
			start: match.index,
			end: match.index + match[0].length,
			emoji: match[0],
		});
	}

	return result;
}

export type EmojiPart = Part & {
	emoji: string;
};

export default findEmoji;
