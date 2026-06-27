import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";

type StandardReply = {
	type: "FAIL" | "WARN" | "NOTE";
	command: string;
	code: string;
	context: string[];
	description: string;
};

const MULTILINE_ERROR_DESCRIPTIONS: Record<string, string> = {
	MULTILINE_MAX_BYTES: "Multiline message too long",
	MULTILINE_MAX_LINES: "Too many lines in multiline message",
	MULTILINE_INVALID_TARGET: "Mismatched target in multiline message",
	MULTILINE_INVALID: "Invalid multiline message",
};

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("standard reply" as any, (data: StandardReply) => {
		// Only surface multiline-related FAIL replies. Other standard replies
		// continue to be handled by their dedicated event paths (or ignored).
		if (data.type !== "FAIL" || data.command !== "BATCH") {
			return;
		}

		if (!data.code || !data.code.startsWith("MULTILINE_")) {
			return;
		}

		const friendly = MULTILINE_ERROR_DESCRIPTIONS[data.code] ?? "Multiline message rejected";
		const detail = data.description || friendly;

		const text = `${friendly}: ${detail}`;
		const msg = new Msg({
			type: MessageType.ERROR,
			text,
			showInActive: true,
		});

		const target = network.getLobby();
		target.pushMessage(client, msg, true);
	});
};
