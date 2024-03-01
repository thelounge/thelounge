import type {Database} from "sqlite3";

import {Channel} from "../../models/channel";
import {Message} from "../../models/message";
import {Network} from "../../models/network";
import Client from "../../client";
import {SearchQuery, SearchResponse} from "../../../shared/types/storage";
import type {MessageType} from "../../../shared/types/msg";

export type DeletionRequest = {
	olderThanDays: number;
	messageTypes: MessageType[] | null; // null means no restriction
	limit: number; // -1 means unlimited
};

interface MessageStorage {
	isEnabled: boolean;

	enable(): Promise<void>;

	close(): Promise<void>;

	index(network: Network, channel: Channel, msg: Message): Promise<void>;

	deleteChannel(network: Network, channel: Channel): Promise<void>;

	getMessages(network: Network, channel: Channel, nextID: () => number): Promise<Message[]>;

	canProvideMessages(): boolean;
}

type SearchFunction = (query: SearchQuery) => Promise<SearchResponse>;

export interface SearchableMessageStorage extends MessageStorage {
	search: SearchFunction;
}
