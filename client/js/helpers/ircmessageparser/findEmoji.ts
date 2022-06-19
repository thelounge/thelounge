import emojiRegExp from "emoji-regex";
import {Part} from "./merge";

const regExp = emojiRegExp();

export type EmojiPart = Part & {
	emoji: string;
};

function findEmoji(text: string) {
	const result: EmojiPart[] = [];
	let match: RegExpExecArray | null;

	while ((match = regExp.exec(text))) {
		result.push({
			start: match.index,
			end: match.index + match[0].length,
			emoji: match[0],
		});
	}

	return result;
}

export default findEmoji;
