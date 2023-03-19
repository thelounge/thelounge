import _ from "lodash";
import log from "../log";
import Config from "../config";
import User from "./user";
import Msg, {MessageType} from "./msg";
import storage from "../plugins/storage";
import Client from "../client";
import Network from "./network";
import Prefix from "./prefix";

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

// eslint-disable-next-line no-use-before-define
export type FilteredChannel = Chan & {
	users: [];
	totalMessages: number;
};

export type ChanConfig = {
	name: string;
	key?: string;
	muted?: boolean;
	type?: string;
};

class Chan {
	// TODO: don't force existence, figure out how to make TS infer it.
	id!: number;
	messages!: Msg[];
	name!: string;
	key!: string;
	topic!: string;
	firstUnread!: number;
	unread!: number;
	highlight!: number;
	users!: Map<string, User>;
	muted!: boolean;
	type!: ChanType;
	state!: ChanState;

	userAway?: boolean;
	special?: SpecialChanType;
	data?: any;
	closed?: boolean;
	num_users?: number;
	static optionalProperties = ["userAway", "special", "data", "closed", "num_users"];

	constructor(attr?: Partial<Chan>) {
		_.defaults(this, attr, {
			id: 0,
			messages: [],
			name: "",
			key: "",
			topic: "",
			type: ChanType.CHANNEL,
			state: ChanState.PARTED,
			firstUnread: 0,
			unread: 0,
			highlight: 0,
			users: new Map(),
			muted: false,
		});
	}

	destroy() {
		this.dereferencePreviews(this.messages);
	}

	pushMessage(client: Client, msg: Msg, increasesUnread = false) {
		const chan = this.id;
		const obj = {chan, msg} as {
			chan: number;
			msg: Msg;
			unread?: number;
			highlight?: number;
		};

		msg.id = client.idMsg++;

		// If this channel is open in any of the clients, do not increase unread counter
		const isOpen = _.find(client.attachedClients, {openChannel: chan}) !== undefined;

		if (msg.self) {
			// reset counters/markers when receiving self-/echo-message
			this.unread = 0;
			this.firstUnread = msg.id;
			this.highlight = 0;
		} else if (!isOpen) {
			if (!this.firstUnread) {
				this.firstUnread = msg.id;
			}

			if (increasesUnread || msg.highlight) {
				obj.unread = ++this.unread;
			}

			if (msg.highlight) {
				obj.highlight = ++this.highlight;
			}
		}

		client.emit("msg", obj);

		// Never store messages in public mode as the session
		// is completely destroyed when the page gets closed
		if (Config.values.public) {
			return;
		}

		// showInActive is only processed on "msg", don't need it on page reload
		if (msg.showInActive) {
			delete msg.showInActive;
		}

		this.writeUserLog(client, msg);

		if (Config.values.maxHistory >= 0 && this.messages.length > Config.values.maxHistory) {
			const deleted = this.messages.splice(
				0,
				this.messages.length - Config.values.maxHistory
			);

			// If maxHistory is 0, image would be dereferenced before client had a chance to retrieve it,
			// so for now, just don't implement dereferencing for this edge case.
			if (Config.values.maxHistory > 0) {
				this.dereferencePreviews(deleted);
			}
		}
	}
	dereferencePreviews(messages) {
		if (!Config.values.prefetch || !Config.values.prefetchStorage) {
			return;
		}

		messages.forEach((message) => {
			if (message.previews) {
				message.previews.forEach((preview) => {
					if (preview.thumb) {
						storage.dereference(preview.thumb);
						preview.thumb = "";
					}
				});
			}
		});
	}
	getSortedUsers(irc?: Network["irc"]) {
		const users = Array.from(this.users.values());

		if (!irc || !irc.network || !irc.network.options || !irc.network.options.PREFIX) {
			return users;
		}

		const userModeSortPriority = {};
		irc.network.options.PREFIX.forEach((prefix, index) => {
			userModeSortPriority[prefix.symbol] = index;
		});

		userModeSortPriority[""] = 99; // No mode is lowest

		return users.sort(function (a, b) {
			if (a.mode === b.mode) {
				return a.nick.toLowerCase() < b.nick.toLowerCase() ? -1 : 1;
			}

			return userModeSortPriority[a.mode] - userModeSortPriority[b.mode];
		});
	}
	findMessage(msgId: number) {
		return this.messages.find((message) => message.id === msgId);
	}
	findUser(nick: string) {
		return this.users.get(nick.toLowerCase());
	}
	getUser(nick: string) {
		return this.findUser(nick) || new User({nick}, new Prefix([]));
	}
	setUser(user: User) {
		this.users.set(user.nick.toLowerCase(), user);
	}
	removeUser(user: User) {
		this.users.delete(user.nick.toLowerCase());
	}
	/**
	 * Get a clean clone of this channel that will be sent to the client.
	 * This function performs manual cloning of channel object for
	 * better control of performance and memory usage.
	 *
	 * @param {(int|bool)} lastActiveChannel - Last known active user channel id (needed to control how many messages are sent)
	 *                                         If true, channel is assumed active.
	 * @param {int} lastMessage - Last message id seen by active client to avoid sending duplicates.
	 */
	getFilteredClone(lastActiveChannel?: number | boolean, lastMessage?: number): FilteredChannel {
		return Object.keys(this).reduce((newChannel, prop) => {
			if (Chan.optionalProperties.includes(prop)) {
				if (this[prop] !== undefined || (Array.isArray(this[prop]) && this[prop].length)) {
					newChannel[prop] = this[prop];
				}
			} else if (prop === "users") {
				// Do not send users, client requests updated user list whenever needed
				newChannel[prop] = [];
			} else if (prop === "messages") {
				// If client is reconnecting, only send new messages that client has not seen yet
				if (lastMessage && lastMessage > -1) {
					// When reconnecting, always send up to 100 messages to prevent message gaps on the client
					// See https://github.com/thelounge/thelounge/issues/1883
					newChannel[prop] = this[prop].filter((m) => m.id > lastMessage).slice(-100);
				} else {
					// If channel is active, send up to 100 last messages, for all others send just 1
					// Client will automatically load more messages whenever needed based on last seen messages
					const messagesToSend =
						lastActiveChannel === true || this.id === lastActiveChannel ? 100 : 1;

					newChannel[prop] = this[prop].slice(-messagesToSend);
				}

				(newChannel as FilteredChannel).totalMessages = this[prop].length;
			} else {
				newChannel[prop] = this[prop];
			}

			return newChannel;
		}, {}) as FilteredChannel;
	}
	writeUserLog(client: Client, msg: Msg) {
		this.messages.push(msg);

		// Are there any logs enabled
		if (client.messageStorage.length === 0) {
			return;
		}

		const targetChannel: Chan = this;

		// Is this particular message or channel loggable
		if (!msg.isLoggable() || !this.isLoggable()) {
			// Because notices are nasty and can be shown in active channel on the client
			// if there is no open query, we want to always log notices in the sender's name
			if (msg.type === MessageType.NOTICE && msg.showInActive) {
				targetChannel.name = msg.from.nick || ""; // TODO: check if || works
			} else {
				return;
			}
		}

		// Find the parent network where this channel is in
		const target = client.find(this.id);

		if (!target) {
			return;
		}

		for (const messageStorage of client.messageStorage) {
			messageStorage.index(target.network, targetChannel, msg).catch((e) => log.error(e));
		}
	}
	loadMessages(client: Client, network: Network) {
		if (!this.isLoggable()) {
			return;
		}

		if (!network.irc) {
			// Network created, but misconfigured
			log.warn(
				`Failed to load messages for ${client.name}, network ${network.name} is not initialized.`
			);
			return;
		}

		if (!client.messageProvider) {
			if (network.irc.network.cap.isEnabled("znc.in/playback")) {
				// if we do have a message provider we might be able to only fetch partial history,
				// so delay the cap in this case.
				requestZncPlayback(this, network, 0);
			}

			return;
		}

		client.messageProvider
			.getMessages(network, this, () => client.idMsg++)
			.then((messages) => {
				if (messages.length === 0) {
					if (network.irc!.network.cap.isEnabled("znc.in/playback")) {
						requestZncPlayback(this, network, 0);
					}

					return;
				}

				this.messages.unshift(...messages);

				if (!this.firstUnread) {
					this.firstUnread = messages[messages.length - 1].id;
				}

				client.emit("more", {
					chan: this.id,
					messages: messages.slice(-100),
					totalMessages: messages.length,
				});

				if (network.irc!.network.cap.isEnabled("znc.in/playback")) {
					const from = Math.floor(messages[messages.length - 1].time.getTime() / 1000);

					requestZncPlayback(this, network, from);
				}
			})
			.catch((err: Error) =>
				log.error(`Failed to load messages for ${client.name}: ${err.toString()}`)
			);
	}
	isLoggable() {
		return this.type === ChanType.CHANNEL || this.type === ChanType.QUERY;
	}
	setMuteStatus(muted: boolean) {
		this.muted = !!muted;
	}
}

function requestZncPlayback(channel, network, from) {
	network.irc.raw("ZNC", "*playback", "PLAY", channel.name, from.toString());
}

export default Chan;

export type Channel = Chan;
