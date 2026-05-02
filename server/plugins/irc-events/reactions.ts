import Client from "../../client";
import Chan from "../../models/chan";

export const REACT_TAG = "+draft/react";
export const UNREACT_TAG = "+draft/unreact";
export const REPLY_TAG = "+reply";

// TODO: right now, the parent must still be in scrollback for reactions; reactions to older messages are silently dropped.
export function applyReactionTags(
	client: Client,
	chan: Chan,
	nick: string,
	tags: Record<string, string | undefined>
): void {
	const replyTo = tags[REPLY_TAG];

	if (!replyTo) {
		return;
	}

	const reaction = tags[REACT_TAG];
	const unreaction = tags[UNREACT_TAG];

	if (reaction && unreaction) {
		return;
	}

	const value = reaction ?? unreaction;

	if (!value) {
		return;
	}

	const parent = chan.messages.find((m) => m.msgid === replyTo);

	if (!parent) {
		return;
	}

	if (!parent.reactions) {
		parent.reactions = {};
	}

	const list = parent.reactions[value] ?? [];
	let changed = false;

	if (reaction) {
		if (!list.includes(nick)) {
			list.push(nick);
			changed = true;
		}
	} else {
		const idx = list.indexOf(nick);

		if (idx !== -1) {
			list.splice(idx, 1);
			changed = true;
		}
	}

	if (!changed) {
		return;
	}

	if (list.length === 0) {
		delete parent.reactions[value];
	} else {
		parent.reactions[value] = list;
	}

	client.emit("msg:reactions", {
		chan: chan.id,
		msgid: replyTo,
		reactions: parent.reactions,
	});
}
