import {defineComponent} from "vue";

import {SharedChan} from "../../shared/types/chan";
import {SharedNetwork} from "../../shared/types/network";
import {SharedUser} from "../../shared/types/user";
import {SharedMention} from "../../shared/models/mention";
import {SharedConfiguration, LockedSharedConfiguration} from "../../shared/types/config";
import {LinkPreview} from "../../shared/types/msg";

interface LoungeWindow extends Window {
	g_TheLoungeRemoveLoading?: () => void;
	navigator: Window["navigator"] & {
		setAppBadge?: (highlightCount: number) => void;
		clearAppBadge?: () => void;
	};
}

type ClientUser = SharedUser;

type ClientChan = Omit<SharedChan, "users" | "messages"> & {
	moreHistoryAvailable: boolean;
	editTopic: boolean;
	users: ClientUser[];
	messages: ClientMessage[];

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

// We omit channels so we can use ClientChan[] instead of Chan[]
type ClientNetwork = Omit<SharedNetwork, "channels"> & {
	isJoinChannelShown: boolean;
	isCollapsed: boolean;
	channels: ClientChan[];
};

type NetChan = {
	channel: ClientChan;
	network: ClientNetwork;
};

type ClientMention = SharedMention & {
	localetime: string;
	channel: NetChan | null;
};

type ClientLinkPreview = LinkPreview & {
	sourceLoaded?: boolean;
};

interface BeforeInstallPromptEvent extends Event {
	/**
	 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
	 * This is provided for user agents that want to present a choice of versions to the user such as,
	 * for example, "web" or "play" which would allow the user to chose between a web version or
	 * an Android version.
	 */
	readonly platforms: Array<string>;

	/**
	 * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
	 */
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;

	/**
	 * Allows a developer to show the install prompt at a time of their own choosing.
	 * This method returns a Promise.
	 */
	prompt(): Promise<void>;
}
