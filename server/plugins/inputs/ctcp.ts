import Msg from "../../models/msg.js";
import {PluginInputHandler} from "./index.js";
import {MessageType} from "../../../shared/types/msg.js";

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
