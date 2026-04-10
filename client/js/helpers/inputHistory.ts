import {MessageType, SharedMsg} from "../../../shared/types/msg";

/**
 * Extract self-authored message texts from a list of messages,
 * most-recent first, capped at `limit` entries.
 */
export function extractInputHistory(messages: SharedMsg[], limit: number): string[] {
	return messages
		.filter((m) => m.self && m.text && m.type === MessageType.MESSAGE)
		.map((m) => m.text!)
		.reverse()
		.slice(0, limit);
}
