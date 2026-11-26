// Keeps `channel.pendingMessage` in sync with the server and with browser
// storage, so unsent text follows the user between devices and survives reloads.
// See shared/draft.ts for how simultaneous typing is handled.

import socket from "./socket";
import storage from "./localStorage";
import {store} from "./store";
import {ClientChan, ClientNetwork} from "./types";
import {ChanType} from "../../shared/types/chan";
import {
	Draft,
	draftIncludes,
	editDraftVersion,
	isValidDraft,
	MAX_DRAFT_LENGTH,
	mergeDraftVersions,
} from "../../shared/draft";

// How often the server is updated while typing
export const PUSH_DELAY_MS = 500;

// An empty input is not filled with text typed independently elsewhere if it was
// used this recently, as the user is likely about to type their next message
export const BUSY_MS = 30_000;

// Identifies edits made by this page. `crypto.randomUUID` is unavailable on
// insecure origins, and this does not need to be unguessable.
const author = Math.random().toString(36).slice(2, 12);
let counter = 0;

const pendingPushes = new Map<
	number,
	{channel: ClientChan; timeout: ReturnType<typeof setTimeout>}
>();

// In public mode nothing outlives the page, so there is nothing to sync with
function isEnabled() {
	return !store.state.serverConfiguration?.public;
}

// Channel ids are reassigned when the server restarts, so use names instead
function storageKey(network: ClientNetwork, channel: ClientChan) {
	const name = channel.type === ChanType.LOBBY ? "" : channel.name.toLowerCase();

	return `thelounge.draft.${JSON.stringify([storage.get("user"), network.uuid, name])}`;
}

// sessionStorage is private to a tab, so tabs in which different things were
// typed each get their own text back on reload. localStorage covers closed tabs.
function save(network: ClientNetwork, channel: ClientChan) {
	const key = storageKey(network, channel);
	const value = JSON.stringify({text: channel.pendingMessage, version: channel.draftVersion});

	storage.set(key, value);

	try {
		window.sessionStorage.setItem(key, value);
	} catch (e) {
		//
	}
}

function parse(value: string | null): Draft | null {
	try {
		const draft = JSON.parse(value || "null");

		// Drafts too long to be synced are still restored locally
		return isValidDraft({...draft, text: ""}) && typeof draft.text === "string"
			? (draft as Draft)
			: null;
	} catch (e) {
		return null;
	}
}

function load(network: ClientNetwork, channel: ClientChan) {
	const key = storageKey(network, channel);
	const shared = parse(storage.get(key));
	let own: Draft | null = null;

	try {
		own = parse(window.sessionStorage.getItem(key));
	} catch (e) {
		//
	}

	if (own && !(shared && draftIncludes(shared.version, own.version))) {
		return own;
	}

	return shared;
}

function push(channel: ClientChan) {
	clearTimeout(pendingPushes.get(channel.id)?.timeout);
	pendingPushes.delete(channel.id);

	// Anything not sent now is sent after reconnecting, see `restoreDraft`
	if (!isEnabled() || !store.state.isConnected) {
		return;
	}

	if (channel.pendingMessage.length > MAX_DRAFT_LENGTH) {
		return;
	}

	socket.emit("draft:set", {
		target: channel.id,
		draft: {
			text: channel.pendingMessage,
			version: channel.draftVersion.map(([a, c]) => [a, c] as [string, number]),
		},
	});
}

export function flushDrafts() {
	for (const {channel} of pendingPushes.values()) {
		push(channel);
	}
}

// Must be called whenever the user changes `channel.pendingMessage`
export function draftEdited(network: ClientNetwork, channel: ClientChan) {
	channel.draftVersion = editDraftVersion(channel.draftVersion, author, ++counter);
	channel.draftEditedAt = Date.now();

	if (!isEnabled()) {
		return;
	}

	save(network, channel);

	// Clearing the input usually means the message was sent, so do not leave
	// it lingering on other devices
	if (channel.pendingMessage === "") {
		push(channel);
	} else if (!pendingPushes.has(channel.id)) {
		pendingPushes.set(channel.id, {
			channel,
			timeout: setTimeout(() => push(channel), PUSH_DELAY_MS),
		});
	}
}

// Handles a draft received from the server
export function receiveDraft(network: ClientNetwork, channel: ClientChan, draft: Draft) {
	// Nothing new to us
	if (draftIncludes(channel.draftVersion, draft.version)) {
		return;
	}

	if (draftIncludes(draft.version, channel.draftVersion)) {
		channel.draftVersion = draft.version;
	} else if (
		draft.text === channel.pendingMessage ||
		(channel.pendingMessage === "" && Date.now() - channel.draftEditedAt > BUSY_MS)
	) {
		// Typed independently, but taking it over loses nothing
		channel.draftVersion = mergeDraftVersions(channel.draftVersion, draft.version);
	} else {
		// Typed independently: what is in this input stays
		return;
	}

	if (channel.pendingMessage !== draft.text) {
		channel.pendingMessage = draft.text;
		channel.inputHistoryPosition = 0;

		// The reply was sent or abandoned elsewhere
		if (draft.text === "") {
			channel.replyingTo = null;
		}
	}

	save(network, channel);
}

// Called with the server's draft whenever the server describes a channel to us:
// on page load, when reconnecting, and when a channel is added
export function restoreDraft(network: ClientNetwork, channel: ClientChan, draft?: Draft) {
	if (!isEnabled()) {
		return;
	}

	if (channel.draftVersion.length === 0) {
		const stored = load(network, channel);

		if (stored) {
			channel.pendingMessage = stored.text;
			channel.draftVersion = stored.version;
			save(network, channel);
		}
	}

	if (draft) {
		receiveDraft(network, channel, draft);
	}

	// Send anything the server missed, for instance because we were offline.
	// Text typed independently of the server's is only sent once edited again,
	// as the server's may well be newer.
	if (
		channel.draftVersion.length > 0 &&
		(!draft || !draftIncludes(draft.version, channel.draftVersion)) &&
		(!draft || draftIncludes(channel.draftVersion, draft.version))
	) {
		push(channel);
	}
}

export function removeDraft(network: ClientNetwork, channel: ClientChan) {
	clearTimeout(pendingPushes.get(channel.id)?.timeout);
	pendingPushes.delete(channel.id);

	const key = storageKey(network, channel);
	storage.remove(key);

	try {
		window.sessionStorage.removeItem(key);
	} catch (e) {
		//
	}
}

export function renameDraft(network: ClientNetwork, channel: ClientChan, name: string) {
	removeDraft(network, channel);
	channel.name = name;

	if (isEnabled() && channel.draftVersion.length > 0) {
		save(network, channel);
		push(channel);
	}
}
