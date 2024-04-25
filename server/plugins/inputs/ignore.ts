import Msg from "../../models/msg";
import Helper from "../../helper";
import {PluginInputHandler} from "./index";
import {MessageType} from "../../../shared/types/msg";

const commands = ["ignore", "unignore"];

const input: PluginInputHandler = function (network, chan, cmd, args) {
	const client = this;

	if (args.length === 0 || args[0].trim().length === 0) {
		chan.pushMessage(
			client,
			new Msg({
				type: MessageType.ERROR,
				text: `Usage: /${cmd} <nick>[!ident][@host]`,
			})
		);

		return;
	}

	const target = args[0].trim();
	const hostmask = Helper.parseHostmask(target);

	switch (cmd) {
		case "ignore": {
			// IRC nicks are case insensitive
			if (hostmask.nick.toLowerCase() === network.nick.toLowerCase()) {
				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: "You can't ignore yourself",
					})
				);
				return;
			}

			if (
				network.ignoreList.some(function (entry) {
					return Helper.compareHostmask(entry, hostmask);
				})
			) {
				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: "The specified user/hostmask is already ignored",
					})
				);
				return;
			}

			network.ignoreList.push({
				...hostmask,
				when: Date.now(),
			});

			client.save();
			chan.pushMessage(
				client,
				new Msg({
					type: MessageType.ERROR, // TODO: Successfully added via type.Error 🤔 ?
					text: `\u0002${hostmask.nick}!${hostmask.ident}@${hostmask.hostname}\u000f added to ignorelist`,
				})
			);
			return;
		}

		case "unignore": {
			const idx = network.ignoreList.findIndex(function (entry) {
				return Helper.compareHostmask(entry, hostmask);
			});

			if (idx === -1) {
				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: "The specified user/hostmask is not ignored",
					})
				);
				return;
			}

			network.ignoreList.splice(idx, 1);
			client.save();

			chan.pushMessage(
				client,
				new Msg({
					type: MessageType.ERROR, // TODO: Successfully removed via type.Error 🤔 ?
					text: `Successfully removed \u0002${hostmask.nick}!${hostmask.ident}@${hostmask.hostname}\u000f from ignorelist`,
				})
			);
		}
	}
};

export default {
	commands,
	input,
};
