import Msg from "../../models/msg";
import Chan from "../../models/chan";
import User from "../../models/user";
import type {IrcEventHandler} from "../../client";
import {MessageType} from "../../../shared/types/msg";
import {ChanType, ChanState} from "../../../shared/types/chan";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	const performWhoOnChannel = (chan: Chan) => {
		if (chan.type !== ChanType.CHANNEL) {
			return;
		}

		irc.who(chan.name, (whoData: {users: {nick: string; away: boolean}[]}) => {
			for (const whoUser of whoData.users) {
				const user = chan.findUser(whoUser.nick);

				if (user) {
					user.away = whoUser.away ? "away" : "";
				}
			}

			client.emit("users", {
				chan: chan.id,
			});
		});
	};

	irc.on("join", function (data) {
		let chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			chan = client.createChannel({
				name: data.channel,
				state: ChanState.JOINED,
			});

			client.emit("join", {
				network: network.uuid,
				chan: chan.getFilteredClone(true),
				shouldOpen: false,
				index: network.addChannel(chan),
			});
			client.save();

			chan.loadMessages(client, network);

			// Request channels' modes
			network.irc.raw("MODE", chan.name);
		} else if (data.nick === irc.user.nick) {
			chan.state = ChanState.JOINED;

			client.emit("channel:state", {
				chan: chan.id,
				state: chan.state,
			});
		}

		const user = new User({nick: data.nick});
		const msg = new Msg({
			time: data.time,
			from: user,
			hostmask: data.ident + "@" + data.hostname,
			gecos: data.gecos,
			account: data.account,
			type: MessageType.JOIN,
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(client, msg);

		chan.setUser(new User({nick: data.nick}));
		client.emit("users", {
			chan: chan.id,
		});

		// When we join a channel, send WHO to get initial away statuses
		if (data.nick === irc.user.nick) {
			performWhoOnChannel(chan);
		}
	});
};
