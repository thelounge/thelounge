import Msg, {MessageType} from "../../models/msg";
import {PluginInputHandler} from "./index";

const commands = ["connect", "server"];
const allowDisconnected = true;

const input: PluginInputHandler = function (network, chan, cmd, args) {
	if (args.length === 0) {
		network.userDisconnected = false;
		this.save();

		const irc = network.irc;

		if (!irc) {
			return;
		}

		if (irc.connection && irc.connection.connected) {
			chan.pushMessage(
				this,
				new Msg({
					type: MessageType.ERROR,
					text: "You are already connected.",
				})
			);
			return;
		}

		irc.connect();

		return;
	}

	let port = args[1] || "";
	const tls = port[0] === "+";

	if (tls) {
		port = port.substring(1);
	}

	const host = args[0];
	this.connectToNetwork({host, port, tls});

	return true;
};

export default {
	commands,
	input,
	allowDisconnected,
};
