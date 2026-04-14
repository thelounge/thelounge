import type {IrcEventHandler} from "../../client";
import {ChanType} from "../../../shared/types/chan";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	function handleMonitorStatus(nicks: string[], online: boolean) {
		const changedChannels: string[] = [];

		for (const nick of nicks) {
			const channel = network.getChannel(nick);

			if (channel?.type === ChanType.QUERY && channel.isOnline !== online) {
				channel.isOnline = online;
				changedChannels.push(channel.name);
			}
		}

		if (changedChannels.length > 0) {
			client.emit(online ? "users:online" : "users:offline", {
				changedChannels,
				networkId: network.uuid,
			});
		}
	}

	irc.on("users online", (data) => handleMonitorStatus(data.nicks, true));
	irc.on("users offline", (data) => handleMonitorStatus(data.nicks, false));
};
