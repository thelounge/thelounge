import EventEmitter from "events";

// import { Client } from "irc-framework"
type Timestamp = `timestamp=${string}` | `msgid=${string}` | Date;
type LatestTimestamp = "*" | Timestamp;

declare module "irc-framework" {
	interface Client {
		chatHistory: {
			batches: Map<number, Promise<void>>;
			addCallback: (id: number, callback: (data?: void | PromiseLike<void>) => Promise<void>) => void;
			async runCallback(id: number): void;

			async before(target: string, timestamp: Timestamp, limit: number): Promise<any>;
			async after(target: string, timestamp: Timestamp, limit: number): Promise<any>;
			async latest(target: string, timestamp: LatestTimestamp, limit: number): Promise<any>;
			async around(target: string, timestamp: Timestamp, limit: number): Promise<any>;
			async between(target: string, timestamp1: Timestamp, timestamp2: Timestamp, limit: number): Promise<any>;
			async targets(timestamp1: Timestamp, timestamp2: Timestamp, limit: number): Promise<any>;
			async targets(target: string, timestamp: Timestamp): Promise<any>;
		}
	}
}
