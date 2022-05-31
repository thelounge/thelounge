import {ClientNetwork} from "../../client/js/types";
import Msg from "../models/msg";
import {ChangelogData} from "../plugins/changelog";
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

	"change-password": ({success, error}: {success: boolean; error?: any}) => void;

	commands: (data: string[]) => void;

	configuration: (config: ClientConfiguration) => void;

	"push:issubscribed": (isSubscribed: boolean) => void;
	"push:unregister": () => void;

	"sessions:list": (data: Session[]) => void;

	more: ({
		chan,
		messages,
		totalMessages,
	}: {
		chan: number;
		messages: Msg[];
		totalMessages: number;
	}) => void;

	"msg:preview": ({id, chan, preview}: {id: number; chan: number; preview: string}) => void;

	init: ({
		active,
		networks,
		token,
	}: {
		active: number;
		networks: ClientNetwork[];
		token: string;
	}) => void;
}

interface ClientToServerEvents {
	"auth:perform": ({user: string, password: string}) => void;

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

	"history:clear": ({target}: {target: number}) => void;

	"mute:change": ({target, setMutedTo}: {target: number; setMutedTo: boolean}) => void;

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
		shown,
	}: {
		target: number;
		messageIds: number[];
		shown: boolean;
	}) => void;

	"network:get": (uuid: string) => void;
	"network:edit": (data: Record<string, any>) => void;
	"network:new": (data: Record<string, any>) => void;

	"sign-out": (token?: string) => void;

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

interface InterServerEvents {
	ping: () => void;
}

interface SocketData {
	name: string;
	age: number;
}
