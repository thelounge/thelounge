import Msg from "../../models/msg.js";
import User from "../../models/user.js";
import type {IrcEventHandler} from "../../client.js";
import {MessageType} from "../../../shared/types/msg.js";
import {ChanState} from "../../../shared/types/chan.js";

export default <IrcEventHandler>function (irc, network) {

	irc.on("join", (data) => {
		let chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			chan = this.createChannel({
				name: data.channel,
				state: ChanState.JOINED,
			});

			this.emit("join", {
				network: network.uuid,
				chan: chan.getFilteredClone(true),
				shouldOpen: false,
				index: network.addChannel(chan),
			});
			this.save();

			chan.loadMessages(this, network);

			// Request channels' modes
			network.irc.raw("MODE", chan.name);
		} else if (data.nick === irc.user.nick) {
			chan.state = ChanState.JOINED;

			this.emit("channel:state", {
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
		chan.pushMessage(this, msg);

		chan.setUser(new User({nick: data.nick}));
		this.emit("users", {
			chan: chan.id,
		});
	});
};
