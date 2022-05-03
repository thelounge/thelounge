import Msg from "../../models/msg";

declare global {
	type Message = Msg;

	type UserInMessage = Partial<User> & {
		mode: string;
	};

	type MessagePreview = {
		shown: boolean;
		link: string;
	};

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
}
