import {ClientChan, ClientMessage} from "./types";
import {SharedNetworkChan} from "../../shared/types/network";
import {SharedMsg, MessageType} from "../../shared/types/msg";
import {ChanType} from "../../shared/types/chan";

export function toClientChan(shared: SharedNetworkChan): ClientChan {
	const history: string[] = [""].concat(
		shared.messages
			.filter((m) => m.self && m.text && m.type === MessageType.MESSAGE)
			// TS is too stupid to see the nil guard on filter... so we monkey patch it
			.map((m): string => (m.text ? m.text : ""))
			.reverse()
			.slice(0, 99)
	);
	// filter the unused vars
	const {messages, totalMessages: _, ...props} = shared;
	const channel: ClientChan = {
		...props,
		editTopic: false,
		pendingMessage: "",
		inputHistoryPosition: 0,
		historyLoading: false,
		scrolledToBottom: true,
		users: [],
		usersOutdated: shared.type === ChanType.CHANNEL ? true : false,
		moreHistoryAvailable: shared.totalMessages > shared.messages.length,
		inputHistory: history,
		messages: sharedMsgToClientMsg(messages),
	};
	return channel;
}

function sharedMsgToClientMsg(shared: SharedMsg[]): ClientMessage[] {
	// TODO: this is a stub for now, we will want to populate client specific stuff here
	return shared;
}
