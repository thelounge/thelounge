import {IrcEventHandler} from "../../client";
import {ChanType} from "../../../shared/types/chan";
import {VALID_TYPING_STATUSES, TypingStatus} from "../../../shared/types/typing";
import {applyReactionTags} from "./reactions";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("tagmsg", function (data) {
		if (network.isIgnoredUser(data)) {
			return;
		}

		let target = data.target;

		if (target.toLowerCase() === irc.user.nick.toLowerCase()) {
			target = data.nick;
		}

		const chan = network.getChannel(target);

		if (!chan) {
			return;
		}

		if (chan.type !== ChanType.CHANNEL && chan.type !== ChanType.QUERY) {
			return;
		}

		// React/unreact may also arrive as PRIVMSG (handled in message.ts).
		// https://ircv3.net/specs/client-tags/react
		applyReactionTags(client, chan, data.nick, data.tags);

		// https://ircv3.net/specs/client-tags/typing
		// Don't echo our own typing status back to ourselves.
		if (data.nick === irc.user.nick) {
			return;
		}

		const typing = data.tags["+typing"];

		if (typing && VALID_TYPING_STATUSES.has(typing as TypingStatus)) {
			client.emit("typing", {
				network: network.uuid,
				chan: chan.id,
				nick: data.nick,
				status: typing as TypingStatus,
			});
		}
	});
};
