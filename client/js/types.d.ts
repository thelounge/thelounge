import Chan from "../../src/models/chan";
import Network from "../../src/models/network";

declare module "*.vue" {
	import Vue from "vue";
	export default Vue;
}

interface LoungeWindow extends Window {
	g_TheLoungeRemoveLoading?: () => void;
}

type ClientChan = Chan & {
	moreHistoryAvailable: boolean;
	editTopic: boolean;

	// these are added in store/initChannel
	pendingMessage: string;
	inputHistoryPosition: number;
	inputHistory: string[];
	historyLoading: boolean;
	scrolledToBottom: boolean;
	usersOutdated: boolean;
};

type InitClientChan = ClientChan & {
	// total messages is deleted after its use when init event is sent/handled
	totalMessages?: number;
};

type ClientNetwork = Network & {
	isJoinChannelShown: boolean;
	isCollapsed: boolean;
};
