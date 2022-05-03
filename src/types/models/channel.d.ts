import Chan from "../../models/chan";

declare global {
	export type Channel = Chan;

	export type FilteredChannel = Chan & {
		users: [];
		totalMessages: number;
	};

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
}
