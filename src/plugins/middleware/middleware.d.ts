import EventEmitter from "events";

// import { Client } from "irc-framework"
type Timestamp = `timestamp=${string}` | `msgid=${string}` | Date;
type LatestTimestamp = "*" | Timestamp;

declare module "irc-framework" {
	interface Client {
		chatHistory: {
			eventbus: EventEmitter;
			before(target: string, timestamp: Timestamp, limit?: number): void;
			after(target: string, timestamp: Timestamp, limit?: number): void;
			latest(target: string, timestamp?: LatestTimestamp, limit?: number): void;
			around(target: string, timestamp: Timestamp, limit?: number): void;
			between(
				target: string,
				timestamp1: Timestamp,
				timestamp2: Timestamp,
				limit?: number
			): void;
			targets(timestamp1: Timestamp, timestamp2: Timestamp, limit?: number): void;
			targets(target: string, timestamp: Timestamp): void;
		};
	}
}
