import Msg from "../../models/msg.js";
import LinkPrefetch from "./link.js";
import {cleanIrcMessage} from "../../../shared/irc.js";
import Helper from "../../helper.js";
import {IrcEventHandler} from "../../client.js";
import type Client from "../../client.js";
import Chan from "../../models/chan.js";
import User from "../../models/user.js";
import {MessageType} from "../../../shared/types/msg.js";
import {ChanType} from "../../../shared/types/chan.js";
import {MessageEventArgs} from "irc-framework";

const nickRegExp = /(?:\x03[0-9]{1,2}(?:,[0-9]{1,2})?)?([\w[\]\\`^{|}-]+)/g;

type HandleInput = {
	nick: string;
	hostname: string;
	ident: string;
	target: string;
	type: MessageType;
	time?: number;
	text?: string;
	from_server?: boolean;
	message: string;
	group?: string;
};

function convertForHandle(type: MessageType, data: MessageEventArgs): HandleInput {
	return {...data, type: type};
}

export default <IrcEventHandler>function (this: Client, irc, network) {
	irc.on("notice", (data) => {
		handleMessage.call(this, convertForHandle(MessageType.NOTICE, data));
	});

	irc.on("action", (data) => {
		handleMessage.call(this, convertForHandle(MessageType.ACTION, data));
	});

	irc.on("privmsg", (data) => {
		handleMessage.call(this, convertForHandle(MessageType.MESSAGE, data));
	});

	irc.on("wallops", (data) => {
		data.from_server = true;
		handleMessage.call(this, convertForHandle(MessageType.WALLOPS, data));
	});

	function handleMessage(this: Client, data: HandleInput) {
		let chan: Chan | undefined;
		let from: User;
		let highlight = false;
		let showInActive = false;
		const self = data.nick === irc.user.nick;

		// Some servers send messages without any nickname
		if (!data.nick) {
			data.from_server = true;
			data.nick = data.hostname || network.host;
		}

		// Check if the sender is in our ignore list
		const shouldIgnore =
			!self &&
			network.ignoreList.some(function (entry) {
				return Helper.compareHostmask(entry, data);
			});

		// Server messages that aren't targeted at a channel go to the server window
		if (
			data.from_server &&
			(!data.target ||
				!network.getChannel(data.target) ||
				network.getChannel(data.target)?.type !== ChanType.CHANNEL)
		) {
			chan = network.getLobby();
			from = chan.getUser(data.nick);
		} else {
			if (shouldIgnore) {
				return;
			}

			let target = data.target;

			// If the message is targeted at us, use sender as target instead
			if (target.toLowerCase() === irc.user.nick.toLowerCase()) {
				target = data.nick;
			}

			chan = network.getChannel(target);

			if (typeof chan === "undefined") {
				// Send notices that are not targeted at us into the server window
				if (data.type === MessageType.NOTICE) {
					showInActive = true;
					chan = network.getLobby();
				} else {
					chan = this.createChannel({
						type: ChanType.QUERY,
						name: target,
					});

					this.emit("join", {
						network: network.uuid,
						chan: chan.getFilteredClone(true),
						shouldOpen: false,
						index: network.addChannel(chan),
					});
					this.save();
					chan.loadMessages(this, network);
				}
			}

			from = chan.getUser(data.nick);

			// Query messages (unless self or muted) always highlight
			if (chan.type === ChanType.QUERY) {
				highlight = !self;
			} else if (chan.type === ChanType.CHANNEL) {
				from.lastMessage = data.time || Date.now();
			}
		}

		// msg is constructed down here because `from` is being copied in the constructor
		const msg = new Msg({
			type: data.type,
			time: data.time ? new Date(data.time) : undefined,
			text: data.message,
			self: self,
			from: from,
			highlight: highlight,
			users: [],
		});

		if (showInActive) {
			msg.showInActive = true;
		}

		// remove IRC formatting for custom highlight testing
		const cleanMessage = cleanIrcMessage(data.message);

		// Self messages in channels are never highlighted
		// Non-self messages are highlighted as soon as the nick is detected
		if (!msg.highlight && !msg.self) {
			msg.highlight = network.highlightRegex?.test(data.message);

			// If we still don't have a highlight, test against custom highlights if there's any
			if (!msg.highlight && this.highlightRegex) {
				msg.highlight = this.highlightRegex.test(cleanMessage);
			}
		}

		// if highlight exceptions match, do not highlight at all
		if (msg.highlight && this.highlightExceptionRegex) {
			msg.highlight = !this.highlightExceptionRegex.test(cleanMessage);
		}

		if (data.group) {
			msg.statusmsgGroup = data.group;
		}

		let match: RegExpExecArray | null;

		while ((match = nickRegExp.exec(data.message))) {
			if (chan.findUser(match[1])) {
				msg.users.push(match[1]);
			}
		}

		// No prefetch URLs unless are simple MESSAGE or ACTION types
		if ([MessageType.MESSAGE, MessageType.ACTION].includes(data.type)) {
			LinkPrefetch(this, chan, msg, cleanMessage);
		}

		chan.pushMessage(this, msg, !msg.self);

		// Do not send notifications if the channel is muted or for messages older than 15 minutes (znc buffer for example)
		if (!chan.muted && msg.highlight && (!data.time || data.time > Date.now() - 900000)) {
			let title = chan.name;
			let body = cleanMessage;

			if (msg.type === MessageType.ACTION) {
				// For actions, do not include colon in the message
				body = `${data.nick} ${body}`;
			} else if (chan.type !== ChanType.QUERY) {
				// In channels, prepend sender nickname to the message
				body = `${data.nick}: ${body}`;
			}

			// If a channel is active on any this, highlight won't increment and notification will say (0 mention)
			if (chan.highlight > 0) {
				title += ` (${chan.highlight} ${
					chan.type === ChanType.QUERY ? "new message" : "mention"
				}${chan.highlight > 1 ? "s" : ""})`;
			}

			if (chan.highlight > 1) {
				body += `\n\n… and ${chan.highlight - 1} other message${
					chan.highlight > 2 ? "s" : ""
				}`;
			}

			this.manager.webPush.push(
				this,
				{
					type: "notification",
					chanId: chan.id,
					timestamp: data.time || Date.now(),
					title: title,
					body: body,
				},
				true
			);
		}

		// Keep track of all mentions in channels for this this
		if (msg.highlight && chan.type === ChanType.CHANNEL) {
			this.mentions.push({
				chanId: chan.id,
				msgId: msg.id,
				type: msg.type,
				time: msg.time,
				text: msg.text,
				from: msg.from,
			});

			if (this.mentions.length > 100) {
				this.mentions.splice(0, this.mentions.length - 100);
			}
		}
	}
};
