import EventEmitter from "events";
import Client from "./client";
import {NetworkWithIrcFramework} from "./models/network";
import {MessageData, NotificationData} from "./plugins/irc-events/message";
export interface ClientEvents {
	message: (
		irc: NetworkWithIrcFramework["irc"],
		network: NetworkWithIrcFramework,
		client: Client,
		data: MessageData
	) => void;
	notification: (
		irc: NetworkWithIrcFramework["irc"],
		network: NetworkWithIrcFramework,
		client: Client,
		data: MessageData,
		notification: NotificationData
	) => void;
}

export interface ClientEmitter {
	on<U extends keyof ClientEvents>(event: U, listener: ClientEvents[U]): this;
	emit<U extends keyof ClientEvents>(event: U, ...args: Parameters<ClientEvents[U]>): boolean;
}

export class ClientEmitter extends EventEmitter {}
