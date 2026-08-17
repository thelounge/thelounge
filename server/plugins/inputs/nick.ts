import {PluginInputHandler} from "./index";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";

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

	// Record what the user asked for before talking to the server
	network.setNick(newNick);

	// If connected to IRC, send to server and wait for ACK
	// otherwise update the nick and UI straight away
	if (network.irc) {
		if (network.irc.connected) {
			network.irc.changeNick(newNick);

			return;
		}

		network.irc.user.nick = newNick;
	}

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
