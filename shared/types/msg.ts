export enum MessageType {
	UNHANDLED = "unhandled",
	ACTION = "action",
	AWAY = "away",
	BACK = "back",
	ERROR = "error",
	INVITE = "invite",
	JOIN = "join",
	KICK = "kick",
	LOGIN = "login",
	LOGOUT = "logout",
	MESSAGE = "message",
	MODE = "mode",
	MODE_CHANNEL = "mode_channel",
	MODE_USER = "mode_user", // RPL_UMODEIS
	MONOSPACE_BLOCK = "monospace_block",
	NICK = "nick",
	NOTICE = "notice",
	PART = "part",
	QUIT = "quit",
	CTCP = "ctcp",
	CTCP_REQUEST = "ctcp_request",
	CHGHOST = "chghost",
	TOPIC = "topic",
	TOPIC_SET_BY = "topic_set_by",
	WHOIS = "whois",
	RAW = "raw",
	PLUGIN = "plugin",
	WALLOPS = "wallops",
}

export type SharedUser = {
	modes: string[];
	// Users in the channel have only one mode assigned
	mode: string;
	away: string;
	nick: string;
	lastMessage: number;
};

export type UserInMessage = Partial<SharedUser> & {
	mode: string;
};

export type LinkPreview = {
	type: string;
	head: string;
	body: string;
	thumb: string;
	size: number;
	link: string; // Send original matched link to the client
	shown?: boolean | null;
	error?: string;
	message?: string;

	media?: string;
	mediaType?: string;
	maxSize?: number;
	thumbActualUrl?: string;
};

export type SharedMsg = {
	from?: UserInMessage;
	id: number;
	previews?: LinkPreview[];
	text?: string;
	type?: MessageType;
	self?: boolean;
	time: Date;
	hostmask?: string;
	target?: UserInMessage;
	// TODO: new_nick is only on MessageType.NICK,
	// we should probably make Msgs that extend this class and use those
	// throughout. I'll leave any similar fields below.
	new_nick?: string;
	highlight?: boolean;
	showInActive?: boolean;
	new_ident?: string;
	new_host?: string;
	ctcpMessage?: string;
	command?: string;
	invitedYou?: boolean;
	gecos?: string;
	account?: boolean;

	// these are all just for error:
	error?: string;
	nick?: string;
	channel?: string;
	reason?: string;

	raw_modes?: any;
	when?: Date;
	whois?: any;

	users: string[];

	statusmsgGroup?: string;
	params?: string[];
};
