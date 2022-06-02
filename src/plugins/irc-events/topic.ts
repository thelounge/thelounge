import {IrcEventHandler} from "../../client";

import Msg, {MessageType} from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("topic", function (data) {
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
		chan.pushMessage(client, msg);

		chan.topic = data.topic;
		client.emit("topic", {
			chan: chan.id,
			topic: chan.topic,
		});
	});

	irc.on("topicsetby", function (data) {
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
		chan.pushMessage(client, msg);
	});
};
