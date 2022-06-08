import Msg, {MessageType} from "../../models/msg";
import Helper from "../../helper";
import {PluginInputHandler} from "./index";
import {IgnoreListItem} from "../../models/network";
import {ChanType, SpecialChanType} from "../../models/chan";

const commands = ["ignore", "unignore", "ignorelist"];

const input: PluginInputHandler = function (network, chan, cmd, args) {
	const client = this;
	let target: string;
	// let hostmask: cmd === "ignoreList" ? string : undefined;
	let hostmask: IgnoreListItem | undefined;

	if (cmd !== "ignorelist" && (args.length === 0 || args[0].trim().length === 0)) {
		chan.pushMessage(
			client,
			new Msg({
				type: MessageType.ERROR,
				text: `Usage: /${cmd} <nick>[!ident][@host]`,
			})
		);

		return;
	}

	if (cmd !== "ignorelist") {
		// Trim to remove any spaces from the hostmask
		target = args[0].trim();
		hostmask = Helper.parseHostmask(target) as IgnoreListItem;
	}

	switch (cmd) {
		case "ignore": {
			// IRC nicks are case insensitive
			if (hostmask!.nick.toLowerCase() === network.nick.toLowerCase()) {
				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: "You can't ignore yourself",
					})
				);
			} else if (
				!network.ignoreList.some(function (entry) {
					return Helper.compareHostmask(entry, hostmask!);
				})
			) {
				hostmask!.when = Date.now();
				network.ignoreList.push(hostmask!);

				client.save();
				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: `\u0002${hostmask!.nick}!${hostmask!.ident}@${
							hostmask!.hostname
						}\u000f added to ignorelist`,
					})
				);
			} else {
				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: "The specified user/hostmask is already ignored",
					})
				);
			}

			break;
		}

		case "unignore": {
			const idx = network.ignoreList.findIndex(function (entry) {
				return Helper.compareHostmask(entry, hostmask!);
			});

			// Check if the entry exists before removing it, otherwise
			// let the user know.
			if (idx !== -1) {
				network.ignoreList.splice(idx, 1);
				client.save();

				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: `Successfully removed \u0002${hostmask!.nick}!${hostmask!.ident}@${
							hostmask!.hostname
						}\u000f from ignorelist`,
					})
				);
			} else {
				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: "The specified user/hostmask is not ignored",
					})
				);
			}

			break;
		}

		case "ignorelist":
			if (network.ignoreList.length === 0) {
				chan.pushMessage(
					client,
					new Msg({
						type: MessageType.ERROR,
						text: "Ignorelist is empty",
					})
				);
			} else {
				const chanName = "Ignored users";
				const ignored = network.ignoreList.map((data) => ({
					hostmask: `${data.nick}!${data.ident}@${data.hostname}`,
					when: data.when,
				}));
				let newChan = network.getChannel(chanName);

				if (typeof newChan === "undefined") {
					newChan = client.createChannel({
						type: ChanType.SPECIAL,
						special: SpecialChanType.IGNORELIST,
						name: chanName,
						data: ignored,
					});
					client.emit("join", {
						network: network.uuid,
						chan: newChan.getFilteredClone(true),
						index: network.addChannel(newChan),
					});
				} else {
					// TODO: add type for this chan/event
					newChan.data = ignored;

					client.emit("msg:special", {
						chan: newChan.id,
						data: ignored,
					});
				}
			}

			break;
	}
};

export default {
	commands,
	input,
};
