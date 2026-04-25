import type {IrcEventHandler} from "../../client";
import Msg from "../../models/msg";
import {ChanType} from "../../../shared/types/chan";
import {MessageType} from "../../../shared/types/msg";

// https://ircv3.net/specs/extensions/monitor
// https://ircv3.net/specs/extensions/extended-monitor
export default <IrcEventHandler>function (irc, network) {
	const client = this;

	function getMonitoredQuery(nick: string) {
		const channel = network.getChannel(nick);
		return channel?.type === ChanType.QUERY ? channel : undefined;
	}

	// RPL_MONONLINE (730) / RPL_MONOFFLINE (731)
	function handleMonitorStatus(nicks: string[], online: boolean) {
		const changedChannels: string[] = [];

		for (const nick of nicks) {
			const channel = getMonitoredQuery(nick);

			if (channel && channel.isOnline !== online) {
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

	// ERR_MONLISTFULL (734). Surface as a status message — the user didn't
	// trigger MONITOR directly, so this is informational, not an error.
	irc.on("irc error", function (data) {
		if (data.error !== "monitor_list_full") {
			return;
		}

		network.getLobby().pushMessage(
			client,
			new Msg({
				text: "Your monitor list is full on this network; some queries may not show online/away status.",
			}),
			true
		);
	});

	// account-notify for a monitored nick we don't share a channel with
	irc.on("account", function (data) {
		if (network.serverOptions.MONITOR === null) {
			return;
		}

		const channel = getMonitoredQuery(data.nick);

		if (!channel || channel.findUser(data.nick)) {
			return;
		}

		channel.pushMessage(
			client,
			new Msg({
				time: data.time,
				type: data.account ? MessageType.LOGIN : MessageType.LOGOUT,
				from: channel.getUser(data.nick),
				text: data.account || "",
			})
		);
	});
};
