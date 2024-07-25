import socket from "../socket";
import {store} from "../store";
import {switchToChannel} from "../router";
import {ChanType} from "../../../shared/types/chan";

export function input(args: string[]): boolean {
	if (args.length > 0) {
		let channels = args[0];

		if (channels.length > 0) {
			const chanTypes = store.state.activeChannel?.network.serverOptions.CHANTYPES;
			const channelList = args[0].split(",");

			if (chanTypes && chanTypes.length > 0) {
				for (let c = 0; c < channelList.length; c++) {
					if (!chanTypes.includes(channelList[c][0])) {
						channelList[c] = chanTypes[0] + channelList[c];
					}
				}
			}

			channels = channelList.join(",");

			const chan = store.getters.findChannelOnCurrentNetwork(channels);

			if (chan) {
				switchToChannel(chan);
			} else {
				if (store.state.activeChannel) {
					socket.emit("input", {
						text: `/join ${channels} ${args.length > 1 ? args[1] : ""}`,
						target: store.state.activeChannel.channel.id,
					});
				}

				return true;
			}
		}
	} else if (store.state.activeChannel?.channel.type === ChanType.CHANNEL) {
		// If `/join` command is used without any arguments, re-join current channel
		socket.emit("input", {
			target: store.state.activeChannel.channel.id,
			text: `/join ${store.state.activeChannel.channel.name}`,
		});

		return true;
	}

	return false;
}
