import {IrcEventHandler} from "../../client.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";

export default <IrcEventHandler>function (irc, network) {

	irc.on("topic", (data) => {
		const chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			return;
		}

		const msg = new Msg({
			time: data.time,
			type: MessageType.TOPIC,
			from: data.nick && chan.getUser(data.nick),
			text: data.topic,
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(this, msg);

		chan.topic = data.topic;
		this.emit("topic", {
			chan: chan.id,
			topic: chan.topic,
		});
	});

	irc.on("topicsetby", (data) => {
		const chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			return;
		}

		const msg = new Msg({
			type: MessageType.TOPIC_SET_BY,
			from: chan.getUser(data.nick),
			when: new Date(data.when * 1000),
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(this, msg);
	});
};
