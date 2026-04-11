import {MessageType, SharedMsg} from "../../../shared/types/msg";

export function extractInputHistory(messages: SharedMsg[], limit: number): string[] {
	return (
		messages
			.filter((m) => m.self && m.text && m.type === MessageType.MESSAGE)
			// TS is too stupid to see the guard in .filter(), so we monkey patch it
			// to please the compiler
			.map((m) => m.text!)
			.reverse()
			.slice(0, limit)
	);
}
