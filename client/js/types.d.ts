import {defineComponent} from "vue";

import Chan from "../../src/models/chan";
import Network from "../../src/models/network";
import User from "../../src/models/user";
import Message from "../../src/models/msg";
import {Mention} from "../../src/client";
import {ClientConfiguration} from "../../src/server";
import {LinkPreview} from "../../src/plugins/irc-events/link";

// declare module '*.vue' {
// 	import { defineComponent } from 'vue';

// 	const component: ReturnType<typeof defineComponent>;
// 	export default component;
// }

interface LoungeWindow extends Window {
	g_TheLoungeRemoveLoading?: () => void;
	navigator: Window["navigator"] & {
		setAppBadge?: (highlightCount: number) => void;
		clearAppBadge?: () => void;
	};
}

type ClientUser = User & {
	//
};

type ClientMessage = Message & {
	time: number;
};

type ClientChan = Omit<Chan, "users" | "messages"> & {
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
type ClientNetwork = Omit<Network, "channels"> & {
	isJoinChannelShown: boolean;
	isCollapsed: boolean;
	channels: ClientChan[];
};

type NetChan = {
	channel: ClientChan;
	network: ClientNetwork;
};

type ClientConfiguration = ClientConfiguration;
type ClientMention = Mention & {
	localetime: string;
	channel: NetChan | null;
};

type ClientLinkPreview = LinkPreview & {
	sourceLoaded?: boolean;
};

declare module "*.vue" {
	const Component: ReturnType<typeof defineComponent>;
	export default Component;
}

declare module "vue" {
	// interface ComponentCustomProperties {
	// 	// TODO: Vue struggles with typing using the options API, so we should switch to composition API
	// 	// $root
	// }
}

declare module "vue-router" {
	import Vue from "./vue";

	interface Router {
		app: Vue.VueApp;
	}
}

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
