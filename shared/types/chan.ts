import {SharedMsg} from "./msg";
import {SharedUser} from "./user";
import {SharedNetworkChan} from "./network";

export enum ChanType {
	CHANNEL = "channel",
	LOBBY = "lobby",
	QUERY = "query",
	SPECIAL = "special",
}

export enum SpecialChanType {
	BANLIST = "list_bans",
	INVITELIST = "list_invites",
	CHANNELLIST = "list_channels",
	IGNORELIST = "list_ignored",
}

export enum ChanState {
	PARTED = 0,
	JOINED = 1,
}

export type SharedChan = {
	// TODO: don't force existence, figure out how to make TS infer it.
	id: number;
	messages: SharedMsg[];
	name: string;
	key: string;
	topic: string;
	firstUnread: number;
	unread: number;
	highlight: number;
	muted: boolean;
	type: ChanType;
	state: ChanState;

	special?: SpecialChanType;
	data?: any;
	closed?: boolean;
	num_users?: number;
};
