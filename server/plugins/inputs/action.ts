import {PluginInputHandler, buildReplyTags} from "./index";
import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";
import {ChanType} from "../../../shared/types/chan";

const commands = ["slap", "me"];

const input: PluginInputHandler = function (network, chan, cmd, args) {
	if (chan.type !== ChanType.CHANNEL && chan.type !== ChanType.QUERY) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: `${cmd} command can only be used in channels and queries.`,
			})
		);

		return;
	}

	const irc = network.irc;
	let text;

	switch (cmd) {
		case "slap":
			text = "slaps " + args[0] + " around a bit with a large trout";
		/* fall through */

		case "me": {
			if (args.length === 0) {
				break;
			}

			text = text || args.join(" ");

			const reply = buildReplyTags(this._pendingReplyTo, network.serverOptions.supportsReply);

			if (reply.outgoing) {
				// irc.action() doesn't support tags, send as raw PRIVMSG with CTCP ACTION
				irc.sendMessage("PRIVMSG", chan.name, "\x01ACTION " + text + "\x01", reply.outgoing);
			} else {
				irc.action(chan.name, text);
			}

			// If the IRCd does not support echo-message, simulate the message
			// being sent back to us.
			if (!irc.network.cap.isEnabled("echo-message")) {
				irc.emit("action", {
					nick: irc.user.nick,
					target: chan.name,
					message: text,
					tags: reply.echo,
				});
			}

			break;
		}
	}

	return true;
};

export default {
	commands,
	input,
};
