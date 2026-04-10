import type {IrcEventHandler} from "../../client";
import {ChanType} from "../../../shared/types/chan";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("users online", function (data) {
		const changedChannels: string[] = [];

		for (const nick of data.nicks) {
			const normalizedNick = nick.toLowerCase();

			for (const channel of network.channels) {
				if (channel.type === ChanType.QUERY && channel.name.toLowerCase() === normalizedNick) {
					channel.isOnline = true;

					changedChannels.push(channel.name);
					break;
				}
			}
		}

		if (changedChannels.length > 0) {
			client.emit("users:online", {changedChannels, networkId: network.uuid});
		}
	});

	irc.on("users offline", function (data) {
		const changedChannels: string[] = [];

		for (const nick of data.nicks) {
			const normalizedNick = nick.toLowerCase();

			for (const channel of network.channels) {
				if (channel.type === ChanType.QUERY && channel.name.toLowerCase() === normalizedNick) {
					channel.isOnline = false;
					changedChannels.push(channel.name);
					break;
				}
			}
		}

		if (changedChannels.length > 0) {
			client.emit("users:offline", {changedChannels, networkId: network.uuid});
		}
	});
};
