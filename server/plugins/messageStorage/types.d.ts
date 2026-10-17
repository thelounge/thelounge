import {Channel} from "../../models/channel";
import {Message} from "../../models/message";
import {Network} from "../../models/network";
import Client from "../../client";
import {SearchQuery, SearchResponse} from "../../../shared/types/storage";
import type {MessageType} from "../../../shared/types/msg";

export type DeletionRequest = {
	olderThanDays: number;
	messageTypes: MessageType[] | null; // null means no restriction
	limit: number; // -1 means unlimited, providers may delete fewer
};

interface MessageStorage {
	isEnabled: boolean;

	enable(): void;

	close(): void;

	index(network: Network, channel: Channel, msg: Message): void;

	deleteChannel(network: Network, channel: Channel): void;

	getMessages(network: Network, channel: Channel, nextID: () => number): Message[];

	canProvideMessages(): boolean;
}

type SearchFunction = (query: SearchQuery) => SearchResponse;

export interface SearchableMessageStorage extends MessageStorage {
	search: SearchFunction;
}

// A storage whose messages can be deleted, e.g. to apply the storage policy
export interface PrunableMessageStorage extends SearchableMessageStorage {
	// returns the number of deleted messages
	deleteMessages(req: DeletionRequest): number;
}
