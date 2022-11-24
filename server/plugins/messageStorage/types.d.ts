import type {Database} from "sqlite3";

import {Channel} from "../../models/channel";
import {Message} from "../../models/message";
import {Network} from "../../models/network";
import Client from "../../client";

interface MessageStorage {
	client: Client;
	isEnabled: boolean;

	enable(): Promise<void>;

	close(): Promise<void>;

	index(network: Network, channel: Channel, msg: Message): Promise<void>;

	deleteChannel(network: Network, channel: Channel): Promise<void>;

	getMessages(network: Network, channel: Channel): Promise<Message[]>;

	canProvideMessages(): boolean;
}

export type SearchQuery = {
	searchTerm: string;
	networkUuid: string;
	channelName: string;
	offset: number;
};

export type SearchResponse =
	| Omit<SearchQuery, "channelName" | "offset"> & {
			results: Message[];
			target: string;
			offset: number;
	  };

type SearchFunction = (query: SearchQuery) => Promise<SearchResponse>;

export interface SqliteMessageStorage extends MessageStorage {
	database: Database;
	search: SearchFunction | [];
}
