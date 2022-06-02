"use strict";

import type {IrcEventHandler} from "../../client";
import {ChanType} from "../../models/chan";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("users online", function (data) {
		const changedChannels: string[] = [];

		for (const nick of data.nicks) {
			for (const channel of network.channels) {
				if (channel.type === ChanType.QUERY && channel.name === nick) {
					channel.isOnline = true;
					changedChannels.push(channel.name);
					continue;
				}
			}
		}

		client.emit("users:online", {changedChannels, networkId: network.uuid});
	});

	irc.on("users offline", function (data) {
		const changedChannels: string[] = [];

		for (const nick of data.nicks) {
			for (const channel of network.channels) {
				if (channel.type === ChanType.QUERY && channel.name === nick) {
					channel.isOnline = false;
					changedChannels.push(channel.name);
					continue;
				}
			}
		}

		client.emit("users:offline", {changedChannels, networkId: network.uuid});
	});
};
