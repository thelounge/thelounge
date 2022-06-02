import EventEmitter from "events";
import { Client, IRCMiddleware } from "irc-framework";
import { isDate } from "lodash";



const initChatHistoryCommands = (irc: Client) => {
	const isEnabled = () => irc.network.supports('draft/chathistory') || irc.network.supports('chathistory');
	const messageLimit = () =>
		irc.network.options["DRAFT/CHATHISTORY"]
		|| irc.network.options.CHATHISTORY || 100;

	const getTimestamp = (ts: string | Date) => {
		if (isDate(ts)) {
			return "timestamp=" + ts.toISOString();
		}

		return ts;
	}

	const commands: typeof Client.prototype.chatHistory = {
		async latest(target: string, timestamp = "*", limit = messageLimit()) {
			// CHATHISTORY LATEST #channel * 50
			if (!isEnabled()) {
				return;
			}

			irc.raw(`CHATHISTORY LATEST ${target} ${getTimestamp(timestamp)} ${limit}`);

		}
	};

	irc.chatHistory = commands;
}

const initCallbacks = (irc: Client) => {
	const batches: Map<number, ((data?: any) => Promise<void>)> = new Map();

	irc.chatHistory.batches = batches;

	irc.chatHistory.addCallback = (id, callback) => {
		batches.set(id, callback);
	}

	irc.chatHistory.runCallback = async (id: number) => {
		if (batches.has(id)) {
			// TODO: investigate typing
			await batches.get(id)!();
		}
	}
}

type BatchResponse = {
	id: number,
	type: 'chathistory',
	params: string[],
	commands: string[],
}

const initListeners = (irc: Client) => {
	irc.on("batch start chathistory", (data: BatchResponse) => {
		irc.chatHistory.batches.set(data.id, new Promise((resolve, reject) => {
			irc.chatHistory.addCallback(data.id, () => {
				resolve();
			});
		}
	})

	irc.on("batch end chathistory", (data: BatchResponse) => {
		if (!irc.chatHistory) {
			return;
		}

		// irc.chatHistory.runCallbacks(data.id);
	});
}

function ChatHistoryMiddleware(): IRCMiddleware {
	return function (irc, raw_events, parsed_events) {
		irc.requestCap(['draft/chathistory']);

		irc.chatHistory.batches = new Map<string, Promise<void>>();


		irc.on("batch end chathistory", (data: BatchResponse) => {
			irc.chatHistory.listener.emit("chathistory", data);
		});

		initCallbacks(irc);
		initListeners(irc);
		initChatHistoryCommands(irc);
		// initChatHistoryListeners(client);
		parsed_events.use(theMiddleware);
	}

	function theMiddleware(command: string, event: any, client: Client, next: () => void) {
		next();
	}
}

export default ChatHistoryMiddleware;
