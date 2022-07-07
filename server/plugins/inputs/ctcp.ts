import Msg, {MessageType} from "../../models/msg";
import {PluginInputHandler} from "./index";

const commands = ["ctcp"];

const input: PluginInputHandler = function ({irc}, chan, cmd, args) {
	if (args.length < 2) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: "Usage: /ctcp <nick> <ctcp_type>",
			})
		);
		return;
	}

	const target = args.shift()!;
	const type = args.shift()!;

	chan.pushMessage(
		this,
		new Msg({
			type: MessageType.CTCP_REQUEST,
			ctcpMessage: `"${type}" to ${target}`,
			from: chan.getUser(irc.user.nick),
		})
	);

	irc.ctcpRequest(target, type, ...args);
};

export default {
	commands,
	input,
};
