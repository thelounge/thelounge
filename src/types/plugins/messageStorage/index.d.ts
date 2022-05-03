import {Channel} from "../../models/channel";
import {Message} from "../../models/message";
import {Network} from "../../models/network";
import sqlite from "sqlite3";
import Client from "@src/client";

interface MessageStorage {
	client: Client;
	isEnabled: boolean;

	enable(): void;

	close(callback?: () => void): void;

	index(network: Network, channel: Channel, msg: Message): void;

	deleteChannel(network: Network, channel: Channel);

	getMessages(network: Network, channel: Channel): Promise<Message[]>;

	canProvideMessages(): boolean;
}

interface SqliteMessageStorage extends MessageStorage {
	database: sqlite.Database;
}
