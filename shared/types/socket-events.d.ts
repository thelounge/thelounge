import {ClientMessage, ClientNetwork, InitClientChan} from "../../client/js/types";
import {Mention} from "../client";
import {ChanState} from "../models/chan";
import Msg from "../models/msg";
import Network from "../models/network";
import User from "../models/user";
import {ChangelogData} from "../plugins/changelog";
import {LinkPreview} from "../plugins/irc-events/link";
import {ClientConfiguration} from "../server";

type Session = {
	current: boolean;
	active: number;
	lastUse: number;
	ip: string;
	agent: string;
	token: string;
};

interface ServerToClientEvents {
	"auth:failed": () => void;
	"auth:start": (serverHash: number) => void;
	"auth:success": () => void;

	"upload:auth": (token: string) => void;

	changelog: (data: ChangelogData) => void;
	"changelog:newversion": () => void;

	"channel:state": (data: {chan: number; state: ChanState}) => void;

	"change-password": ({success, error}: {success: boolean; error?: any}) => void;

	commands: (data: string[]) => void;

	configuration: (config: ClientConfiguration) => void;

	"push:issubscribed": (isSubscribed: boolean) => void;
	"push:unregister": () => void;

	"sessions:list": (data: Session[]) => void;

	"mentions:list": (data: Mention[]) => void;

	"setting:new": ({name: string, value: any}) => void;
	"setting:all": (settings: {[key: string]: any}) => void;

	"history:clear": ({target}: {target: number}) => void;

	"mute:changed": (response: {target: number; status: boolean}) => void;

	names: (data: {id: number; users: User[]}) => void;

	network: (data: {networks: ClientNetwork[]}) => void;
	"network:options": (data: {network: string; serverOptions: {[key: string]: any}}) => void;
	"network:status": (data: {network: string; connected: boolean; secure: boolean}) => void;
	"network:info": (data: {uuid: string}) => void;
	"network:name": (data: {uuid: string; name: string}) => void;

	nick: (data: {network: string; nick: string}) => void;

	open: (id: number) => void;

	part: (data: {chan: number}) => void;

	"sign-out": () => void;

	sync_sort: (
		data:
			| {
					type: "networks";
					order: string[];
					target: string;
			  }
			| {
					type: "channels";
					order: number[];
					target: string;
			  }
	) => void;

	topic: (data: {chan: number; topic: string}) => void;

	users: (data: {chan: number}) => void;

	more: ({
		chan,
		messages,
		totalMessages,
	}: {
		chan: number;
		messages: Msg[];
		totalMessages: number;
	}) => void;

	"msg:preview": ({id, chan, preview}: {id: number; chan: number; preview: LinkPreview}) => void;
	"msg:special": (data: {chan: number; data?: Record<string, any>}) => void;
	msg: (data: {msg: ClientMessage; chan: number; highlight?: number; unread?: number}) => void;

	init: ({
		active,
		networks,
		token,
	}: {
		active: number;
		networks: ClientNetwork[];
		token: string;
	}) => void;

	"search:results": (response: SearchResponse) => void;

	quit: (args: {network: string}) => void;

	error: (error: any) => void;
	connecting: () => void;

	join: (args: {
		shouldOpen: boolean;
		index: number;
		network: string;
		chan: InitClientChan;
	}) => void;
}

interface ClientToServerEvents {
	"auth:perform":
		| (({user, password}: {user: string; password: string}) => void)
		| (({
				user,
				token,
				lastMessage,
				openChannel,
				hasConfig,
		  }: {
				user: string;
				token: string;
				lastMessage: number;
				openChannel: number | null;
				hasConfig: boolean;
		  }) => void);

	changelog: () => void;

	"change-password": ({
		old_password: string,
		new_password: string,
		verify_password: string,
	}) => void;

	open: (channelId: number) => void;

	names: ({target: number}) => void;

	input: ({target, text}: {target: number; text: string}) => void;

	"upload:auth": () => void;
	"upload:ping": (token: string) => void;

	"mute:change": (response: {target: number; setMutedTo: boolean}) => void;

	"push:register": (subscriptionJson: PushSubscriptionJSON) => void;
	"push:unregister": () => void;

	"setting:get": () => void;
	"setting:set": ({name: string, value: any}) => void;

	"sessions:get": () => void;

	sort: ({type, order}: {type: string; order: any; target?: string}) => void;

	"mentions:dismiss": (msgId: number) => void;
	"mentions:dismiss_all": () => void;
	"mentions:get": () => void;

	more: ({
		target,
		lastId,
		condensed,
	}: {
		target: number;
		lastId: number;
		condensed: boolean;
	}) => void;

	"msg:preview:toggle": ({
		target,
		messageIds,
		msgId,
		shown,
		link,
	}: {
		target: number;
		messageIds?: number[];
		msgId?: number;
		shown?: boolean | null;
		link?: string;
	}) => void;

	"network:get": (uuid: string) => void;
	"network:edit": (data: Record<string, any>) => void;
	"network:new": (data: Record<string, any>) => void;

	"sign-out": (token?: string) => void;

	"history:clear": ({target}: {target: number}) => void;

	search: ({
		networkUuid,
		channelName,
		searchTerm,
		offset,
	}: {
		networkUuid?: string;
		channelName?: string;
		searchTerm?: string;
		offset: number;
	}) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InterServerEvents {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SocketData {}
