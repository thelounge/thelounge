import {PluginInputHandler} from "./index.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";

const commands = ["nick"];
const allowDisconnected = true;

const input: PluginInputHandler = function (network, chan, cmd, args) {
	if (args.length === 0) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: "Usage: /nick <your new nick>",
			})
		);
		return;
	}

	if (args.length !== 1) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: "Nicknames may not contain spaces.",
			})
		);
		return;
	}

	const newNick = args[0];

	if (newNick.length > 100) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: "Nicknames may not be this long.",
			})
		);
		return;
	}

	// If we were trying to keep a nick and user changes nick, stop trying to keep the old one
	network.keepNick = null;

	// If connected to IRC, send to server and wait for ACK
	// otherwise update the nick and UI straight away
	if (network.irc) {
		if (network.irc.connected) {
			network.irc.changeNick(newNick);

			return;
		}

		network.irc.options.nick = network.irc.user.nick = newNick;
	}

	network.setNick(newNick);

	this.emit("nick", {
		network: network.uuid,
		nick: newNick,
	});

	this.save();
};

export default {
	commands,
	input,
	allowDisconnected,
};
