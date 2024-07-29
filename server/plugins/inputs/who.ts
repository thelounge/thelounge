import {ClientUser} from "../../../client/js/types";
import Msg, {MessageType} from "../../models/msg";
import {PluginInputHandler} from "./index";

const commands = ["who"];

const parseWhoxResponse = (user: ClientUser, args: string) => {
	const parseFieldNameForLounge = (field: string) => {
		switch (field) {
			case "nickname":
				return "nick";
			case "username":
				return "account";
			case "realname":
				return "real_name";
			case "op":
				return "operator";
			default:
				return field;
		}
	};

	const whoxFields = {
		c: "channel",
		u: "username",
		h: "hostname",
		s: "server",
		n: "nickname",
		f: "flags",
		a: "account",
		r: "realname",
	};

	if (!args) {
		return user;
	}

	const filteredResponse = {};

	for (const [token, fieldName] of Object.entries(whoxFields)) {
		// TODO: throw on unknown field?
		if (args.includes(token)) {
			const expectedField = parseFieldNameForLounge(fieldName);
			filteredResponse[expectedField] = user[expectedField];
		}
	}

	return filteredResponse;
};

const input: PluginInputHandler = function ({irc}, chan, cmd, args) {
	if (args.length === 0) {
		return;
	}

	// We use the callback instead of listening for `wholist` because
	// irc-framework doesn't support filtering WHOX.
	// This has the added benefit of easily showing it in the same buffer
	// as the WHO command.
	irc.who(args[0], (event) => {
		if (!event.users.length) {
			chan.pushMessage(
				this,
				new Msg({
					type: MessageType.ERROR,
					text: `The server returned no matching users for ${args[0]}`,
				})
			);
		}

		for (const user of event.users) {
			const filteredResponse = parseWhoxResponse(user, args[1]);
			chan.pushMessage(
				this,
				new Msg({
					type: MessageType.WHOIS,
					whois: filteredResponse,
				})
			);
		}
	});
};

export default {
	commands,
	input,
};
