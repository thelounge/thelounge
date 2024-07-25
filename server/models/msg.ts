import _ from "lodash";
import {MessageType, LinkPreview, UserInMessage} from "../../shared/types/msg";

class Msg {
	from!: UserInMessage;
	id!: number;
	previews!: LinkPreview[];
	text!: string;
	type!: MessageType;
	self!: boolean;
	time!: Date;
	hostmask!: string;
	target!: UserInMessage;
	// TODO: new_nick is only on MessageType.NICK,
	// we should probably make Msgs that extend this class and use those
	// throughout. I'll leave any similar fields below.
	new_nick!: string;
	highlight?: boolean;
	showInActive?: boolean;
	new_ident!: string;
	new_host!: string;
	ctcpMessage!: string;
	command!: string;
	invitedYou!: boolean;
	gecos!: string;
	account!: boolean;

	// these are all just for error:
	error!: string;
	nick!: string;
	channel!: string;
	reason!: string;

	raw_modes!: any;
	when!: Date;
	whois!: any;
	users!: string[];
	statusmsgGroup!: string;
	params!: string[];

	constructor(attr?: Partial<Msg>) {
		// Some properties need to be copied in the Msg object instead of referenced
		if (attr) {
			["from", "target"].forEach((prop) => {
				if (attr[prop]) {
					this[prop] = {
						mode: attr[prop].mode,
						nick: attr[prop].nick,
					};
				}
			});
		}

		_.defaults(this, attr, {
			from: {},
			id: 0,
			previews: [],
			text: "",
			type: MessageType.MESSAGE,
			self: false,
		});

		if (this.time) {
			this.time = new Date(this.time);
		} else {
			this.time = new Date();
		}
	}

	findPreview(link: string) {
		return this.previews.find((preview) => preview.link === link);
	}

	isLoggable() {
		if (this.type === MessageType.TOPIC) {
			// Do not log topic that is sent on channel join
			return !!this.from.nick;
		}

		switch (this.type) {
			case MessageType.MONOSPACE_BLOCK:
			case MessageType.ERROR:
			case MessageType.TOPIC_SET_BY:
			case MessageType.MODE_CHANNEL:
			case MessageType.MODE_USER:
			case MessageType.RAW:
			case MessageType.WHOIS:
			case MessageType.PLUGIN:
				return false;
			default:
				return true;
		}
	}
}

export default Msg;

export type Message = Msg;
