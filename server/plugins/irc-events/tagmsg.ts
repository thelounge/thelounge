import {IrcEventHandler} from "../../client";
import {ChanType} from "../../../shared/types/chan";
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

		// https://ircv3.net/specs/client-tags/react
		// react/unreact may also arrive as PRIVMSG (handled in message.ts).
		applyReactionTags(client, chan, data.nick, data.tags);
	});
};
