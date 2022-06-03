import EventEmitter from "events";
import {Client, IRCMiddleware} from "irc-framework";
import {isDate} from "lodash";

const initChatHistoryCommands = (irc: Client) => {
	const waitForResponse = async <T>(
		firstResponse: string,
		response: string,
		handler: (data: T) => void,
		timeout = 5000
	) => {
		return new Promise((resolve, reject) => {
			let id: string;

			irc.chatHistory.eventbus.on(firstResponse, (data) => {
				id = data.id;
			});

			// TODO: improve typing
			const handleData = (
				data: T & {
					id: string;
				}
			) => {
				console.log(`[response:${response}] [id:${data.id}] [key:${id}]`);
				if (data.id === id) {
					console.log(id, "handled.");
					resolve(handler(data));
				}
			};

			irc.chatHistory.eventbus.on(response, handleData);

			// setTimeout(() => {
			// 	console.log(`[${response}] [${key}] timeout`);
			// 	irc.chatHistory.eventbus.off(response, handleData);
			// 	reject(new Error("timeout"));
			// }, timeout);
		});
	};

	const isEnabled = () =>
		irc.network.supports("draft/chathistory") || irc.network.supports("chathistory");
	const messageLimit = () =>
		irc.network.options["DRAFT/CHATHISTORY"] || irc.network.options.CHATHISTORY || 100;

	const getTimestamp = (ts: string | Date) => {
		if (isDate(ts)) {
			return "timestamp=" + ts.toISOString();
		}

		return ts;
	};

	irc.chatHistory.latest = async (target, timestamp = "*", limit = messageLimit()) => {
		// CHATHISTORY LATEST #channel * 50
		if (!isEnabled()) {
			return;
		}
		const processedTimestamp = getTimestamp(timestamp);

		irc.raw(`CHATHISTORY LATEST ${target} ${processedTimestamp} ${limit}`);
		return waitForResponse<BatchResponse>("batch:start", "batch:end", (data) => data.commands);
	};

	irc.chatHistory.before = (target, timestamp, limit = messageLimit()) => {
		// CHATHISTORY BEFORE <target> <timestamp=YYYY-MM-DDThh:mm:ss.sssZ | msgid=1234> <limit>
		if (!isEnabled()) {
			return;
		}
		const processedTimestamp = getTimestamp(timestamp);

		irc.raw(`CHATHISTORY BEFORE ${target} ${processedTimestamp} ${limit}`);
		return waitForResponse<BatchResponse>("batch:start", "batch:end", (data) => data.commands);
	};

	irc.chatHistory.after = (target, timestamp, limit = messageLimit()) => {
		// CHATHISTORY AFTER <target> <timestamp=YYYY-MM-DDThh:mm:ss.sssZ | msgid=1234> <limit>
		if (!isEnabled()) {
			return;
		}
		const processedTimestamp = getTimestamp(timestamp);

		irc.raw(`CHATHISTORY AFTER ${target} ${processedTimestamp} ${limit}`);
		return waitForResponse<BatchResponse>("batch:start", "batch:end", (data) => data.commands);
	};

	irc.chatHistory.around = (target, timestamp, limit = messageLimit()) => {
		// CHATHISTORY AROUND <target> <timestamp=YYYY-MM-DDThh:mm:ss.sssZ | msgid=1234> <limit>
		if (!isEnabled()) {
			return;
		}
		const processedTimestamp = getTimestamp(timestamp);

		irc.raw(`CHATHISTORY AROUND ${target} ${processedTimestamp} ${limit}`);
		return waitForResponse<BatchResponse>("batch:start", "batch:end", (data) => data.commands);
	};

	irc.chatHistory.between = (target, timestamp1, timestamp2, limit = messageLimit()) => {
		// CHATHISTORY BETWEEN <target> <timestamp1=YYYY-MM-DDThh:mm:ss.sssZ | msgid=1234> <timestamp2=YYYY-MM-DDThh:mm:ss.sssZ | msgid=1234> <limit>
		if (!isEnabled()) {
			return;
		}
		const processedTimestamp = getTimestamp(timestamp1);
		const processedTimestamp2 = getTimestamp(timestamp2);

		irc.raw(
			`CHATHISTORY BETWEEN ${target} ${processedTimestamp} ${processedTimestamp2} ${limit}`
		);
		return waitForResponse<BatchResponse>("batch:start", "batch:end", (data) => data.commands);
	};
};

type BatchResponse = {
	id: string;
	type: "chathistory";
	params: string[];
	commands: string[];
};

function ChatHistoryMiddleware(): IRCMiddleware {
	return function (irc, raw_events, parsed_events) {
		//@ts-ignore
		irc.chatHistory = {
			eventbus: new EventEmitter(),
		};

		irc.requestCap(["draft/chathistory", "draft/event-playback", "draft/chathistory-targets"]);

		irc.on("batch start chathistory", (data: BatchResponse) => {
			console.log("batch start chathistory");
			irc.chatHistory.eventbus.emit("batch:start", data);
		});

		irc.on("batch end chathistory", (data: BatchResponse) => {
			console.log("batch end chathistory", data);
			irc.chatHistory.eventbus.emit("batch:end", data);
		});

		initChatHistoryCommands(irc);
		irc.chatHistory.eventbus = new EventEmitter();
		parsed_events.use(theMiddleware);
	};

	function theMiddleware(command: string, event: any, client: Client, next: () => void) {
		next();
	}
}

export default ChatHistoryMiddleware;
