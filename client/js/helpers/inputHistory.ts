import {MessageType, SharedMsg} from "../../../shared/types/msg";

export function extractInputHistory(messages: SharedMsg[], limit: number): string[] {
	return messages
		.filter((m) => m.self && m.text && m.type === MessageType.MESSAGE)
		.map((m) => m.text!)
		.reverse()
		.slice(0, limit);
}
