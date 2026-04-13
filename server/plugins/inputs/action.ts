import {PluginInputHandler} from "./index";
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

			const replyTo = this._pendingReplyTo;
			const replyTags = replyTo && network.serverOptions.supportsReply
				? {"+reply": replyTo} : undefined;

			if (replyTags) {
				// irc.action() doesn't support tags
				// TODO: use action() once this merges: https://github.com/kiwiirc/irc-framework/pull/411
				irc.sendMessage("PRIVMSG", chan.name, "\x01ACTION " + text + "\x01", replyTags);
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
					tags: replyTo ? {"+reply": replyTo} : undefined,
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
