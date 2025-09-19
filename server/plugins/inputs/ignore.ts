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
				text: `Usage: /${cmd} <nick>[!ident][@host] [messageRegex]`,
			})
		);
		return;
	}

	const target = args[0].trim();
	const targetRegex = args.slice(1).join(" ").trim(); // everything after hostmask is message regex (opt)

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
				network.ignoreList.some(
					(entry) =>
						Helper.compareHostmask(entry, hostmask) &&
						(entry.messageRegex || "") === targetRegex
				)
			) {
				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: "The specified user/hostmask/regex is already ignored",
					})
				);
				return;
			}

			let validRegex = "";

			if (targetRegex !== "") {
				try {
					new RegExp(targetRegex);
					validRegex = targetRegex;
				} catch (e) {
					chan.pushMessage(
						client,
						new Msg({
							type: MessageType.ERROR,
							text: `Invalid message regex: ${targetRegex}`,
						})
					);
					return;
				}
			}

			network.ignoreList.push({
				...hostmask,
				when: Date.now(),
				messageRegex: validRegex,
			});

			client.save();

			chan.pushMessage(
				client,
				new Msg({
					type: MessageType.ERROR,
					text:
						`\u0002${hostmask.nick}!${hostmask.ident}@${hostmask.hostname}\u000f added to ignorelist` +
						(validRegex ? ` with regex: /${validRegex}/` : ""),
				})
			);
			return;
		}

		case "unignore": {
			const idx = network.ignoreList.findIndex(
				(entry) =>
					Helper.compareHostmask(entry, hostmask) &&
					(entry.messageRegex || "") === targetRegex
			);

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

			let messageSuffix: string = "from ignorelist";

			if (targetRegex !== "") {
				messageSuffix = `with message regex \u0002${targetRegex}\u000f from ignorelist`;
			}

			chan.pushMessage(
				client,
				new Msg({
					type: MessageType.ERROR, // TODO: Successfully removed via type.Error 🤔 ?
					text: `Successfully removed \u0002${hostmask.nick}!${hostmask.ident}@${hostmask.hostname}\u000f ${messageSuffix}`,
				})
			);
		}
	}
};

export default {
	commands,
	input,
};
