import Msg, {MessageType} from "../../models/msg";
import Chan, {ChanState, ChanType} from "../../models/chan";
import User from "../../models/user";
import type {IrcEventHandler} from "../../client";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("join", function (data) {
		const performWhoOnChannel = (chan: Chan) => {
			if (chan.type !== ChanType.CHANNEL) {
				return;
			}

			irc.who(chan.name, (whoData) => {
				for (const user of whoData.users) {
					chan.setUser(
						new User({
							nick: user.nick,
							away: user.away,
							account: user.account,
						})
					);
				}
			});
		};

		let chan = network.getChannel(data.channel);
		const isSelf = data.nick === irc.user.nick;

		if (typeof chan === "undefined") {
			chan = client.createChannel({
				name: data.channel,
				state: ChanState.JOINED,
			});

			client.emit("join", {
				network: network.uuid,
				chan: chan.getFilteredClone(true),
				index: network.addChannel(chan),
			});
			client.save();

			chan.loadMessages(client, network);

			// Request channels' modes
			network.irc.raw("MODE", chan.name);
		} else if (isSelf) {
			chan.state = ChanState.JOINED;

			client.emit("channel:state", {
				chan: chan.id,
				state: chan.state,
			});
		}

		const user = new User({nick: data.nick, account: data.account});
		const msg = new Msg({
			time: data.time,
			from: user,
			hostmask: data.ident + "@" + data.hostname,
			gecos: data.gecos,
			account: data.account,
			type: MessageType.JOIN,
			self: isSelf,
		});
		chan.pushMessage(client, msg);

		chan.setUser(user);
		client.emit("users", {
			chan: chan.id,
		});

		// If we join a channel, we perform a WHO to get all the users away statuses
		if (isSelf) {
			performWhoOnChannel(chan);
		}
	});
};
